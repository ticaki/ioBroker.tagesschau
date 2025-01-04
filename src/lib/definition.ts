import type { NewsEntity } from './types-d';

export type ChangeTypeToChannelAndState5<Obj> = Obj extends object
    ? {
          [K in keyof Obj]-?: ChangeTypeToChannelAndState<Obj[K]>;
      } & customChannelType
    : ioBroker.StateObject;

export type ChangeTypeToChannelAndState<Obj> = Obj extends object
    ? Obj extends Array<infer U>
        ? { [key: string]: ChangeTypeToChannelAndState<U> }
        : {
              [K in keyof Obj]-?: ChangeTypeToChannelAndState<Obj[K]>;
          } & customChannelType
    : ioBroker.StateObject;

export type ChangeToChannel<Obj, T> = Obj extends object
    ? { [K in keyof Obj]-?: customChannelType & T }
    : ioBroker.StateObject;

export type ChangeTypeOfKeys<Obj, N> = Obj extends object ? { [K in keyof Obj]-?: ChangeTypeOfKeys<Obj[K], N> } : N;

export type customChannelType = {
    _channel: ioBroker.ChannelObject | ioBroker.DeviceObject;
};
export type customChannelArrayType = {
    _array: ioBroker.ChannelObject | ioBroker.DeviceObject;
};

export const defaultChannel: ioBroker.ChannelObject = {
    _id: '',
    type: 'channel',
    common: {
        name: 'Hey no description... ',
    },
    native: {},
};
/*const newsChannel: NewsEntity = {
    sophoraId: '',
    externalId: '',
    title: '',
    date: '',
    teaserImage: {
        alttext: '',
        imageVariants: {
            '1x1-144': '',
            '1x1-256': '',
            '1x1-432': '',
            '1x1-640': '',
            '1x1-840': '',
            '16x9-256': '',
            '16x9-384': '',
            '16x9-512': '',
            '16x9-640': '',
            '16x9-960': '',
            '16x9-1280': '',
            '16x9-1920': '',
        },
        type: '',
    },
    tags: [
        {
            tag: '',
        },
        {
            tag: '',
        },
        {
            tag: '',
        },
        {
            tag: '',
        },
    ],
    updateCheckUrl: '',
    topline: '',
    firstSentence: '',
    details: '',
    detailsweb: '',
    shareURL: '',
    geotags: [],
    regionId: 0,
    regionIds: [],
    ressort: '',
    breakingNews: false,
    type: '',
}*/

