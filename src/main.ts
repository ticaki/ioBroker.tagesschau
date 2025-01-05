/*
 * Created with @iobroker/create-adapter v2.6.5
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import type { NewsEntity, responseType, videosType } from './lib/types-d';
import { Library } from './lib/library';
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
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // 1=Baden-Württemberg, 2=Bayern, 3=Berlin, 4=Brandenburg, 5=Bremen, 6=Hamburg, 7=Hessen, 8=Mecklenburg-Vorpommern, 9=Niedersachsen, 10=Nordrhein-Westfalen, 11=Rheinland-Pfalz, 12=Saarland, 13=Sachsen, 14=Sachsen-Anhalt, 15=Schleswig-Holstein, 16=Thüringen
        //  inland, ausland, wirtschaft, sport, video, investigativ, wissen
        await this.library.init();
        await this.library.initStates(await this.getStatesAsync('*'));
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

        if (!this.config.selectedTags) {
            this.config.selectedTags = [];
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
        obj = await this.getForeignObjectAsync(this.namespace);
        if (obj && obj.native && obj.native.additionalConfig) {
            this.additionalConfig = obj.native.additionalConfig;
        }
        this.log.debug(`selectedTags: ${JSON.stringify(this.config.selectedTags)}`);

        this.breakingNewsDatapointExists = !!this.library.readdb(`breakingNewsCount`);
        if (!this.breakingNewsDatapointExists) {
            await this.library.writedp(`breakingNewsCount`, 0, genericStateObjects.breakingNewsCount);
            const data: { news?: [NewsEntity, NewsEntity, NewsEntity, NewsEntity, NewsEntity]; newsCount: number } = {
                newsCount: 0,
            };
            data.news = [newsDefault, newsDefault, newsDefault, newsDefault, newsDefault];
            await this.library.writeFromJson(`news.breakingNews`, `news.breakingNews`, statesObjects, data, true);
        }
        // start working

        if (this.config.newsEnabled) {
            await this.updateNews();
        } else {
            await this.library.garbageColleting(`news`, 60000, false);
        }
        if (this.config.videosEnabled) {
            await this.updateVideos();
        } else {
            await this.library.garbageColleting(`videos`, 60000, false);
        }
        this.update();
    }
    update(): void {
        this.updateTimeout = this.setTimeout(async () => {
            if (this.config.newsEnabled) {
                await this.updateNews();
            }
            if (this.config.videosEnabled) {
                await this.updateVideos();
            }
            this.update();
        }, this.config.interval);
    }

    /**
     * update news from tagesschau.
     */
    async updateNews(): Promise<void> {
        const bnews: NewsEntity[] = [];
        await this.library.writedp(`news`, undefined, statesObjects[`news` as keyof statesObjectsType]._channel);
        for (const topic of this.topics) {
            await this.library.writedp(
                `news.${topic}`,
                undefined,
                //@ts-expect-error
                statesObjects.news[topic]._channel,
            );

            const url = `https://www.tagesschau.de/api2u/news/?regions=${this.regions}&ressort=${topic}`;
            this.log.debug(`URL: ${url}`);
            try {
                const response = await axios.get(url, { headers: { accept: 'application/json' } });
                if (response.status === 200 && response.data) {
                    //this.log.debug(`Response: ${JSON.stringify(response.data)}`);
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
                    }

                    await this.library.writeFromJson(`news.${topic}`, `news.${topic}`, statesObjects, data, true);
                    await this.library.garbageColleting(`news.${topic}`, 60000, false);
                }
                const obj = await this.getForeignObjectAsync(this.namespace);
                if (obj) {
                    obj.native = obj.native || {};
                    obj.native.additionalConfig = this.additionalConfig;
                    await this.setForeignObject(this.namespace, obj);
                }
                await this.library.writedp(`breakingNewsCount`, bnews.length, genericStateObjects.breakingNewsCount);
                const data: { news: NewsEntity[]; newsCount: number } = { news: bnews, newsCount: bnews.length };
                await this.library.writeFromJson(`news.breakingNews`, `news.breakingNews`, statesObjects, data, true);
            } catch (e) {
                this.log.error(`Error: ${e as string}`);
            }
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
                await this.library.garbageColleting(`videos`, 60000, false);
            }
        } catch (e) {
            this.log.error(`Error: ${e as string}`);
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
