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
    newsChannel,
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

    receivedNews: { [key: string]: NewsEntity[] } = {};

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'tagesschau',
        });
        this.library = new Library(this);
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
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

        this.log.info(
            'Thanks for using this adapter. I hope you enjoy it! We not in hurry so please give me some time to get the news.',
        );
        const interval = this.config.interval * 60000;
        this.config.interval =
            (typeof this.config.interval !== 'number' || this.config.interval < 5 || this.config.interval > 100000
                ? 30
                : this.config.interval) * 60000;
        const changed = interval !== this.config.interval;
        this.log.info(
            `${changed ? 'I' : 'You'} set the refresh interval to ${this.config.interval / 60000} minutes. ${changed ? 'Sorry, we have rules here!' : 'I am happy with that.'}`,
        );
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
        if (this.regions.length === 0 && this.config.newsEnabled) {
            this.log.error('No regions selected! Adapter paused!');
            return;
        }

        if (!this.config.maxEntries) {
            this.config.maxEntries = 20;
        }
        if (!this.config.videosEnabled && !this.config.newsEnabled) {
            this.log.error('Neither news nor video news activated! Adapter paused!');
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
        if (this.topics.length === 0 && this.config.newsEnabled) {
            this.log.error('No topics selected! Adapter paused!');
            return;
        }
        for (const topic of this.topics) {
            await this.library.writedp(
                `news.${topic}`,
                undefined,
                // @ts-expect-error
                statesObjects.news[topic]._channel,
            );
            await this.library.writedp(`news.${topic}.firstNewsAt`, 0, genericStateObjects.firstNewsAt);
            await this.subscribeStatesAsync(`news.${topic}.firstNewsAt`);
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

        this.log.debug(`Selected Tags: ${JSON.stringify(this.config.selectedTags)}`);
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
        await sleep(300);
        if (this.config.videosEnabled) {
            await this.updateVideos();
        } else {
            await this.library.garbageColleting(`videos.`, 60000, false);
        }
        this.update();
        this.log.info('Initialize stuff completed and new news are available. Old ones too. No more text for now on.');
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
     * update news from tagesschau..
     */
    async updateNews(): Promise<void> {
        const bnews: NewsEntity[] = [];
        await this.library.writedp(`news`, undefined, statesObjects[`news` as keyof statesObjectsType]._channel);
        try {
            for (const topic of this.topics) {
                const url = `https://www.tagesschau.de/api2u/news/?regions=${this.regions}&ressort=${topic}`;
                this.log.debug(`News URL for ${topic}: ${url}`);
                const response = await axios.get(url, { headers: { accept: 'application/json' } });
                const start = new Date().getTime();
                if (response.status === 200 && response.data) {
                    //this.log.debug(`Response: ${JSON.stringify(response.data)}`);
                    this.isOnline = true;
                    const data = response.data as responseType;
                    if (data.regional) {
                        data.regional.forEach(news => {
                            news.regional = true;
                        });
                        data.news = data.news ? data.news.concat(data.regional) : data.regional;
                    }
                    if (data.news) {
                        for (const news of data.news) {
                            if (news.tags) {
                                for (const tag of news.tags) {
                                    if (!(this.additionalConfig.allTags || []).includes(tag.tag)) {
                                        this.additionalConfig.allTags.push(tag.tag);
                                    }
                                }
                            }
                            if (news.breakingNews) {
                                news.jsDate = new Date(news.date).getTime();
                                bnews.push(news);
                            }
                        }
                        if (this.config.selectedTags && this.config.selectedTags.length !== 0) {
                            data.news = data.news.filter(
                                news => news.tags && news.tags.some(tag => this.config.selectedTags.includes(tag.tag)),
                            );
                        }
                        this.receivedNews[topic] = data.news;
                        await this.writeNews(data, topic, data.news.length);
                    }
                } else {
                    this.receivedNews[topic] = [];
                    await this.library.garbageColleting(`news.${topic}.`, 60000, false);
                    this.log.warn(`Response status: ${response.status} response statusText: ${response.statusText}`);
                }
                this.log.debug(`Time to write ${topic}: ${new Date().getTime() - start}`);
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
            for (let i = bnews.length; i < this.config.maxEntries; i++) {
                await this.library.garbageColleting(`news.breakingNews.news.${`00${i}`.slice(-2)}`, 60000, false);
                await this.library.writedp(
                    `news.breakingNews.news.${`00${i}`.slice(-2)}`,
                    undefined,
                    newsChannel.news._array,
                    undefined,
                    undefined,
                    true,
                );
            }
        } catch (e) {
            if (this.isOnline) {
                this.log.error(`Error: ${e as string}`);
            }
            this.isOnline = false;
        }
    }

    /**
     * write news to states
     *
     * @param data news data
     * @param data.news news
     * @param data.newsCount news count
     * @param topic topic
     * @param totalNews total news.
     */
    async writeNews(
        data: { news?: NewsEntity[] | null; newsCount?: number },
        topic: string,
        totalNews: number | undefined,
    ): Promise<void> {
        if (!data.news) {
            return;
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
        }
        // At this point we sure that the data is valid!
        await this.library.writeFromJson(`news.${topic}`, `news.${topic}`, statesObjects, data, true);
        await this.library.writedp(`news.lastUpdate`, new Date().getTime(), genericStateObjects.lastUpdate);
        if (totalNews !== undefined) {
            await this.library.writedp(`news.${topic}.totalNewsCount`, totalNews, genericStateObjects.totalNewsCount);
        }
        for (let i = data.news.length; i < this.config.maxEntries; i++) {
            await this.library.garbageColleting(`news.${topic}.news.${`00${i}`.slice(-2)}`, 60000, false);
            await this.library.writedp(
                `news.${topic}.news.${`00${i}`.slice(-2)}`,
                undefined,
                newsChannel.news._array,
                undefined,
                undefined,
                true,
            );
        }
    }

    /**
     * update videos from tagesschau..
     */
    async updateVideos(): Promise<void> {
        await this.library.writedp(`videos`, undefined, statesObjects.videos._channel);
        const url = `https://www.tagesschau.de/api2u/channels`;
        this.log.debug(`Videos URL: ${url}`);
        try {
            const response = await axios.get(url, { headers: { accept: 'application/json' } });
            if (response.status === 200 && response.data) {
                //this.log.debug(`Response: ${JSON.stringify(response.data)}`);
                this.isOnline = true;

                // always the same order of videos
                const data = response.data as videosType;
                const titlesSort = [
                    'Im Livestream: tagesthemen',
                    'tagesschau in 100 Sekunden',
                    'tagesschau',
                    'tagesschau',
                    'tagesthemen',
                    'tagesschau in Einfacher Sprache',
                    'tagesschau mit Gebärdensprache',
                    'tagesschau vor 20 Jahren',
                ];
                const newChannel: videosType['channels'] = [];
                for (let i = 0; i < titlesSort.length; i++) {
                    newChannel[i] = data.channels.find(c => c && c.title === titlesSort[i]);
                }
                // unknown videos
                for (const news of data.channels) {
                    if (news && newChannel.indexOf(news) === -1) {
                        newChannel.push(news);
                    }
                }
                data.channels = newChannel.slice(0, this.config.maxEntries);
                for (const news of data.channels) {
                    if (!news) {
                        continue;
                    }
                    if (news.date) {
                        news.jsDate = new Date(news.date).getTime();
                    }
                    if (news.tracking) {
                        for (const t of news.tracking) {
                            news.length = 0;
                            news.length = t.length ? t.length : news.length;
                        }
                        delete news.tracking;
                    }
                }

                await this.library.writeFromJson(`videos`, `videos`, statesObjects, data, true);
                await this.library.writedp('videos.lastUpdate', new Date().getTime(), genericStateObjects.lastUpdate);
            }

            for (let i = ((response && response.data && response.data.channels) || []).length; i < 7; i++) {
                await this.library.garbageColleting(`videos.channels.${`00${i}`.slice(-2)}`, 60000, false);
                await this.library.writedp(
                    `videos.channels.${`00${i}`.slice(-2)}`,
                    undefined,
                    newsChannel.news._array,
                    undefined,
                    undefined,
                    true,
                );
            }
        } catch (e) {
            if (this.isOnline) {
                this.log.error(`Error: ${e as string}`);
            }
            this.isOnline = false;
        }
    }

    /**
     * Is called when adapter receives a message
     *
     * @param obj The message object
     */
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
                return;
            }

            this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
        }
    }

    async onStateChange(id: string, state: ioBroker.State | null | undefined): Promise<void> {
        if (!state || state.ack) {
            return;
        }
        const parts = id.split('.');
        if (parts.length !== 5) {
            return;
        }
        const topic = parts[3];

        if (parts[4] === 'firstNewsAt') {
            // Is user input a number?
            if (typeof state.val !== 'number') {
                if (typeof state.val === 'string') {
                    try {
                        state.val = parseInt(state.val);
                        if (isNaN(state.val)) {
                            throw new Error('Invalid number');
                        }
                    } catch {
                        this.log.error(`Failed to parse state value. Number expected`);
                        return;
                    }
                } else {
                    this.log.error(`Invalid state value. Number expected`);
                    return;
                }
            }
            let news = this.receivedNews[topic];
            if (news) {
                // is the number in the range of the news?
                news = this.library.cloneGenericObject(news) as NewsEntity[];
                state.val = Math.round(state.val);
                state.val = state.val % news.length;
                state.val = state.val < 0 ? news.length + state.val : state.val;
                news = news.concat(news.slice(0, state.val));
                const end =
                    this.config.maxEntries + state.val > news.length ? news.length : this.config.maxEntries + state.val;
                news = news.slice(state.val, end);
                await this.writeNews({ news: news, newsCount: news.length }, topic, undefined);
                await this.library.writedp(
                    `news.${topic}.firstNewsAt`,
                    state.val,
                    genericStateObjects.firstNewsAt,
                    true,
                );
            }
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     *
     * @param callback Callback function
     */
    private onUnload(callback: () => void): void {
        try {
            this.log.info(
                'Thanks for using this adapter. I hope you enjoyed it. I will stop now and clean up my stuff.',
            );
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
