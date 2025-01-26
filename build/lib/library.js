"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var library_exports = {};
__export(library_exports, {
  BaseClass: () => BaseClass,
  Library: () => Library
});
module.exports = __toCommonJS(library_exports);
var import_fs = __toESM(require("fs"));
var import_definition = require("./definition");
var _adapter, _prefix;
class BaseClass {
  unload = false;
  log;
  adapter;
  library;
  name = ``;
  /**
   * Creates an instance of BaseClass.
   *
   * @param adapter The adapter instance.
   * @param name The name of the class.
   * @classdesc Base class for all classes.
   * adapter The adapter instance.
   * library The library instance.
   * name The name of the class.
   * log The log instance.
   * unload The unload state.
   * [options] The options for the class.
   * @returns The base class instance.
   */
  constructor(adapter, name = "") {
    this.name = name;
    this.log = new CustomLog(adapter, this.name);
    this.adapter = adapter;
    this.library = adapter.library;
  }
  /**
   * Marks the library for unloading.
   */
  delete() {
    this.unload = true;
  }
}
class CustomLog {
  constructor(adapter, text = "") {
    __privateAdd(this, _adapter, void 0);
    __privateAdd(this, _prefix, void 0);
    __privateSet(this, _adapter, adapter);
    __privateSet(this, _prefix, text);
  }
  getName() {
    return __privateGet(this, _prefix);
  }
  debug(log, log2 = "") {
    __privateGet(this, _adapter).log.debug(log2 ? `[${log}] ${log2}` : `[${__privateGet(this, _prefix)}] ${log}`);
  }
  info(log, log2 = "") {
    __privateGet(this, _adapter).log.info(log2 ? `[${log}] ${log2}` : `[${__privateGet(this, _prefix)}] ${log}`);
  }
  warn(log, log2 = "") {
    __privateGet(this, _adapter).log.warn(log2 ? `[${log}] ${log2}` : `[${__privateGet(this, _prefix)}] ${log}`);
  }
  error(log, log2 = "") {
    __privateGet(this, _adapter).log.error(log2 ? `[${log}] ${log2}` : `[${__privateGet(this, _prefix)}] ${log}`);
  }
  setLogPrefix(text) {
    __privateSet(this, _prefix, text);
  }
}
_adapter = new WeakMap();
_prefix = new WeakMap();
class Library extends BaseClass {
  stateDataBase = {};
  language = "en";
  translation = {};
  /**
   * use extendObject always on folder, devices and channels always
   */
  extendedFolderAlways = false;
  defaults = {
    updateStateOnChangeOnly: true
  };
  /**
   * Creates an instance of Library.
   *
   * @param adapter The adapter instance.
   * @param _options The options for the library.
   */
  constructor(adapter, _options = null) {
    super(adapter, "library");
    this.stateDataBase = {};
  }
  /**
   * Initialise the library.
   */
  async init() {
    const obj = await this.adapter.getForeignObjectAsync("system.config");
    if (obj) {
      await this.setLanguage(obj.common.language, true);
    } else {
      await this.setLanguage("en", true);
    }
  }
  /**
   * Write/create from a Json with defined keys, the associated states and channels.
   *
   * @param prefix iobroker datapoint prefix where to write
   * @param objNode Entry point into the definition json.
   * @param def the definition json
   * @param data The Json to read
   * @param expandTree expand arrays up to 99
   * @param onlyCreate only create the objects, do not write the values in exists states.
   * @param isArray is the data from an array
   * @returns  void
   */
  async writeFromJson(prefix, objNode, def, data, expandTree = false, onlyCreate = false, isArray = false) {
    if (!def || typeof def !== "object") {
      return;
    }
    if (data === void 0 || ["string", "number", "boolean", "object"].indexOf(typeof data) == -1) {
      return;
    }
    const objectDefinition = objNode ? this.getObjectDefFromJson(`${objNode}`, def, data) : null;
    if (objectDefinition) {
      objectDefinition.native = {
        ...objectDefinition.native || {},
        objectDefinitionReference: objNode
      };
    }
    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        if (!objectDefinition) {
          return;
        }
        if (data.length === 0) {
          return;
        }
        if (objectDefinition.type !== "state" || expandTree) {
          const defChannel = this.getChannelObject(objectDefinition, prefix);
          await this.writedp(prefix, null, { ...defChannel, native: { objnode: objNode } });
          for (let i = 0; i < data.length; i++) {
            const d = data[i];
            const dp = `${prefix}.${`00${i}`.slice(-2)}`;
            await this.writeFromJson(dp, `${objNode}`, def, d, expandTree, onlyCreate, true);
          }
        } else {
          await this.writeFromJson(
            prefix,
            objNode,
            def,
            JSON.stringify(data) || "[]",
            expandTree,
            onlyCreate
          );
        }
      } else {
        if (Object.keys(data).length === 0) {
          return;
        }
        if (objectDefinition) {
          const defChannel = this.getChannelObject(objectDefinition, prefix, isArray);
          const valbefore = this.extendedFolderAlways;
          if (isArray && "title" in data && data.title) {
            this.extendedFolderAlways = true;
            defChannel.common.name = data.title;
          }
          await this.writedp(prefix, null, { ...defChannel, native: { objnode: objNode } });
          this.extendedFolderAlways = valbefore;
        }
        if (data === null) {
          return;
        }
        for (const k in data) {
          await this.writeFromJson(`${prefix}.${k}`, `${objNode}.${k}`, def, data[k], expandTree, onlyCreate);
        }
      }
    } else {
      if (!objectDefinition) {
        return;
      }
      await this.writedp(prefix, data, { ...objectDefinition, native: { objnode: objNode } }, true, onlyCreate);
    }
  }
  /**
   * Get the ioBroker.Object out of stateDefinition
   *
   * @param key is the deep linking key to the definition
   * @param def is the definition object
   * @param data  is the definition dataset
   * @returns ioBroker.ChannelObject | ioBroker.DeviceObject | ioBroker.StateObject
   */
  getObjectDefFromJson(key, def, data) {
    let result = this.deepJsonValue(key, def);
    if (result === null || result === void 0) {
      const k = key.split(".");
      if (k && k[k.length - 1].startsWith("_")) {
        result = import_definition.genericStateObjects.customString;
        result = this.cloneObject(result);
      } else {
        result = import_definition.genericStateObjects.default;
        result = this.cloneObject(result);
        result.common.name = key.split(".").pop();
        switch (typeof data) {
          case "number":
          case "bigint":
            {
              result.common.type = "number";
              result.common.role = "value";
            }
            break;
          case "boolean":
            {
              result.common.type = "boolean";
              result.common.role = "indicator";
            }
            break;
          case "string":
          case "symbol":
          case "undefined":
          case "object":
          case "function":
            {
              result.common.type = "string";
              result.common.role = "text";
            }
            break;
        }
      }
    } else {
      result = this.cloneObject(result);
    }
    return result;
  }
  /**
   * Get a value from a deep json key
   *
   * @param key is the deep linking key to the definition
   * @param data  is the definition dataset
   * @returns any
   */
  deepJsonValue(key, data) {
    if (!key || !data || typeof data !== "object" || typeof key !== "string") {
      throw new Error(`Error(222) data or key are missing/wrong type!`);
    }
    const k = key.split(`.`);
    let c = 0, s = data;
    while (c < k.length) {
      s = s[k[c++]];
      if (s === void 0) {
        return null;
      }
    }
    return s;
  }
  /**
   * Get a channel/device definition from property _channel out of a getObjectDefFromJson() result or a default definition.
   *
   * @param definition the definition object.
   * @param id the id of the object
   * @param tryArray try to get the array definition
   * @returns ioBroker.ChannelObject | ioBroker.DeviceObject or a default channel obj
   */
  getChannelObject(definition = null, id = "", tryArray = false) {
    const def = tryArray === true ? definition && definition._array || definition && definition._channel || null : definition && definition._channel || null;
    const result = {
      _id: def ? def._id : "",
      type: def && def.type === "device" ? "device" : def && def.type === "channel" ? "channel" : "folder",
      common: {
        name: def && def.common && def.common.name ? def.common.name : id && id.split(".").length > 2 ? id.split(".").pop() || "no definition" : "no definition"
      },
      native: def && def.native || {}
    };
    return result;
  }
  /**
   * Write/Create the specified data point with value, will only be written if val != oldval and obj.type == state or the data point value in the DB is not undefined. Channel and Devices have an undefined value.
   *
   * @param dp Data point to be written. Library.clean() is called with it.
   * @param val Value for this data point. Channel vals (old and new) are undefined so they never will be written.
   * @param obj The object definition for this data point (ioBroker.ChannelObject | ioBroker.DeviceObject | ioBroker.StateObject)
   * @param ack set ack to false if needed - NEVER after u subscript to states)
   * @param onlyCreate only extended the objects, do not write the values in exists states
   * @param forceExtend force the extend of the object
   * @returns void
   */
  async writedp(dp, val, obj = null, ack = true, onlyCreate = false, forceExtend = false) {
    dp = this.cleandp(dp);
    let node = this.readdb(dp);
    let nodeIsNew = false;
    if (node === void 0) {
      if (!obj) {
        throw new Error("writedp try to create a state without object informations.");
      }
      nodeIsNew = true;
      obj._id = `${this.adapter.name}.${this.adapter.instance}.${dp}`;
      if (typeof obj.common.name == "string") {
        obj.common.name = await this.getTranslationObj(obj.common.name);
      }
      if (typeof obj.common.desc == "string") {
        obj.common.desc = await this.getTranslationObj(obj.common.desc);
      }
      await this.adapter.extendObject(dp, obj);
      const stateType = obj && obj.common && "type" in obj.common && obj.common.type;
      node = this.setdb(dp, obj.type, void 0, stateType, true, Date.now(), obj);
    } else if ((node.init || this.extendedFolderAlways || forceExtend) && obj) {
      if (typeof obj.common.name == "string") {
        obj.common.name = await this.getTranslationObj(obj.common.name);
      }
      if (typeof obj.common.desc == "string") {
        obj.common.desc = await this.getTranslationObj(obj.common.desc);
      }
      await this.adapter.extendObject(dp, obj);
    }
    if (obj && obj.type !== "state" || onlyCreate && !nodeIsNew) {
      return;
    }
    if (node) {
      this.setdb(dp, node.type, val, node.stateTyp, true);
    }
    if (node && (!this.defaults.updateStateOnChangeOnly || node.val !== val || !node.ack)) {
      const typ = obj && obj.common && obj.common.type || node.stateTyp;
      if (typ && typ != typeof val && val !== void 0) {
        val = this.convertToType(val, typ);
      }
      await this.adapter.setState(dp, {
        val,
        ts: Date.now(),
        ack
      });
    }
  }
  /**
   * Get the states that match the specified string.
   *
   * @param str The string to match.
   * @returns The states that match the specified string.
   */
  getStates(str) {
    const result = {};
    for (const dp in this.stateDataBase) {
      if (this.stateDataBase[dp] && dp.search(new RegExp(str, "g")) != -1) {
        result[dp] = this.stateDataBase[dp];
      }
    }
    return result;
  }
  /**
   * Get the states that match the specified string.
   *
   * @param hold The string to hold.
   * @param filter The string to filter.
   * @param deep The number of deep.
   */
  async cleanUpTree(hold, filter, deep) {
    let del = [];
    for (const dp in this.stateDataBase) {
      if (filter && filter.filter((a) => dp.startsWith(a) || a.startsWith(dp)).length == 0) {
        continue;
      }
      if (hold.filter((a) => dp.startsWith(a) || a.startsWith(dp)).length > 0) {
        continue;
      }
      delete this.stateDataBase[dp];
      del.push(dp.split(".").slice(0, deep).join("."));
    }
    del = del.filter((item, pos, arr) => {
      return arr.indexOf(item) == pos;
    });
    for (const d of del) {
      await this.adapter.delObjectAsync(d, { recursive: true });
      this.log.debug(`Clean up tree delete: ${d}`);
    }
  }
  /**
   * Remove forbidden chars from datapoint string.
   *
   * @param string Datapoint string to clean
   * @param lowerCase lowerCase() first param.
   * @param removePoints remove . from dp
   * @returns void
   */
  cleandp(string, lowerCase = false, removePoints = false) {
    if (!string && typeof string != "string") {
      return string;
    }
    string = string.replace(this.adapter.FORBIDDEN_CHARS, "_");
    if (removePoints) {
      string = string.replace(/[^0-9A-Za-z_-]/gu, "_");
    } else {
      string = string.replace(/[^0-9A-Za-z._-]/gu, "_");
    }
    return lowerCase ? string.toLowerCase() : string;
  }
  /**
   * Convert a value to the given type
   *
   * @param value 	then value to convert
   * @param type the target type
   * @returns the converted value
   */
  convertToType(value, type) {
    if (value === null) {
      return null;
    }
    if (type === void 0) {
      throw new Error("convertToType type undefined not allowed!");
    }
    if (value === void 0) {
      value = "";
    }
    const old_type = typeof value;
    let newValue = typeof value == "object" ? JSON.stringify(value) : value;
    if (type !== old_type) {
      switch (type) {
        case "string":
          newValue = value.toString() || "";
          break;
        case "number":
          newValue = value ? parseFloat(value) : 0;
          break;
        case "boolean":
          newValue = !!value;
          break;
        case "array":
        case "json":
          break;
      }
    }
    return newValue;
  }
  /**
   * Read the state from the database.
   *
   * @param dp The data point to read.
   */
  readdb(dp) {
    return this.stateDataBase[this.cleandp(dp)];
  }
  /**
   * Set the state in the database.
   *
   * @param dp The data point to set.
   * @param type The type of the data point.
   * @param val The value of the data point.
   * @param stateType The state type of the data point.
   * @param ack The ack of the data point.
   * @param ts The timestamp of the data point.
   * @param obj The object of the data point.
   * @param init The init of the data point.
   * @returns The state in the database.
   */
  setdb(dp, type, val = void 0, stateType = void 0, ack = true, ts = Date.now(), obj = void 0, init = false) {
    if (typeof type == "object") {
      type = type;
      this.stateDataBase[dp] = type;
    } else {
      type = type;
      this.stateDataBase[dp] = {
        type,
        stateTyp: stateType !== void 0 ? stateType : this.stateDataBase[dp] !== void 0 && this.stateDataBase[dp].stateTyp !== void 0 ? this.stateDataBase[dp].stateTyp : void 0,
        val,
        ack,
        ts: ts ? ts : Date.now(),
        obj: obj !== void 0 ? obj : this.stateDataBase[dp] !== void 0 && this.stateDataBase[dp].obj !== void 0 ? this.stateDataBase[dp].obj : void 0,
        init
      };
    }
    return this.stateDataBase[dp];
  }
  /**
   * Delete the state from the database.
   *
   * @param data The data point to delete.
   */
  async memberDeleteAsync(data) {
    for (const d of data) {
      await d.delete();
    }
  }
  /**
   * Clone an object.
   *
   * @param obj The object to clone.
   */
  cloneObject(obj) {
    if (typeof obj !== "object") {
      this.log.error(`Error clone object target is type: ${typeof obj}`);
      return obj;
    }
    return JSON.parse(JSON.stringify(obj));
  }
  /**
   * Clone a generic object.
   *
   * @param obj The object to clone.
   */
  cloneGenericObject(obj) {
    if (typeof obj !== "object") {
      this.log.error(`Error clone object target is type: ${typeof obj}`);
      return obj;
    }
    return JSON.parse(JSON.stringify(obj));
  }
  /**
   * Check if a file exists.
   *
   * @param file The file to check.
   */
  fileExistAsync(file) {
    if (import_fs.default.existsSync(`./admin/${file}`)) {
      return true;
    }
    return false;
  }
  /**
   * Initialise the database with the states to prevent unnecessary creation and writing.
   *
   * @param states States that are to be read into the database during initialisation.
   * @returns void
   */
  async initStates(states) {
    if (!states) {
      return;
    }
    this.stateDataBase = {};
    for (const state in states) {
      const dp = state.replace(`${this.adapter.name}.${this.adapter.instance}.`, "");
      const obj = await this.adapter.getObjectAsync(dp);
      this.setdb(
        dp,
        "state",
        states[state] && states[state].val ? states[state].val : void 0,
        obj && obj.common && obj.common.type ? obj.common.type : void 0,
        states[state] && states[state].ack,
        states[state] && states[state].ts ? states[state].ts : Date.now(),
        obj == null ? void 0 : obj,
        true
      );
    }
  }
  /**
   * Clean up the database.
   *
   * @param prefix The prefix to clean up.
   * @param offset The offset to clean up.
   * @param del Whether to delete the data point. this part need rework
   */
  async garbageColleting(prefix, offset = 2e3, del = false) {
    if (!prefix || !this.stateDataBase) {
      return;
    }
    if (del) {
      this.log.warn(`garbageColleting with del = true is not well implemented yet!`);
      return;
    }
    const filteredStateKeys = Object.keys(this.stateDataBase).filter((id) => id.startsWith(prefix));
    const currentTestTime = Date.now() - offset;
    for (const id of filteredStateKeys) {
      const state = this.stateDataBase[id];
      if (!state) {
        continue;
      }
      if (state.val === void 0 && (!state.obj || state.obj.type !== "state" || !state.stateTyp)) {
        if (state.obj && state.obj.common && state.obj.common.def) {
          state.ts = 1;
        } else {
          continue;
        }
      }
      if (state.ts < currentTestTime) {
        if (del) {
          await this.cleanUpTree([], [id], -1);
          continue;
        }
        let newVal;
        if (state.obj && state.obj.common && state.obj.common.def) {
          newVal = state.obj.common.def;
        } else {
          switch (state.stateTyp || state.obj && state.obj.common && state.obj.common.type || "string") {
            case "string":
              if (typeof state.val == "string") {
                if (state.val.startsWith("{") && state.val.endsWith("}")) {
                  newVal = "{}";
                } else if (state.val.startsWith("[") && state.val.endsWith("]")) {
                  newVal = "[]";
                } else {
                  newVal = "";
                }
              } else {
                newVal = "";
              }
              break;
            case "bigint":
            case "number":
              newVal = -1;
              break;
            case "boolean":
              newVal = false;
              break;
            case "symbol":
            case "object":
            case "function":
              newVal = null;
              break;
            case "undefined":
              newVal = void 0;
              break;
          }
        }
        await this.writedp(id, newVal);
      }
    }
  }
  /**
   * Get the local language
   *
   * @returns string
   */
  getLocalLanguage() {
    if (this.language) {
      return this.language;
    }
    return "en-En";
  }
  /**
   * Get the translation for the specified key.
   *
   * @param key The key to get the translation for.
   */
  getTranslation(key) {
    if (this.translation[key] !== void 0) {
      return this.translation[key];
    }
    return key;
  }
  /**
   * Check if a translation exists for the specified key.
   *
   * @param key The key to check.
   */
  existTranslation(key) {
    return this.translation[key] !== void 0;
  }
  /**
   * Get the translation object for the specified key.
   *
   * @param key The key to get the translation object for.
   */
  async getTranslationObj(key) {
    const language = [
      "en",
      "de",
      "ru",
      "pt",
      "nl",
      "fr",
      "it",
      "es",
      "pl",
      "uk",
      "zh-cn"
    ];
    const result = {};
    for (const l of language) {
      try {
        const i = await Promise.resolve().then(() => __toESM(require(`../../admin/i18n/${l}/translations.json`)));
        if (i[key] !== void 0) {
          result[l] = i[key];
        }
      } catch {
        return key;
      }
    }
    if (result.en == void 0) {
      return key;
    }
    return result;
  }
  /**
   * Set the language for the library.
   *
   * @param language The language to set.
   * @param force Whether to force the language.
   */
  async setLanguage(language, force = false) {
    if (!language) {
      language = "en";
    }
    if (force || this.language != language) {
      try {
        this.translation = await Promise.resolve().then(() => __toESM(require(`../../admin/i18n/${language}/translations.json`)));
        this.language = language;
        return true;
      } catch {
        this.log.error(`Language ${language} not exist!`);
      }
    }
    return false;
  }
  /**
   * Get the language for the library.
   *
   * @param text The text to translate.
   * @returns The translated text.
   */
  sortText(text) {
    text.sort((a, b) => {
      const nameA = a.toUpperCase();
      const nameB = b.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return text;
  }
  /**
   *
   * @param text string to replace a Date
   * @param noti appendix to translation key
   * @param day true = Mo, 12.05 - false = 12.05
   * @returns Monday first March
   */
  convertSpeakDate(text, noti = "", day = false) {
    if (!text || typeof text !== `string`) {
      return ``;
    }
    const b = text.split(`.`);
    if (day) {
      b[0] = b[0].split(" ")[2];
    }
    return ` ${`${(/* @__PURE__ */ new Date(`${b[1]}/${b[0]}/${(/* @__PURE__ */ new Date()).getFullYear()}`)).toLocaleString(this.language, {
      weekday: day ? "long" : void 0,
      day: "numeric",
      month: `long`
    })} `.replace(/([0-9]+\.)/gu, (x) => {
      const result = this.getTranslation(x + noti);
      if (result != x + noti) {
        return result;
      }
      return this.getTranslation(x);
    })}`;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseClass,
  Library
});
//# sourceMappingURL=library.js.map
