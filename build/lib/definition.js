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
const newsChannel = {
  news: {
    _channel: {
      _id: "",
      type: "channel",
      common: {
        name: "Nachrichten"
      },
      native: {}
    },
    _array: {
      _id: "",
      type: "channel",
      common: {
        name: "Nachricht"
      },
      native: {}
    },
    sophoraId: {
      _id: "",
      type: "state",
      common: {
        name: "Sophora ID",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    externalId: {
      _id: "",
      type: "state",
      common: {
        name: "Externe ID",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    title: {
      _id: "",
      type: "state",
      common: {
        name: "Titel",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    date: {
      _id: "",
      type: "state",
      common: {
        name: "Datum/Uhrzeit",
        type: "string",
        role: "date",
        read: true,
        write: false
      },
      native: {}
    },
    jsDate: {
      _id: "",
      type: "state",
      common: {
        name: "Datum/Uhrzeit",
        type: "number",
        role: "date",
        read: true,
        write: false
      },
      native: {}
    },
    teaserImage: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Teaserbild"
        },
        native: {}
      },
      alttext: {
        _id: "",
        type: "state",
        common: {
          name: "Alternativer Text",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      imageVariants: {
        _channel: {
          _id: "",
          type: "channel",
          common: {
            name: "Bildvarianten"
          },
          native: {}
        },
        "1x1-144": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 1x1 - Aufl\xF6sung: 144",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "1x1-256": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 1x1 - Aufl\xF6sung: 256",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "1x1-432": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 1x1 - Aufl\xF6sung: 432",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "1x1-640": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 1x1 - Aufl\xF6sung: 640",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "1x1-840": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 1x1 - Aufl\xF6sung: 840",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-256": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 256",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-384": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 384",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-512": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 512",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-640": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 640",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-960": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 960",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-1280": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 1280",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-1920": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 1920",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        }
      },
      type: {
        _id: "",
        type: "state",
        common: {
          name: "Typ",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      }
    },
    tags: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Schl\xFCsselw\xF6rter"
        },
        native: {}
      },
      _array: {
        _id: "",
        type: "channel",
        common: {
          name: "Schl\xFCsselwort"
        },
        native: {}
      },
      tag: {
        _id: "",
        type: "state",
        common: {
          name: "Wert",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      }
    },
    updateCheckUrl: {
      _id: "",
      type: "state",
      common: {
        name: "Update Check URL",
        type: "string",
        role: "text.url",
        read: true,
        write: false
      },
      native: {}
    },
    topline: {
      _id: "",
      type: "state",
      common: {
        name: "Topline",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    firstSentence: {
      _id: "",
      type: "state",
      common: {
        name: "Erster Satz",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    details: {
      _id: "",
      type: "state",
      common: {
        name: "Details",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    detailsweb: {
      _id: "",
      type: "state",
      common: {
        name: "Detailsweb",
        type: "string",
        role: "text.url",
        read: true,
        write: false
      },
      native: {}
    },
    shareURL: {
      _id: "",
      type: "state",
      common: {
        name: "Share URL",
        type: "string",
        role: "text.url",
        read: true,
        write: false
      },
      native: {}
    },
    ressort: {
      _id: "",
      type: "state",
      common: {
        name: "Ressort",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    breakingNews: {
      _id: "",
      type: "state",
      common: {
        name: "Breaking News",
        type: "boolean",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    },
    type: {
      _id: "",
      type: "state",
      common: {
        name: "Typ",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    }
  },
  regional: {
    _id: "",
    type: "state",
    common: {
      name: "Bitte bescheid sagen wenn hier was steht",
      type: "boolean",
      role: "indicator",
      read: true,
      write: false
    },
    native: {}
  },
  newStoriesCountLink: {
    _id: "",
    type: "state",
    common: {
      name: "Link zu den neuen Nachrichten",
      type: "string",
      role: "text.url",
      read: true,
      write: false
    },
    native: {}
  },
  type: {
    _id: "",
    type: "state",
    common: {
      name: "Typ",
      type: "string",
      role: "text",
      read: true,
      write: false
    },
    native: {}
  },
  nextPage: {
    _id: "",
    type: "state",
    common: {
      name: "N\xE4chste Seite",
      type: "string",
      role: "text.url",
      read: true,
      write: false
    },
    native: {}
  },
  newsCount: {
    _id: "",
    type: "state",
    common: {
      name: "Anzahl der Nachrichten",
      type: "number",
      role: "value",
      read: true,
      write: false
    },
    native: {}
  }
};
const videoChannel = {
  channels: {
    _channel: {
      _id: "",
      type: "channel",
      common: {
        name: "Kan\xE4le"
      },
      native: {}
    },
    _array: {
      _id: "",
      type: "channel",
      common: {
        name: "Kanal"
      },
      native: {}
    },
    sophoraId: {
      _id: "",
      type: "state",
      common: {
        name: "Sophora ID",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    externalId: {
      _id: "",
      type: "state",
      common: {
        name: "Externe ID",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    title: {
      _id: "",
      type: "state",
      common: {
        name: "Titel",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    date: {
      _id: "",
      type: "state",
      common: {
        name: "Datum/Uhrzeit",
        type: "string",
        role: "date",
        read: true,
        write: false
      },
      native: {}
    },
    jsDate: {
      _id: "",
      type: "state",
      common: {
        name: "Datum/Uhrzeit",
        type: "number",
        role: "date",
        read: true,
        write: false
      },
      native: {}
    },
    teaserImage: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Teaserbild"
        },
        native: {}
      },
      alttext: {
        _id: "",
        type: "state",
        common: {
          name: "Alternativer Text",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      imageVariants: {
        _channel: {
          _id: "",
          type: "channel",
          common: {
            name: "Bildvarianten"
          },
          native: {}
        },
        "1x1-144": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 1x1 - Aufl\xF6sung: 144",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "1x1-256": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 1x1 - Aufl\xF6sung: 256",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "1x1-432": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 1x1 - Aufl\xF6sung: 432",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "1x1-640": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 1x1 - Aufl\xF6sung: 640",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "1x1-840": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 1x1 - Aufl\xF6sung: 840",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-256": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 256",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-384": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 384",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-512": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 512",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-640": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 640",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-960": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 960",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-1280": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 1280",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        },
        "16x9-1920": {
          _id: "",
          type: "state",
          common: {
            name: "Format: 16x9 - Aufl\xF6sung: 1920",
            type: "string",
            role: "text.url",
            read: true,
            write: false
          },
          native: {}
        }
      },
      type: {
        _id: "",
        type: "state",
        common: {
          name: "Typ",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      copyright: {
        _id: "",
        type: "state",
        common: {
          name: "Urheberrecht",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      title: {
        _id: "",
        type: "state",
        common: {
          name: "Titel",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      }
    },
    tags: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Schl\xFCsselw\xF6rter"
        },
        native: {}
      },
      _array: {
        _id: "",
        type: "channel",
        common: {
          name: "Schl\xFCsselwort"
        },
        native: {}
      },
      tag: {
        _id: "",
        type: "state",
        common: {
          name: "Wert",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      }
    },
    updateCheckUrl: {
      _id: "",
      type: "state",
      common: {
        name: "Update Check URL",
        type: "string",
        role: "text.url",
        read: true,
        write: false
      },
      native: {}
    },
    streams: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Streams"
        },
        native: {}
      },
      adaptivestreaming: {
        _id: "",
        type: "state",
        common: {
          name: "Adaptive Streaming",
          type: "string",
          role: "text.url",
          read: true,
          write: false
        },
        native: {}
      },
      h264s: {
        _id: "",
        type: "state",
        common: {
          name: "H264s",
          type: "string",
          role: "text.url",
          read: true,
          write: false
        },
        native: {}
      },
      h264m: {
        _id: "",
        type: "state",
        common: {
          name: "H264m",
          type: "string",
          role: "text.url",
          read: true,
          write: false
        },
        native: {}
      },
      h264xl: {
        _id: "",
        type: "state",
        common: {
          name: "H264xl",
          type: "string",
          role: "text.url",
          read: true,
          write: false
        },
        native: {}
      }
    },
    alttext: {
      _id: "",
      type: "state",
      common: {
        name: "Alternativer Text",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    copyright: {
      _id: "",
      type: "state",
      common: {
        name: "Urheberrecht",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    type: {
      _id: "",
      type: "state",
      common: {
        name: "Typ",
        type: "string",
        role: "text",
        read: true,
        write: false
      },
      native: {}
    },
    content: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Inhalt"
        },
        native: {}
      },
      value: {
        _id: "",
        type: "state",
        common: {
          name: "Wert",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      },
      type: {
        _id: "",
        type: "state",
        common: {
          name: "Typ",
          type: "string",
          role: "text",
          read: true,
          write: false
        },
        native: {}
      }
    }
  }
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
    ...videoChannel
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
      },
      ...newsChannel
    },
    inland: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Inlandsnachrichten"
        },
        native: {}
      },
      ...newsChannel
    },
    ausland: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Auslandsnachrichten"
        },
        native: {}
      },
      ...newsChannel
    },
    wirtschaft: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Wirtschaftsnachrichten"
        },
        native: {}
      },
      ...newsChannel
    },
    sport: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Sportnachrichten"
        },
        native: {}
      },
      ...newsChannel
    },
    video: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Videos"
        },
        native: {}
      },
      ...newsChannel
    },
    investigativ: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Investigative Nachrichten"
        },
        native: {}
      },
      ...newsChannel
    },
    wissen: {
      _channel: {
        _id: "",
        type: "channel",
        common: {
          name: "Wissensnachrichten"
        },
        native: {}
      },
      ...newsChannel
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
