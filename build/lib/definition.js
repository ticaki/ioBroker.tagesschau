"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var definition_exports = {};
__export(definition_exports, {
  Defaults: () => Defaults,
  defaultChannel: () => defaultChannel,
  filterPartOfNews: () => filterPartOfNews,
  genericStateObjects: () => genericStateObjects,
  newsDefault: () => newsDefault,
  statesObjects: () => statesObjects
});
module.exports = __toCommonJS(definition_exports);
const defaultChannel = {
  _id: "",
  type: "channel",
  common: {
    name: "Hey no description... "
  },
  native: {}
};
const genericStateObjects = {
  default: {
    _id: "No_definition",
    type: "state",
    common: {
      name: "genericStateObjects.state",
      type: "string",
      role: "text",
      read: true,
      write: false
    },
    native: {}
  },
  breakingNewsCount: {
    _id: "",
    type: "state",
    common: {
      name: "Anzahl der Breaking News",
      type: "number",
      role: "value",
      read: true,
      write: false
    },
    native: {}
  },
  breakingNewsArray: {
    _id: "",
    type: "state",
    common: {
      name: "Array das auf die Breaking News zeigt",
      type: "string",
      role: "json",
      read: true,
      write: false
    },
    native: {}
  },
  customString: {
    _id: "User_State",
    type: "state",
    common: {
      name: "genericStateObjects.customString",
      type: "string",
      role: "text",
      read: true,
      write: false
    },
    native: {}
  },
  online: {
    _id: "",
    type: "state",
    common: {
      name: "genericStateObjects.online",
      type: "boolean",
      role: "indicator.connected",
      read: true,
      write: false
    },
    native: {}
  },
  json: {
    _id: "",
    type: "state",
    common: {
      name: "genericStateObjects.json",
      type: "string",
      role: "json",
      read: true,
      write: false
    },
    native: {}
  },
  settings: {
    _id: "",
    type: "folder",
    common: {
      name: "settings.folder"
    },
    native: {}
  },
  global: {
    _id: "",
    type: "folder",
    common: {
      name: "settings.global"
    },
    native: {}
  },
  checkOnline: {
    _id: "",
    type: "state",
    common: {
      name: "genericStateObjects.checkOnline",
      type: "boolean",
      role: "switch",
      read: true,
      write: true
    },
    native: {}
  }
};
const statesObjects = {
  videos: {
    _channel: {
      _id: "",
      type: "channel",
      common: {
        name: "Nachrichtenvideos"
      },
      native: {}
    },
    channels: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Nachrichtenkanal"
        },
        native: {}
      }
    }
  },
  news: {
    _channel: {
      _id: "",
      type: "channel",
      common: {
        name: "Nachrichten"
      },
      native: {}
    },
    breakingNews: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Breaking News"
        },
        native: {}
      }
    },
    inland: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Inlandsnachrichten"
        },
        native: {}
      }
    },
    ausland: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Auslandsnachrichten"
        },
        native: {}
      }
    },
    wirtschaft: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Wirtschaftsnachrichten"
        },
        native: {}
      }
    },
    sport: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Sportnachrichten"
        },
        native: {}
      }
    },
    video: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Videos"
        },
        native: {}
      }
    },
    investigativ: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Investigative Nachrichten"
        },
        native: {}
      }
    },
    wissen: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Wissensnachrichten"
        },
        native: {}
      }
    }
  }
};
const filterPartOfNews = ["tracking", "regionId", "regionIds", "geotags"];
const Defaults = {
  state: {
    _id: "No_definition",
    type: "state",
    common: {
      name: "No definition",
      type: "string",
      role: "text",
      read: true,
      write: false
    },
    native: {}
  }
};
const newsDefault = {
  sophoraId: "",
  externalId: "",
  title: "",
  date: "",
  teaserImage: {
    alttext: "",
    imageVariants: {
      "1x1-144": "",
      "1x1-256": "",
      "1x1-432": "",
      "1x1-640": "",
      "1x1-840": "",
      "16x9-256": "",
      "16x9-384": "",
      "16x9-512": "",
      "16x9-640": "",
      "16x9-960": "",
      "16x9-1280": "",
      "16x9-1920": ""
    },
    type: ""
  },
  tags: [
    {
      tag: ""
    },
    {
      tag: ""
    },
    {
      tag: ""
    },
    {
      tag: ""
    }
  ],
  updateCheckUrl: "",
  topline: "",
  firstSentence: "",
  details: "",
  detailsweb: "",
  shareURL: "",
  geotags: [],
  regionId: 0,
  regionIds: [],
  ressort: "",
  breakingNews: false,
  type: ""
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Defaults,
  defaultChannel,
  filterPartOfNews,
  genericStateObjects,
  newsDefault,
  statesObjects
});
//# sourceMappingURL=definition.js.map
