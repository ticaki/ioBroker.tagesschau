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
import_axios.default.defaults.timeout = 1e4;
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
  breakingNewsDatapointExists = false;
  isOnline = false;
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
   * Is called when databases are connected and adapter received configuration.....
   */
  async onReady() {
    await this.library.init();
    await this.library.initStates(await this.getStatesAsync("*"));
    await (0, import_library.sleep)(500);
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
      this.regions += this.config[k] === true ? (this.regions ? "," : "") + i : "";
    }
    if (this.regions.length === 0) {
      this.log.warn("No regions selected! Adapter paused!");
      return;
    }
    if (!this.config.maxEntries) {
      this.config.maxEntries = 20;
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
    if (!this.config.selectedTags) {
      this.config.selectedTags = [];
    } else {
      this.updateSelectedTags();
    }
    this.log.info(`Selected Tags: ${JSON.stringify(this.config.selectedTags)}`);
    await this.library.writedp(`breakingNewsCount`, 0, import_definition.genericStateObjects.breakingNewsCount);
    const data = {
      newsCount: 0,
      news: [import_definition.newsDefault, import_definition.newsDefault, import_definition.newsDefault, import_definition.newsDefault, import_definition.newsDefault]
    };
    await this.library.writeFromJson(`news.breakingNews`, `news.breakingNews`, import_definition.statesObjects, data, true, true);
    if (this.config.newsEnabled) {
      await this.updateNews();
    } else {
      await this.library.garbageColleting(`news.`, 6e4, false);
    }
    await (0, import_library.sleep)(300);
    if (this.config.videosEnabled) {
      await this.updateVideos();
    } else {
      await this.library.garbageColleting(`videos.`, 6e4, false);
    }
    this.update();
  }
  update() {
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
  updateSelectedTags() {
    const selectedUserTags = this.config.selectedUserTags || [];
    for (let index = 0; index < selectedUserTags.length; index++) {
      let tempTags = [];
      if (selectedUserTags[index].startsWith("*") || selectedUserTags[index].endsWith("*")) {
        if (selectedUserTags[index].endsWith("*") && selectedUserTags[index].startsWith("*")) {
          tempTags = this.additionalConfig.allTags.filter(
            (tag) => tag.includes(selectedUserTags[index].slice(1, -1))
          );
        } else if (selectedUserTags[index].startsWith("*")) {
          tempTags = this.additionalConfig.allTags.filter(
            (tag) => tag.endsWith(selectedUserTags[index].slice(1))
          );
        } else if (selectedUserTags[index].endsWith("*")) {
          tempTags = this.additionalConfig.allTags.filter(
            (tag) => tag.startsWith(selectedUserTags[index].slice(0, -1))
          );
        }
      }
      if (tempTags.length > 0) {
        this.config.selectedTags = this.config.selectedTags.concat(tempTags);
      }
    }
    this.config.selectedTags = this.config.selectedTags.filter(
      (tag, index) => this.config.selectedTags.indexOf(tag) === index
    );
    this.config.selectedTags = this.config.selectedTags.filter((tag) => !tag.startsWith("*") && !tag.endsWith("*"));
  }
  /**
   * update news from tagesschau..
   */
  async updateNews() {
    const bnews = [];
    await this.library.writedp(`news`, void 0, import_definition.statesObjects[`news`]._channel);
    try {
      for (const topic of this.topics) {
        await this.library.writedp(
          `news.${topic}`,
          void 0,
          //@ts-expect-error
          import_definition.statesObjects.news[topic]._channel
        );
        const url = `https://www.tagesschau.de/api2u/news/?regions=${this.regions}&ressort=${topic}`;
        this.log.debug(`URL: ${url}`);
        const response = await import_axios.default.get(url, { headers: { accept: "application/json" } });
        const start = (/* @__PURE__ */ new Date()).getTime();
        if (response.status === 200 && response.data) {
          this.isOnline = true;
          const data = response.data;
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
                (news) => news.tags && news.tags.some((tag) => this.config.selectedTags.includes(tag.tag)) || news.breakingNews
              );
            }
            data.news = data.news.slice(0, this.config.maxEntries);
            data.newsCount = data.news.length;
            for (const news of data.news) {
              for (const key of import_definition.filterPartOfNews) {
                const k = key;
                delete news[k];
              }
              if (news.date) {
                news.jsDate = new Date(news.date).getTime();
              }
              if (news.breakingNews) {
                bnews.push(news);
              }
            }
            await this.library.writeFromJson(`news.${topic}`, `news.${topic}`, import_definition.statesObjects, data, true);
            await this.library.writedp(
              `news.lastUpdate`,
              (/* @__PURE__ */ new Date()).getTime(),
              import_definition.genericStateObjects.lastUpdate
            );
            for (let i = data.news.length; i < this.config.maxEntries; i++) {
              await this.library.garbageColleting(
                `news.${topic}.news.${`00${i}`.slice(-2)}`,
                6e4,
                false
              );
              await this.library.writedp(
                `news.${topic}.news.${`00${i}`.slice(-2)}`,
                void 0,
                import_definition.newsChannel.news._array
              );
            }
          }
        } else {
          await this.library.garbageColleting(`news.${topic}.`, 6e4, false);
          this.log.warn(`Response status: ${response.status} response statusText: ${response.statusText}`);
        }
        this.log.debug(`Time: ${(/* @__PURE__ */ new Date()).getTime() - start}`);
      }
      const obj = await this.getForeignObjectAsync(this.namespace);
      if (obj) {
        obj.native = obj.native || {};
        obj.native.additionalConfig = this.additionalConfig;
        await this.setForeignObject(this.namespace, obj);
      }
      await this.library.writedp(`breakingNewsCount`, bnews.length, import_definition.genericStateObjects.breakingNewsCount);
      await this.library.writeFromJson(
        `news.breakingNews`,
        `news.breakingNews`,
        import_definition.statesObjects,
        { news: bnews, newsCount: bnews.length },
        true
      );
      for (let i = bnews.length; i < this.config.maxEntries; i++) {
        await this.library.garbageColleting(`news.breakingNews.news.${`00${i}`.slice(-2)}`, 6e4, false);
        await this.library.writedp(
          `news.breakingNews.news.${`00${i}`.slice(-2)}`,
          void 0,
          import_definition.newsChannel.news._array
        );
      }
    } catch (e) {
      if (this.isOnline) {
        this.log.error(`Error: ${e}`);
      }
      this.isOnline = false;
    }
  }
  async updateVideos() {
    await this.library.writedp(`videos`, void 0, import_definition.statesObjects.videos._channel);
    const url = `https://www.tagesschau.de/api2u/channels`;
    this.log.debug(`URL: ${url}`);
    try {
      const response = await import_axios.default.get(url, { headers: { accept: "application/json" } });
      if (response.status === 200 && response.data) {
        this.isOnline = true;
        const data = response.data;
        data.channels = data.channels.slice(0, this.config.maxEntries);
        for (const news of data.channels) {
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
        await this.library.writeFromJson(`videos`, `videos`, import_definition.statesObjects, data, true);
        await this.library.writedp("videos.lastUpdate", (/* @__PURE__ */ new Date()).getTime(), import_definition.genericStateObjects.lastUpdate);
      }
      for (let i = (response && response.data && response.data.channels || []).length; i < 7; i++) {
        await this.library.garbageColleting(`videos.channels.${`00${i}`.slice(-2)}`, 6e4, false);
        await this.library.writedp(`videos.channels.${`00${i}`.slice(-2)}`, void 0, import_definition.newsChannel.news._array);
      }
    } catch (e) {
      if (this.isOnline) {
        this.log.error(`Error: ${e}`);
      }
      this.isOnline = false;
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
        json.sort((a, b) => a.label > b.label ? 1 : -1);
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
