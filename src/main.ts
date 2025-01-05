/*
 * Created with @iobroker/create-adapter v2.6.5
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import type { NewsEntity, responseType, videosType } from './lib/types-d';
import { Library, sleep } from './lib/library';
import {
    filterPartOfNews,
    genericStateObjects,
    newsDefault,
    statesObjects,
    type statesObjectsType,
} from './lib/definition';
import axios from 'axios';
axios.defaults.timeout = 10000;

// Load your modules here, e.g.:
// import * as fs from "fs";

class Tagesschau extends utils.Adapter {
    library: Library;
    additionalConfig: { allTags: string[] } = { allTags: [] };
    updateTimeout: ioBroker.Timeout | undefined = undefined;
    topics = [
        'inland',
        'ausland',
        'wirtschaft',
        'sport',
        'video',
        'investigativ',
        'wissen',
    ] as (keyof typeof this.config)[];
    regions = '';

    breakingNewsDatapointExists = false;

    isOnline = false;

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'tagesschau',
        });
        this.library = new Library(this);
        this.on('ready', this.onReady.bind(this));
        // this.on('stateChange', this.onStateChange.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.....
     */
    private async onReady(): Promise<void> {
        // 1=Baden-Württemberg, 2=Bayern, 3=Berlin, 4=Brandenburg, 5=Bremen, 6=Hamburg, 7=Hessen, 8=Mecklenburg-Vorpommern, 9=Niedersachsen, 10=Nordrhein-Westfalen, 11=Rheinland-Pfalz, 12=Saarland, 13=Sachsen, 14=Sachsen-Anhalt, 15=Schleswig-Holstein, 16=Thüringen
        //  inland, ausland, wirtschaft, sport, video, investigativ, wissen.
        await this.library.init();
        await this.library.initStates(await this.getStatesAsync('*'));
        await sleep(500);
        const maxRegions = 16;

        this.config.interval =
            (typeof this.config.interval !== 'number' || this.config.interval < 5 || this.config.interval > 100000
                ? 30
                : this.config.interval) * 60000;

        this.log.info(`Set news interval to ${this.config.interval / 60000} minutes`);
        let obj;
        try {
            obj = await this.getForeignObjectAsync(this.namespace);
        } catch {
            // ignore
        }
        if (!obj) {
            await this.setForeignObject(this.namespace, {
                type: 'meta',
                common: { name: 'Tagesschau Instanze', type: 'meta.folder' },
                native: {},
            });
        }
        for (let i = 1; i <= maxRegions; i++) {
            const k = `L${i.toString()}` as keyof typeof this.config;
            this.regions += this.config[k] === true ? (this.regions ? ',' : '') + i : '';
        }
        if (this.regions.length === 0) {
            this.log.warn('No regions selected! Adapter paused!');
            return;
        }

        if (!this.config.maxEntries) {
            this.config.maxEntries = 20;
        }
        if (!this.config.videosEnabled && !this.config.newsEnabled) {
            this.log.warn('No news or videos selected! Adapter paused!');
            return;
        }
        const topics = [
            'inland',
            'ausland',
            'wirtschaft',
            'sport',
            'video',
            'investigativ',
            'wissen',
        ] as (keyof typeof this.config)[];
        this.topics = topics.filter(topic => this.config[topic] === true);
        if (this.topics.length === 0) {
            this.log.warn('No topics selected! Adapter stopped!');
            if (this.stop) {
                await this.stop();
            }
            return;
        }
        // get all tags
        obj = await this.getForeignObjectAsync(this.namespace);
        if (obj && obj.native && obj.native.additionalConfig) {
            this.additionalConfig = obj.native.additionalConfig;
        }

        // check selected tags
        if (!this.config.selectedTags) {
            this.config.selectedTags = [];
        } else {
            this.updateSelectedTags();
        }

        this.log.info(`Selected Tags: ${JSON.stringify(this.config.selectedTags)}`);
        await this.library.writedp(`breakingNewsCount`, 0, genericStateObjects.breakingNewsCount);
        const data: { news?: [NewsEntity, NewsEntity, NewsEntity, NewsEntity, NewsEntity]; newsCount: number } = {
            newsCount: 0,
            news: [newsDefault, newsDefault, newsDefault, newsDefault, newsDefault],
        };
        await this.library.writeFromJson(`news.breakingNews`, `news.breakingNews`, statesObjects, data, true, true);

        // start working

        if (this.config.newsEnabled) {
            await this.updateNews();
        } else {
            await this.library.garbageColleting(`news.`, 60000, false);
        }
        if (this.config.videosEnabled) {
            await this.updateVideos();
        } else {
            await this.library.garbageColleting(`videos.`, 60000, false);
        }
        this.update();
    }

    update(): void {
        this.updateTimeout = this.setTimeout(async () => {
            this.updateSelectedTags();
            if (this.config.newsEnabled) {
                await this.updateNews();
            }
            if (this.config.videosEnabled) {
                await this.updateVideos();
            }
            this.update();
        }, this.config.interval);
    }

    updateSelectedTags(): void {
        const selectedUserTags = this.config.selectedUserTags || [];
        for (let index = 0; index < selectedUserTags.length; index++) {
            let tempTags: typeof this.config.selectedTags = [];
            if (selectedUserTags[index].startsWith('*') || selectedUserTags[index].endsWith('*')) {
                if (selectedUserTags[index].endsWith('*') && selectedUserTags[index].startsWith('*')) {
                    tempTags = this.additionalConfig.allTags.filter(tag =>
                        tag.includes(selectedUserTags[index].slice(1, -1)),
                    );
                } else if (selectedUserTags[index].startsWith('*')) {
                    tempTags = this.additionalConfig.allTags.filter(tag =>
                        tag.endsWith(selectedUserTags[index].slice(1)),
                    );
                } else if (selectedUserTags[index].endsWith('*')) {
                    tempTags = this.additionalConfig.allTags.filter(tag =>
                        tag.startsWith(selectedUserTags[index].slice(0, -1)),
                    );
                }
            }
            if (tempTags.length > 0) {
                this.config.selectedTags = this.config.selectedTags.concat(tempTags);
            }
        }
        this.config.selectedTags = this.config.selectedTags.filter(
            (tag, index) => this.config.selectedTags.indexOf(tag) === index,
        );
        this.config.selectedTags = this.config.selectedTags.filter(tag => !tag.startsWith('*') && !tag.endsWith('*'));
    }
    /**
     * update news from tagesschau.
     */
    async updateNews(): Promise<void> {
        const bnews: NewsEntity[] = [];
        await this.library.writedp(`news`, undefined, statesObjects[`news` as keyof statesObjectsType]._channel);
        try {
            for (const topic of this.topics) {
                await this.library.writedp(
                    `news.${topic}`,
                    undefined,
                    //@ts-expect-error
                    statesObjects.news[topic]._channel,
                );

                const url = `https://www.tagesschau.de/api2u/news/?regions=${this.regions}&ressort=${topic}`;
                this.log.debug(`URL: ${url}`);
                const response = await axios.get(url, { headers: { accept: 'application/json' } });
                if (response.status === 200 && response.data) {
                    //this.log.debug(`Response: ${JSON.stringify(response.data)}`);
                    this.isOnline = true;
                    const data = response.data as responseType;
                    if (data.news) {
                        for (const news of data.news) {
                            if (news.tags) {
                                for (const tag of news.tags) {
                                    if (!(this.additionalConfig.allTags || []).includes(tag.tag)) {
                                        this.additionalConfig.allTags.push(tag.tag);
                                    }
                                }
                            }
                        }
                        if (this.config.selectedTags && this.config.selectedTags.length !== 0) {
                            data.news = data.news.filter(
                                news =>
                                    (news.tags && news.tags.some(tag => this.config.selectedTags.includes(tag.tag))) ||
                                    news.breakingNews,
                            );
                        }
                        data.news = data.news.slice(0, this.config.maxEntries);
                        data.newsCount = data.news.length;
                        for (const news of data.news) {
                            for (const key of filterPartOfNews) {
                                const k = key as keyof NewsEntity;
                                delete news[k];
                            }
                            if (news.date) {
                                news.jsDate = new Date(news.date).getTime();
                            }

                            //this.log.debug(`News: ${JSON.stringify(news)}`);
                            if (news.breakingNews) {
                                bnews.push(news);
                            }
                        }
                        // At this point we sure that the data is valid!
                        await this.library.writeFromJson(`news.${topic}`, `news.${topic}`, statesObjects, data, true);
                        await this.library.writedp(
                            `news.lastUpdate`,
                            new Date().getTime(),
                            genericStateObjects.lastUpdate,
                        );
                    }
                } else {
                    this.log.warn(`Response status: ${response.status} response statusText: ${response.statusText}`);
                }
            }
            const obj = await this.getForeignObjectAsync(this.namespace);
            if (obj) {
                obj.native = obj.native || {};
                obj.native.additionalConfig = this.additionalConfig;
                await this.setForeignObject(this.namespace, obj);
            }
            await this.library.writedp(`breakingNewsCount`, bnews.length, genericStateObjects.breakingNewsCount);
            await this.library.writeFromJson(
                `news.breakingNews`,
                `news.breakingNews`,
                statesObjects,
                { news: bnews, newsCount: bnews.length },
                true,
            );

            await this.library.garbageColleting(`news.`, 60000, false);
        } catch (e) {
            if (this.isOnline) {
                this.log.error(`Error: ${e as string}`);
            }
            this.isOnline = false;
        }
    }

    async updateVideos(): Promise<void> {
        await this.library.writedp(`videos`, undefined, statesObjects.videos._channel);
        const url = `https://www.tagesschau.de/api2u/channels`;
        this.log.debug(`URL: ${url}`);
        try {
            const response = await axios.get(url, { headers: { accept: 'application/json' } });
            if (response.status === 200 && response.data) {
                //this.log.debug(`Response: ${JSON.stringify(response.data)}`);
                this.isOnline = true;
                const data = response.data as videosType;
                data.channels = data.channels.slice(0, this.config.maxEntries);
                for (const news of data.channels) {
                    if (news.date) {
                        news.jsDate = new Date(news.date).getTime();
                    }
                    if (news.tracking) {
                        delete news.tracking;
                    }
                }
                await this.library.writeFromJson(`videos`, `videos`, statesObjects, data, true);
                await this.library.writedp('videos.lastUpdate', new Date().getTime(), genericStateObjects.lastUpdate);
                await this.library.garbageColleting(`videos.`, 60000, false);
            }
        } catch (e) {
            if (this.isOnline) {
                this.log.error(`Error: ${e as string}`);
            }
            this.isOnline = false;
        }
    }

    private onMessage(obj: ioBroker.Message): void {
        if (typeof obj === 'object' && obj.message) {
            if (obj.command === 'selectNewsTags') {
                const json = this.additionalConfig.allTags.map(tag => {
                    const r = { value: '', label: '' };
                    r.value = tag;
                    r.label = tag;
                    return r;
                });
                json.sort((a, b) => (a.label > b.label ? 1 : -1));
                this.sendTo(obj.from, obj.command, json, obj.callback);
            }

            this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     *
     * @param callback Callback function
     */
    private onUnload(callback: () => void): void {
        try {
            if (this.updateTimeout) {
                this.clearTimeout(this.updateTimeout);
            }
            callback();
        } catch {
            callback();
        }
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Tagesschau(options);
} else {
    // otherwise start the instance directly
    (() => new Tagesschau())();
}

export = Tagesschau;
