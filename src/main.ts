/*
 * Created with @iobroker/create-adapter v2.6.5
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import type { responseType } from './lib/types-d';
import { Library } from './lib/library';
import { statesObjects, type statesObjectsType } from './lib/definition';
import axios from 'axios';

// Load your modules here, e.g.:
// import * as fs from "fs";

class Tagesschau extends utils.Adapter {
    library: Library;
    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'tagesschau',
        });
        this.library = new Library(this);
        this.on('ready', this.onReady.bind(this));
        // this.on('stateChange', this.onStateChange.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
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
        let regions = '';
        for (let i = 1; i <= maxRegions; i++) {
            const k = i.toString() as keyof typeof this.config;
            regions += this.config[k] === true ? `${k},` : '';
        }
        if (regions.length === 0) {
            this.log.warn('No regions selected! Adapter stopped!');
            if (this.stop) {
                await this.stop();
            }
            return;
        }
        let topics = [
            'inland',
            'ausland',
            'wirtschaft',
            'sport',
            'video',
            'investigativ',
            'wissen',
        ] as (keyof typeof this.config)[];
        topics = topics.filter(topic => this.config[topic] === true);
        if (topics.length === 0) {
            this.log.warn('No topics selected! Adapter stopped!');
            if (this.stop) {
                await this.stop();
            }
            return;
        }
        for (const topic of topics) {
            await this.library.writedp(topic, undefined, statesObjects[topic as keyof statesObjectsType]._channel);

            const url = `https://www.tagesschau.de/api2u/news/?regions=${regions}&ressort=${topic}`;
            try {
                const response = await axios.get(url, { headers: { accept: 'application/json' } });
                if (response.status === 200 && response.data) {
                    this.log.debug(`Response: ${JSON.stringify(response.data)}`);
                    const data: { [key: string]: responseType } = {};
                    data[topic] = response.data as responseType;
                    await this.library.writeFromJson(topic, topic, statesObjects, data, true);
                }
            } catch (e) {
                this.log.error(`Error: ${e as string}`);
            }
        }
        if (this.stop) {
            await this.stop();
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     *
     * @param callback
     */
    private onUnload(callback: () => void): void {
        try {
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