export const genericStateObjects: {
    default: ioBroker.StateObject;
    customString: ioBroker.StateObject;
    online: ioBroker.StateObject;
    json: ioBroker.StateObject;
    settings: ioBroker.FolderObject;
    global: ioBroker.FolderObject;
    breakingNewsArray: ioBroker.StateObject;
    breakingNewsCount: ioBroker.StateObject;
    checkOnline: ioBroker.StateObject;
} = {
    default: {
        _id: 'No_definition',
        type: 'state',
        common: {
            name: 'genericStateObjects.state',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
        native: {},
    },
    breakingNewsCount: {
        _id: '',
        type: 'state',
        common: {
            name: 'Anzahl der Breaking News',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
        native: {},
    },
    breakingNewsArray: {
        _id: '',
        type: 'state',
        common: {
            name: 'Array das auf die Breaking News zeigt',
            type: 'string',
            role: 'json',
            read: true,
            write: false,
        },
        native: {},
    },
    customString: {
        _id: 'User_State',
        type: 'state',
        common: {
            name: 'genericStateObjects.customString',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
        native: {},
    },
    online: {
        _id: '',
        type: 'state',
        common: {
            name: 'genericStateObjects.online',
            type: 'boolean',
            role: 'indicator.connected',
            read: true,
            write: false,
        },
        native: {},
    },
    json: {
        _id: '',
        type: 'state',
        common: {
            name: 'genericStateObjects.json',
            type: 'string',
            role: 'json',
            read: true,
            write: false,
        },
        native: {},
    },
    settings: {
        _id: '',
        type: 'folder',
        common: {
            name: 'settings.folder',
        },
        native: {},
    },
    global: {
        _id: '',
        type: 'folder',
        common: {
            name: 'settings.global',
        },
        native: {},
    },
    checkOnline: {
        _id: '',
        type: 'state',
        common: {
            name: 'genericStateObjects.checkOnline',
            type: 'boolean',
            role: 'switch',
            read: true,
            write: true,
        },
        native: {},
    },
};

export type statesObjectsType = {
    news: customChannelType & {
        inland: customChannelType;
        ausland: customChannelType;
        wirtschaft: customChannelType;
        sport: customChannelType;
        video: customChannelType;
        investigativ: customChannelType;
        wissen: customChannelType;
        breakingNews: customChannelType;
    };
    videos: customChannelType & {
        channels: customChannelType;
    };
};

export const statesObjects: statesObjectsType = {
    videos: {
        _channel: {
            _id: '',
            type: 'channel',
            common: {
                name: 'Nachrichtenvideos',
            },
            native: {},
        },
        channels: {
            _channel: {
                _id: '',
                type: 'channel',
                common: {
                    name: 'Nachrichtenkanal',
                },
                native: {},
            },
        },
    },
    news: {
        _channel: {
            _id: '',
            type: 'channel',
            common: {
                name: 'Nachrichten',
            },
            native: {},
        },
        breakingNews: {
            _channel: {
                _id: '',
                type: 'channel',
                common: {
                    name: 'Breaking News',
                },
                native: {},
            },
        },
        inland: {
            _channel: {
                _id: '',
                type: 'channel',
                common: {
                    name: 'Inlandsnachrichten',
                },
                native: {},
            },
        },
        ausland: {
            _channel: {
                _id: '',
                type: 'channel',
                common: {
                    name: 'Auslandsnachrichten',
                },
                native: {},
            },
        },
        wirtschaft: {
            _channel: {
                _id: '',
                type: 'channel',
                common: {
                    name: 'Wirtschaftsnachrichten',
                },
                native: {},
            },
        },
        sport: {
            _channel: {
                _id: '',
                type: 'channel',
                common: {
                    name: 'Sportnachrichten',
                },
                native: {},
            },
        },
        video: {
            _channel: {
                _id: '',
                type: 'channel',
                common: {
                    name: 'Videos',
                },
                native: {},
            },
        },
        investigativ: {
            _channel: {
                _id: '',
                type: 'channel',
                common: {
                    name: 'Investigative Nachrichten',
                },
                native: {},
            },
        },
        wissen: {
            _channel: {
                _id: '',
                type: 'channel',
                common: {
                    name: 'Wissensnachrichten',
                },
                native: {},
            },
        },
    },
};

export const filterPartOfNews: string[] = ['tracking', 'regionId', 'regionIds', 'geotags'];

export const Defaults = {
    state: {
        _id: 'No_definition',
        type: 'state',
        common: {
            name: 'No definition',

            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
        native: {},
    },
};

export const newsDefault: NewsEntity = {
    sophoraId: '',
    externalId: '',
    title: '',
    date: '',
    teaserImage: {
        alttext: '',
        imageVariants: {
            '1x1-144': '',
            '1x1-256': '',
            '1x1-432': '',
            '1x1-640': '',
            '1x1-840': '',
            '16x9-256': '',
            '16x9-384': '',
            '16x9-512': '',
            '16x9-640': '',
            '16x9-960': '',
            '16x9-1280': '',
            '16x9-1920': '',
        },
        type: '',
    },
    tags: [
        {
            tag: '',
        },
        {
            tag: '',
        },
        {
            tag: '',
        },
        {
            tag: '',
        },
    ],
    updateCheckUrl: '',
    topline: '',
    firstSentence: '',
    details: '',
    detailsweb: '',
    shareURL: '',
    geotags: [],
    regionId: 0,
    regionIds: [],
    ressort: '',
    breakingNews: false,
    type: '',
};
