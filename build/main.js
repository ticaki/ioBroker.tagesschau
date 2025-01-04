"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_library = require("./lib/library");
var import_definition = require("./lib/definition");
var import_axios = __toESM(require("axios"));
class Tagesschau extends utils.Adapter {
  library;
  additionalConfig = { allTags: [] };
  updateTimeout = void 0;
  topics = [
    "inland",
    "ausland",
    "wirtschaft",
    "sport",
    "video",
    "investigativ",
    "wissen"
  ];
  regions = "";
  constructor(options = {}) {
    super({
      ...options,
      name: "tagesschau"
    });
    this.library = new import_library.Library(this);
    this.on("ready", this.onReady.bind(this));
    this.on("message", this.onMessage.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  /**
   * Is called when databases are connected and adapter received configuration
   */
  async onReady() {
    await this.library.init();
    await this.library.initStates(await this.getStatesAsync("*"));
    const maxRegions = 16;
    this.config.interval = (typeof this.config.interval !== "number" || this.config.interval < 5 || this.config.interval > 1e5 ? 30 : this.config.interval) * 6e4;
    this.log.info(`Set news interval to ${this.config.interval / 6e4} minutes`);
    let obj;
    try {
      obj = await this.getForeignObjectAsync(this.namespace);
    } catch {
    }
    if (!obj) {
      await this.setForeignObject(this.namespace, {
        type: "meta",
        common: { name: "Tagesschau Instanze", type: "meta.folder" },
        native: {}
      });
    }
    for (let i = 1; i <= maxRegions; i++) {
      const k = `L${i.toString()}`;
      this.regions += this.config[k] === true ? i + (this.regions ? "," : "") : "";
    }
    if (this.regions.length === 0) {
      this.log.warn("No regions selected! Adapter paused!");
      return;
    }
    if (!this.config.videosEnabled && !this.config.newsEnabled) {
      this.log.warn("No news or videos selected! Adapter paused!");
      return;
    }
    const topics = [
      "inland",
      "ausland",
      "wirtschaft",
      "sport",
      "video",
      "investigativ",
      "wissen"
    ];
    this.topics = topics.filter((topic) => this.config[topic] === true);
    if (this.topics.length === 0) {
      this.log.warn("No topics selected! Adapter stopped!");
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
    if (this.config.newsEnabled) {
      await this.updateNews();
    } else {
      await this.library.garbageColleting(`news`, 6e4, false);
    }
    if (this.config.videosEnabled) {
      await this.updateVideos();
    } else {
      await this.library.garbageColleting(`videos`, 6e4, false);
    }
    this.update();
  }
  update() {
    this.updateTimeout = this.setTimeout(async () => {
      if (this.config.newsEnabled) {
        await this.updateNews();
      }
      if (this.config.videosEnabled) {
        await this.updateVideos();
      }
      this.update();
    }, 3e5);
  }
  async updateNews() {
    await this.library.writedp(`news`, void 0, import_definition.statesObjects[`news`]._channel);
    for (const topic of this.topics) {
      await this.library.writedp(
        `news.${topic}`,
        void 0,
        //@ts-expect-error
        import_definition.statesObjects.news[topic]._channel
      );
      const url = `https://www.tagesschau.de/api2u/news/?regions=${this.regions}&ressort=${topic}`;
      this.log.debug(`URL: ${url}`);
      try {
        const response = await import_axios.default.get(url, { headers: { accept: "application/json" } });
        if (response.status === 200 && response.data) {
          this.log.debug(`Response: ${JSON.stringify(response.data)}`);
          const data = response.data;
          if (data.news) {
            for (const news of data.news) {
              if (news.tags) {
                for (const tag of news.tags) {
                  if (!this.additionalConfig.allTags.includes(tag.tag)) {
                    this.additionalConfig.allTags.push(tag.tag);
                  }
                }
              }
            }
            data.news = data.news.filter(
              (news) => news.tags && news.tags.some((tag) => this.config.selectedTags.includes(tag.tag))
            );
            data.news = data.news.slice(0, this.config.maxEntries);
            data.newsCount = data.news.length;
            for (const news of data.news) {
              for (const key of import_definition.filterPartOfNews) {
                const k = key;
                delete news[k];
              }
            }
          }
          await this.library.writeFromJson(`news.${topic}`, `news.${topic}`, import_definition.statesObjects, data, true);
          await this.library.garbageColleting(`news.${topic}`, 6e4, true);
        }
        const obj = await this.getForeignObjectAsync(this.namespace);
        if (obj) {
          obj.native = obj.native || {};
          obj.native.additionalConfig = this.additionalConfig;
          await this.setForeignObject(this.namespace, obj);
        }
      } catch (e) {
        this.log.error(`Error: ${e}`);
      }
    }
  }
  async updateVideos() {
    await this.library.writedp(`videos`, void 0, import_definition.statesObjects.videos._channel);
    const url = `https://www.tagesschau.de/api2u/channels`;
    this.log.debug(`URL: ${url}`);
    try {
      const response = await import_axios.default.get(url, { headers: { accept: "application/json" } });
      if (response.status === 200 && response.data) {
        this.log.debug(`Response: ${JSON.stringify(response.data)}`);
        const data = response.data;
        data.channels = data.channels.slice(0, this.config.maxEntries);
        await this.library.writeFromJson(`videos`, `videos`, import_definition.statesObjects, data, true);
        await this.library.garbageColleting(`videos`, 6e4, true);
      }
    } catch (e) {
      this.log.error(`Error: ${e}`);
    }
  }
  onMessage(obj) {
    if (typeof obj === "object" && obj.message) {
      if (obj.command === "selectNewsTags") {
        const json = this.additionalConfig.allTags.map((tag) => {
          const r = { value: "", label: "" };
          r.value = tag;
          r.label = tag;
          return r;
        });
        this.sendTo(obj.from, obj.command, json, obj.callback);
      }
      this.sendTo(obj.from, obj.command, "Message received", obj.callback);
    }
  }
  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   *
   * @param callback Callback function
   */
  onUnload(callback) {
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
  module.exports = (options) => new Tagesschau(options);
} else {
  (() => new Tagesschau())();
}
module.exports = Tagesschau;
//# sourceMappingURL=main.js.map
