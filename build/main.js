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
  constructor(options = {}) {
    super({
      ...options,
      name: "tagesschau"
    });
    this.library = new import_library.Library(this);
    this.on("ready", this.onReady.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  /**
   * Is called when databases are connected and adapter received configuration.
   */
  async onReady() {
    await this.library.init();
    await this.library.initStates(await this.getStatesAsync("*"));
    const maxRegions = 16;
    let regions = "";
    for (let i = 1; i <= maxRegions; i++) {
      const k = i.toString();
      regions += this.config[k] === true ? `${k},` : "";
    }
    if (regions.length === 0) {
      this.log.warn("No regions selected! Adapter stopped!");
      if (this.stop) {
        await this.stop();
      }
      return;
    }
    let topics = [
      "inland",
      "ausland",
      "wirtschaft",
      "sport",
      "video",
      "investigativ",
      "wissen"
    ];
    topics = topics.filter((topic) => this.config[topic] === true);
    if (topics.length === 0) {
      this.log.warn("No topics selected! Adapter stopped!");
      if (this.stop) {
        await this.stop();
      }
      return;
    }
    for (const topic of topics) {
      await this.library.writedp(topic, void 0, import_definition.statesObjects[topic]._channel);
      const url = `https://www.tagesschau.de/api2u/news/?regions=${regions}&ressort=${topic}`;
      try {
        const response = await import_axios.default.get(url, { headers: { accept: "application/json" } });
        if (response.status === 200 && response.data) {
          this.log.debug(`Response: ${JSON.stringify(response.data)}`);
          const data = {};
          data[topic] = response.data;
          await this.library.writeFromJson(topic, topic, import_definition.statesObjects, data, true);
        }
      } catch (e) {
        this.log.error(`Error: ${e}`);
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
  onUnload(callback) {
    try {
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
