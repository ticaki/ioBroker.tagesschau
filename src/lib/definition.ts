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
    _channel?: ioBroker.ChannelObject | ioBroker.DeviceObject | ioBroker.FolderObject;
    _array?: ioBroker.ChannelObject | ioBroker.DeviceObject | ioBroker.FolderObject;
};

export const defaultChannel: ioBroker.FolderObject = {
    _id: '',
    type: 'folder',
    common: {
        name: 'Hey no description... ',
    },
    native: {},
};

type imageVariants = customChannelType & {
    '1x1-144': ioBroker.StateObject;
    '1x1-256': ioBroker.StateObject;
    '1x1-432': ioBroker.StateObject;
    '1x1-640': ioBroker.StateObject;
    '1x1-840': ioBroker.StateObject;
    '16x9-256': ioBroker.StateObject;
    '16x9-384': ioBroker.StateObject;
    '16x9-512': ioBroker.StateObject;
    '16x9-640': ioBroker.StateObject;
    '16x9-960': ioBroker.StateObject;
    '16x9-1280': ioBroker.StateObject;
    '16x9-1920': ioBroker.StateObject;
};
type newsChannel = {
    news: customChannelType & {
        sophoraId: ioBroker.StateObject;
        externalId: ioBroker.StateObject;
        title: ioBroker.StateObject;
        date: ioBroker.StateObject;
        jsDate: ioBroker.StateObject;
        teaserImage: customChannelType & {
            alttext: ioBroker.StateObject;
            imageVariants: imageVariants;
            type: ioBroker.StateObject;
        };
        tags: customChannelType & {
            tag: ioBroker.StateObject;
        };

        updateCheckUrl: ioBroker.StateObject;
        topline: ioBroker.StateObject;
        firstSentence: ioBroker.StateObject;
        details: ioBroker.StateObject;
        detailsweb: ioBroker.StateObject;
        shareURL: ioBroker.StateObject;
        ressort: ioBroker.StateObject;
        regional: ioBroker.StateObject;
        breakingNews: ioBroker.StateObject;
        type: ioBroker.StateObject;
    };
    regional: ioBroker.StateObject;
    newStoriesCountLink: ioBroker.StateObject;
    type: ioBroker.StateObject;
    nextPage: ioBroker.StateObject;
    newsCount?: ioBroker.StateObject;
};

const imageVariants: imageVariants = {
    _channel: {
        _id: '',
        type: 'folder',
        common: {
            name: 'teaserImage.imageVariants',
        },
        native: {},
    },

    '1x1-144': {
        _id: '',
        type: 'state',
        common: {
            name: '1x1-144',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/tagesschau-1x1-144.png',
        },
        native: {},
    },
    '1x1-256': {
        _id: '',
        type: 'state',
        common: {
            name: '1x1-256',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/tagesschau-1x1-256.png',
        },
        native: {},
    },
    '1x1-432': {
        _id: '',
        type: 'state',
        common: {
            name: '1x1-432',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/tagesschau-1x1-432.png',
        },
        native: {},
    },
    '1x1-640': {
        _id: '',
        type: 'state',
        common: {
            name: '1x1-640',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/tagesschau-1x1-640.png',
        },
        native: {},
    },
    '1x1-840': {
        _id: '',
        type: 'state',
        common: {
            name: '1x1-840',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/tagesschau-1x1-840.png',
        },
        native: {},
    },
    '16x9-256': {
        _id: '',
        type: 'state',
        common: {
            name: '16x9-256',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/tagesschau-16x9-256.png',
        },
        native: {},
    },
    '16x9-384': {
        _id: '',
        type: 'state',
        common: {
            name: '16x9-384',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/tagesschau-16x9-384.png',
        },
        native: {},
    },
    '16x9-512': {
        _id: '',
        type: 'state',
        common: {
            name: '16x9-512',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/tagesschau-16x9-512.png',
        },
        native: {},
    },
    '16x9-640': {
        _id: '',
        type: 'state',
        common: {
            name: '16x9-640',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/tagesschau-16x9-640.png',
        },
        native: {},
    },
    '16x9-960': {
        _id: '',
        type: 'state',
        common: {
            name: '16x9-960',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/tagesschau-16x9-960.png',
        },
        native: {},
    },
    '16x9-1280': {
        _id: '',
        type: 'state',
        common: {
            name: '16x9-1280',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/tagesschau-16x9-1280.png',
        },
        native: {},
    },
    '16x9-1920': {
        _id: '',
        type: 'state',
        common: {
            name: '16x9-1920',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/tagesschau-16x9-1920.png',
        },
        native: {},
    },
};

export const newsChannel: newsChannel = {
    news: {
        _channel: {
            _id: '',
            type: 'folder',
            common: {
                name: 'newsmessage',
            },
            native: {},
        },
        _array: {
            _id: '',
            type: 'folder',
            common: {
                name: 'onenews',
            },
            native: { name: 'Nachricht' },
        },
        sophoraId: {
            _id: '',
            type: 'state',
            common: {
                name: 'sophoraId',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
        externalId: {
            _id: '',
            type: 'state',
            common: {
                name: 'externalId',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
        title: {
            _id: '',
            type: 'state',
            common: {
                name: 'title',
                type: 'string',
                role: 'media.title',
                read: true,
                write: false,
            },
            native: {},
        },
        date: {
            _id: '',
            type: 'state',
            common: {
                name: 'date',
                type: 'string',
                role: 'date',
                read: true,
                write: false,
            },
            native: {},
        },
        jsDate: {
            _id: '',
            type: 'state',
            common: {
                name: 'jsDate',
                type: 'number',
                role: 'date',
                read: true,
                write: false,
            },
            native: {},
        },
        regional: {
            _id: '',
            type: 'state',
            common: {
                name: 'regional',
                type: 'boolean',
                role: 'indicator',
                read: true,
                write: false,
                def: false,
            },
            native: {},
        },
        teaserImage: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'teaserImage',
                },
                native: {},
            },
            alttext: {
                _id: '',
                type: 'state',
                common: {
                    name: 'teaserImage.alttext',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            imageVariants: imageVariants,
            type: {
                _id: '',
                type: 'state',
                common: {
                    name: 'teaserImage.type',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
        },
        tags: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'tags',
                },
                native: {},
            },
            _array: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'tag',
                },
                native: { name: 'Keyword' },
            },

            tag: {
                _id: '',
                type: 'state',
                common: {
                    name: 'Wert',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
        },
        updateCheckUrl: {
            _id: '',
            type: 'state',
            common: {
                name: 'updateCheckUrl',
                type: 'string',
                role: 'text.url',
                read: true,
                write: false,
            },
            native: {},
        },
        topline: {
            _id: '',
            type: 'state',
            common: {
                name: 'topline',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
        firstSentence: {
            _id: '',
            type: 'state',
            common: {
                name: 'firstSentence',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
        details: {
            _id: '',
            type: 'state',
            common: {
                name: 'details',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
        detailsweb: {
            _id: '',
            type: 'state',
            common: {
                name: 'detailsweb',
                type: 'string',
                role: 'text.url',
                read: true,
                write: false,
            },
            native: {},
        },
        shareURL: {
            _id: '',
            type: 'state',
            common: {
                name: 'shareURL',
                type: 'string',
                role: 'text.url',
                read: true,
                write: false,
            },
            native: {},
        },
        ressort: {
            _id: '',
            type: 'state',
            common: {
                name: 'Ressort',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
        breakingNews: {
            _id: '',
            type: 'state',
            common: {
                name: 'breakingNews',
                type: 'boolean',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        },
        type: {
            _id: '',
            type: 'state',
            common: {
                name: 'Typ',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
    },
    regional: {
        _id: '',
        type: 'state',
        common: {
            name: 'Bitte bescheid sagen wenn hier was steht',
            type: 'boolean',
            role: 'indicator',
            read: true,
            write: false,
        },
        native: {},
    },
    newStoriesCountLink: {
        _id: '',
        type: 'state',
        common: {
            name: 'newStoriesCountLink',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
        },
        native: {},
    },
    type: {
        _id: '',
        type: 'state',
        common: {
            name: 'Typ',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
        },
        native: {},
    },
    nextPage: {
        _id: '',
        type: 'state',
        common: {
            name: 'nextPage',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
        },
        native: {},
    },
    newsCount: {
        _id: '',
        type: 'state',
        common: {
            name: 'newsCount',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
        native: {},
    },
};

type videoChannel = {
    channels: customChannelType & {
        sophoraId: ioBroker.StateObject;
        externalId: ioBroker.StateObject;
        title: ioBroker.StateObject;
        date: ioBroker.StateObject;
        jsDate: ioBroker.StateObject;
        teaserImage: customChannelType & {
            alttext: ioBroker.StateObject;
            imageVariants: imageVariants;
            type: ioBroker.StateObject;
            copyright: ioBroker.StateObject;
            title: ioBroker.StateObject;
        };
        tags: customChannelType & {
            tag: ioBroker.StateObject;
        };
        updateCheckUrl: ioBroker.StateObject;
        streams: customChannelType & {
            adaptivestreaming: ioBroker.StateObject;
            h264s: ioBroker.StateObject;
            h264m: ioBroker.StateObject;
            h264xl: ioBroker.StateObject;
        };
        length: ioBroker.StateObject;
        alttext: ioBroker.StateObject;
        copyright: ioBroker.StateObject;
        type: ioBroker.StateObject;
        content: customChannelType & {
            value: ioBroker.StateObject;
            type: ioBroker.StateObject;
        };
    };
};
/*
type breakingHomeChannel = {
    sophoraId: ioBroker.StateObject;
    externalId: ioBroker.StateObject;
    title: ioBroker.StateObject;
    date: ioBroker.StateObject;
    tags: customChannelType & {
        tag: ioBroker.StateObject;
    };
    updateCheckUrl: ioBroker.StateObject;
    content: customChannelType & {
        value: ioBroker.StateObject;
        type: ioBroker.StateObject;
    };
    tracking: customChannelType & {
        sid: ioBroker.StateObject;
        src: ioBroker.StateObject;
        ctp: ioBroker.StateObject;
        pdt: ioBroker.StateObject;
        otp: ioBroker.StateObject;
        cid: ioBroker.StateObject;
        pti: ioBroker.StateObject;
        bcr: ioBroker.StateObject;
        type: ioBroker.StateObject;
        av_full_show: ioBroker.StateObject;
    };
    topline: ioBroker.StateObject;
    firstSentence: ioBroker.StateObject;
    images: ioBroker.StateObject;
    details: ioBroker.StateObject;
    detailsweb: ioBroker.StateObject;
    shareURL: ioBroker.StateObject;
    geotags: Array<any>;
    regionId: number;
    regionIds: Array<any>;
    breakingNews: ioBroker.StateObject;
    type: ioBroker.StateObject;
};*/

const videoChannel: videoChannel = {
    channels: {
        _channel: {
            _id: '',
            type: 'folder',
            common: {
                name: 'channels',
            },
            native: {},
        },
        _array: {
            _id: '',
            type: 'folder',
            common: {
                name: 'channel',
            },
            native: { name: 'channel' },
        },
        sophoraId: {
            _id: '',
            type: 'state',
            common: {
                name: 'sophoraId',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
        externalId: {
            _id: '',
            type: 'state',
            common: {
                name: 'externalId',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
        title: {
            _id: '',
            type: 'state',
            common: {
                name: 'titel',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
        date: {
            _id: '',
            type: 'state',
            common: {
                name: 'date',
                type: 'string',
                role: 'date',
                read: true,
                write: false,
            },
            native: {},
        },
        jsDate: {
            _id: '',
            type: 'state',
            common: {
                name: 'jsDate',
                type: 'number',
                role: 'date',
                read: true,
                write: false,
            },
            native: {},
        },
        teaserImage: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'teaserImage',
                },
                native: {},
            },
            alttext: {
                _id: '',
                type: 'state',
                common: {
                    name: 'alttext',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            imageVariants: imageVariants,
            type: {
                _id: '',
                type: 'state',
                common: {
                    name: 'type',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            copyright: {
                _id: '',
                type: 'state',
                common: {
                    name: 'copyright',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            title: {
                _id: '',
                type: 'state',
                common: {
                    name: 'title',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
        },
        tags: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'tags',
                },
                native: {},
            },
            _array: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'tag',
                },
                native: { name: 'tag' },
            },

            tag: {
                _id: '',
                type: 'state',
                common: {
                    name: 'tag',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
        },
        length: {
            _id: '',
            type: 'state',
            common: {
                name: 'length',
                type: 'number',
                role: 'media.duration',
                read: true,
                write: false,
                unit: 's',
            },
            native: {},
        },
        updateCheckUrl: {
            _id: '',
            type: 'state',
            common: {
                name: 'updateCheckUrl',
                type: 'string',
                role: 'text.url',
                read: true,
                write: false,
            },
            native: {},
        },
        streams: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'Streams',
                },
                native: {},
            },
            adaptivestreaming: {
                _id: '',
                type: 'state',
                common: {
                    name: 'adaptivestreaming',
                    type: 'string',
                    role: 'text.url',
                    read: true,
                    write: false,
                },
                native: {},
            },
            h264s: {
                _id: '',
                type: 'state',
                common: {
                    name: 'H264s',
                    type: 'string',
                    role: 'text.url',
                    read: true,
                    write: false,
                },
                native: {},
            },
            h264m: {
                _id: '',
                type: 'state',
                common: {
                    name: 'H264m',
                    type: 'string',
                    role: 'text.url',
                    read: true,
                    write: false,
                },
                native: {},
            },
            h264xl: {
                _id: '',
                type: 'state',
                common: {
                    name: 'H264xl',
                    type: 'string',
                    role: 'text.url',
                    read: true,
                    write: false,
                },
                native: {},
            },
        },
        alttext: {
            _id: '',
            type: 'state',
            common: {
                name: 'alttext',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
        copyright: {
            _id: '',
            type: 'state',
            common: {
                name: 'copyright',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
        type: {
            _id: '',
            type: 'state',
            common: {
                name: 'type',
                type: 'string',
                role: 'text',
                read: true,
                write: false,
            },
            native: {},
        },
        content: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'content',
                },
                native: {},
            },
            value: {
                _id: '',
                type: 'state',
                common: {
                    name: 'value',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
            type: {
                _id: '',
                type: 'state',
                common: {
                    name: 'type',
                    type: 'string',
                    role: 'text',
                    read: true,
                    write: false,
                },
                native: {},
            },
        },
    },
};

export const genericStateObjects: {
    default: ioBroker.StateObject;
    customString: ioBroker.StateObject;
    online: ioBroker.StateObject;
    json: ioBroker.StateObject;
    totalNewsCount: ioBroker.StateObject;
    lastUpdate: ioBroker.StateObject;
    breakingNewsArray: ioBroker.StateObject;
    breakingNewsCount: ioBroker.StateObject;
    firstNewsAt: ioBroker.StateObject;
    scrollStep: ioBroker.StateObject;
    scrollForward: ioBroker.StateObject;
    scrollBackward: ioBroker.StateObject;
    autoScrollInterval: ioBroker.StateObject;
    autoScrollEnabled: ioBroker.StateObject;
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
            name: 'breakingNewsCount',
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
    totalNewsCount: {
        _id: '',
        type: 'state',
        common: {
            name: 'totalNewsCount',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
        },
        native: {},
    },
    lastUpdate: {
        _id: '',
        type: 'state',
        common: {
            name: 'lastUpdate',
            type: 'number',
            role: 'value.time',
            read: true,
            write: false,
        },
        native: {},
    },
    firstNewsAt: {
        _id: '',
        type: 'state',
        common: {
            name: 'firstNewsAt',
            type: 'number',
            role: 'level',
            min: 0,
            step: 1,
            read: true,
            write: true,
        },
        native: {},
    },
    scrollStep: {
        _id: '',
        type: 'state',
        common: {
            name: 'scrollStep',
            type: 'number',
            role: 'level',
            min: 0,
            step: 1,
            read: true,
            write: true,
        },
        native: {},
    },
    scrollForward: {
        _id: '',
        type: 'state',
        common: {
            name: 'scrollForward',
            type: 'boolean',
            role: 'button.next',
            read: false,
            write: true,
        },
        native: {},
    },
    scrollBackward: {
        _id: '',
        type: 'state',
        common: {
            name: 'scrollBackward',
            type: 'boolean',
            role: 'button.prev',
            read: false,
            write: true,
        },
        native: {},
    },
    autoScrollInterval: {
        _id: '',
        type: 'state',
        common: {
            name: 'autoScrollInterval',
            type: 'number',
            role: 'level',
            unit: 's',
            min: 2,
            read: true,
            write: true,
        },
        native: {},
    },
    autoScrollEnabled: {
        _id: '',
        type: 'state',
        common: {
            name: 'autoScrollEnabled',
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
        inland: customChannelType & newsChannel;
        ausland: customChannelType & newsChannel;
        wirtschaft: customChannelType & newsChannel;
        sport: customChannelType & newsChannel;
        video: customChannelType & newsChannel;
        investigativ: customChannelType & newsChannel;
        wissen: customChannelType & newsChannel;
        breakingNews: customChannelType & newsChannel;
    };
    videos: customChannelType & videoChannel;
};

export const statesObjects: statesObjectsType = {
    videos: {
        _channel: {
            _id: '',
            type: 'folder',
            common: {
                name: 'videos',
            },
            native: {},
        },
        ...videoChannel,
    },
    news: {
        _channel: {
            _id: '',
            type: 'folder',
            common: {
                name: 'newsmessage',
            },
            native: {},
        },
        breakingNews: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'breakingNews',
                },
                native: {},
            },
            ...newsChannel,
        },
        inland: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'inland',
                },
                native: {},
            },
            ...newsChannel,
        },
        ausland: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'ausland',
                },
                native: {},
            },
            ...newsChannel,
        },
        wirtschaft: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'wirtschaft',
                },
                native: {},
            },
            ...newsChannel,
        },
        sport: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'sport',
                },
                native: {},
            },
            ...newsChannel,
        },
        video: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'Videos',
                },
                native: {},
            },
            ...newsChannel,
        },
        investigativ: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'investigativ',
                },
                native: {},
            },
            ...newsChannel,
        },
        wissen: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'wissen',
                },
                native: {},
            },
            ...newsChannel,
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
    regional: false,
    regionId: 0,
    regionIds: [],
    ressort: '',
    breakingNews: false,
    type: '',
};

export type Root = {
    news: Array<{
        sophoraId: string;
        externalId: string;
        title: string;
        date: string;
        tags: Array<{
            tag: string;
        }>;
        updateCheckUrl: string;
        content: Array<{
            value?: string;
            type: string;
            video?: {
                sophoraId: string;
                externalId: string;
                title: string;
                date: string;
                teaserImage: {
                    title?: string;
                    copyright?: string;
                    alttext: string;
                    imageVariants: {
                        '1x1-144': string;
                        '1x1-256': string;
                        '1x1-432': string;
                        '1x1-640': string;
                        '1x1-840': string;
                        '16x9-256': string;
                        '16x9-384': string;
                        '16x9-512': string;
                        '16x9-640': string;
                        '16x9-960': string;
                        '16x9-1280': string;
                        '16x9-1920': string;
                    };
                    type: string;
                };
                tags: Array<{
                    tag: string;
                }>;
                updateCheckUrl: string;
                tracking: Array<{
                    sid?: string;
                    src?: string;
                    ctp?: string;
                    pdt?: string;
                    otp?: string;
                    cid?: string;
                    pti?: string;
                    bcr?: string;
                    type: string;
                    av_full_show?: boolean;
                    av_air_time?: string;
                    assetid?: string;
                    program?: string;
                    title?: string;
                    length?: string;
                    c2?: string;
                    c5?: string;
                    c7?: string;
                    c8?: string;
                    c9?: string;
                    c10?: string;
                    c12?: string;
                    c16?: string;
                    c18?: string;
                    type_nielsen?: string;
                    c15?: string;
                }>;
                streams: {
                    h264s?: string;
                    h264m?: string;
                    h264xl?: string;
                    adaptivestreaming: string;
                    avc720?: string;
                    avc360?: string;
                    avc270?: string;
                };
                alttext: string;
                copyright: string;
                type: string;
            };
            social?: {
                account: string;
                htmlEmbed: string;
                shorttext: string;
                title: string;
                url: string;
                username: string;
                type: string;
            };
            gallery?: Array<{
                title?: string;
                copyright?: string;
                alttext: string;
                imageVariants: {
                    '1x1-144': string;
                    '1x1-256': string;
                    '1x1-432': string;
                    '1x1-640': string;
                    '1x1-840': string;
                    '16x9-256': string;
                    '16x9-384': string;
                    '16x9-512': string;
                    '16x9-640': string;
                    '16x9-960': string;
                    '16x9-1280': string;
                    '16x9-1920': string;
                };
                type: string;
            }>;
            box?: {
                image?: {
                    alttext: string;
                    imageVariants: {
                        '1x1-144': string;
                        '1x1-256': string;
                        '1x1-432': string;
                        '1x1-640': string;
                        '1x1-840': string;
                        '16x9-256': string;
                        '16x9-384': string;
                        '16x9-512': string;
                        '16x9-640': string;
                        '16x9-960': string;
                        '16x9-1280': string;
                        '16x9-1920': string;
                    };
                    type: string;
                    copyright?: string;
                    title?: string;
                };
                date?: string;
                link?: string;
                subtitle?: string;
                text?: string;
                title: string;
            };
            title?: string;
            date?: string;
            teaserImage?: {
                title?: string;
                copyright: string;
                alttext: string;
                imageVariants: {
                    '1x1-144': string;
                    '1x1-256': string;
                    '1x1-432': string;
                    '1x1-640': string;
                    '1x1-840': string;
                    '16x9-256': string;
                    '16x9-384': string;
                    '16x9-512': string;
                    '16x9-640': string;
                    '16x9-960': string;
                    '16x9-1280': string;
                    '16x9-1920': string;
                };
                type: string;
            };
            tracking?: Array<{
                sid: string;
                src: string;
                ctp: string;
                pdt: string;
                otp: string;
                cid: string;
                pti: string;
                bcr: string;
                type: string;
                av_full_show: boolean;
                av_air_time: string;
            }>;
            text?: string;
            stream?: string;
            related?: Array<{
                teaserImage: {
                    alttext: string;
                    imageVariants: {
                        '1x1-144': string;
                        '1x1-256': string;
                        '1x1-432': string;
                        '1x1-640': string;
                        '1x1-840': string;
                        '16x9-256': string;
                        '16x9-384': string;
                        '16x9-512': string;
                        '16x9-640': string;
                        '16x9-960': string;
                        '16x9-1280': string;
                        '16x9-1920': string;
                    };
                    type: string;
                    title?: string;
                    copyright?: string;
                };
                date: string;
                sophoraId: string;
                externalId: string;
                topline?: string;
                title: string;
                details: string;
                detailsweb?: string;
                type: string;
                streams?: {
                    avc720: string;
                    avc360: string;
                    avc270: string;
                    adaptivestreaming: string;
                };
            }>;
        }>;
        tracking: Array<{
            sid: string;
            src: string;
            ctp: string;
            pdt: string;
            otp: string;
            cid: string;
            pti: string;
            bcr: string;
            type: string;
            av_full_show: boolean;
        }>;
        topline: string;
        firstSentence?: string;
        images: Array<{
            title: string;
            copyright: string;
            alttext: string;
            imageVariants: {
                '1x1-144': string;
                '1x1-256': string;
                '1x1-432': string;
                '1x1-640': string;
                '1x1-840': string;
                '16x9-256': string;
                '16x9-384': string;
                '16x9-512': string;
                '16x9-640': string;
                '16x9-960': string;
                '16x9-1280': string;
                '16x9-1920': string;
            };
            type: string;
        }>;
        details: string;
        detailsweb: string;
        shareURL: string;
        geotags: Array<any>;
        regionId: number;
        regionIds: Array<number>;
        breakingNews: boolean;
        type: string;
        teaserImage?: {
            copyright?: string;
            alttext: string;
            imageVariants: {
                '1x1-144': string;
                '1x1-256': string;
                '1x1-432': string;
                '1x1-640': string;
                '1x1-840': string;
                '16x9-256': string;
                '16x9-384': string;
                '16x9-512': string;
                '16x9-640': string;
                '16x9-960': string;
                '16x9-1280': string;
                '16x9-1920': string;
            };
            type: string;
            title?: string;
        };
        video?: {
            sophoraId: string;
            externalId: string;
            title: string;
            date: string;
            teaserImage: {
                title: string;
                copyright: string;
                alttext: string;
                imageVariants: {
                    '1x1-144': string;
                    '1x1-256': string;
                    '1x1-432': string;
                    '1x1-640': string;
                    '1x1-840': string;
                    '16x9-256': string;
                    '16x9-384': string;
                    '16x9-512': string;
                    '16x9-640': string;
                    '16x9-960': string;
                    '16x9-1280': string;
                    '16x9-1920': string;
                };
                type: string;
            };
            tags: Array<any>;
            updateCheckUrl: string;
            tracking: Array<{
                sid?: string;
                src?: string;
                ctp?: string;
                pdt?: string;
                otp?: string;
                cid?: string;
                pti?: string;
                bcr?: string;
                type: string;
                av_full_show?: boolean;
                assetid?: string;
                program?: string;
                title?: string;
                length?: string;
                c2?: string;
                c5?: string;
                c7?: string;
                c8?: string;
                c9?: string;
                c10?: string;
                c12?: string;
                c16?: string;
                c18?: string;
                type_nielsen?: string;
            }>;
            streams: {
                h264s: string;
                h264m: string;
                h264xl: string;
                adaptivestreaming: string;
            };
            alttext: string;
            copyright: string;
            type: string;
        };
        firstFrame?: {
            title: string;
            copyright: string;
            alttext: string;
            imageVariants: {
                '1x1-144': string;
                '1x1-256': string;
                '1x1-432': string;
                '1x1-640': string;
                '1x1-840': string;
                '16x9-256': string;
                '16x9-384': string;
                '16x9-512': string;
                '16x9-640': string;
                '16x9-960': string;
                '16x9-1280': string;
                '16x9-1920': string;
            };
            type: string;
        };
        ressort?: string;
        crop?: {
            id: string;
            type: string;
            croppingApiVersion: string;
            croppingUIVersion: string;
            croppingServiceVersion: string;
            noSound: boolean;
            videoSrc: string;
            imageSrc: Array<any>;
            imageNames: Array<any>;
            headerText: string;
            mainTexts: Array<string>;
            sceneSrcTexts: Array<string>;
            cameraMoves: Array<{
                point1X: number;
                point1Y: number;
                point2X: number;
                point2Y: number;
                startLeft: number;
                endLeft: number;
                duration: number;
            }>;
            events: Array<Array<number>>;
        };
        comments?: string;
        brandingImage?: {
            title: string;
            copyright: string;
            alttext: string;
            imageVariants: {
                original: string;
            };
            type: string;
        };
    }>;
    regional: Array<{
        sophoraId: string;
        externalId: string;
        title: string;
        date: string;
        teaserImage: {
            title?: string;
            copyright: string;
            alttext: string;
            imageVariants: {
                '1x1-144': string;
                '1x1-256': string;
                '1x1-432': string;
                '1x1-640': string;
                '1x1-840': string;
                '16x9-256': string;
                '16x9-384': string;
                '16x9-512': string;
                '16x9-640': string;
                '16x9-960': string;
                '16x9-1280': string;
                '16x9-1920'?: string;
            };
            type: string;
        };
        tags: Array<{
            tag: string;
        }>;
        updateCheckUrl: string;
        content: Array<{
            value?: string;
            type: string;
            title?: string;
            date?: string;
            teaserImage?: {
                title?: string;
                copyright: string;
                alttext: string;
                imageVariants: {
                    '1x1-144': string;
                    '1x1-256': string;
                    '1x1-432': string;
                    '1x1-640': string;
                    '1x1-840': string;
                    '16x9-256': string;
                    '16x9-384': string;
                    '16x9-512': string;
                    '16x9-640': string;
                    '16x9-960': string;
                    '16x9-1280': string;
                    '16x9-1920': string;
                };
                type: string;
            };
            tracking?: Array<{
                sid: string;
                src: string;
                ctp: string;
                pdt: string;
                otp: string;
                cid: string;
                pti: string;
                bcr: string;
                type: string;
                av_full_show: boolean;
            }>;
            stream?: string;
            box?: {
                image?: {
                    title?: string;
                    copyright: string;
                    alttext: string;
                    imageVariants: {
                        '1x1-144': string;
                        '1x1-256': string;
                        '1x1-432': string;
                        '1x1-640': string;
                        '1x1-840': string;
                        '16x9-256': string;
                        '16x9-384': string;
                        '16x9-512': string;
                        '16x9-640': string;
                        '16x9-960': string;
                        '16x9-1280': string;
                        '16x9-1920': string;
                    };
                    type: string;
                };
                date?: string;
                link?: string;
                text?: string;
                title: string;
            };
            video?: {
                sophoraId: string;
                externalId: string;
                title: string;
                date: string;
                teaserImage: {
                    copyright: string;
                    alttext: string;
                    imageVariants: {
                        '1x1-144': string;
                        '1x1-256': string;
                        '1x1-432': string;
                        '1x1-640': string;
                        '1x1-840': string;
                        '16x9-256': string;
                        '16x9-384': string;
                        '16x9-512': string;
                        '16x9-640': string;
                        '16x9-960': string;
                        '16x9-1280': string;
                        '16x9-1920': string;
                    };
                    type: string;
                    title?: string;
                };
                tags: Array<any>;
                updateCheckUrl: string;
                tracking: Array<{
                    sid?: string;
                    src?: string;
                    ctp?: string;
                    pdt?: string;
                    otp?: string;
                    cid?: string;
                    pti?: string;
                    bcr?: string;
                    type: string;
                    av_full_show?: boolean;
                    assetid?: string;
                    program?: string;
                    title?: string;
                    length?: string;
                    c2?: string;
                    c5?: string;
                    c7?: string;
                    c8?: string;
                    c9?: string;
                    c10?: string;
                    c12?: string;
                    c16?: string;
                    c18?: string;
                    type_nielsen?: string;
                }>;
                streams: {
                    h264xl: string;
                    adaptivestreaming: string;
                };
                alttext: string;
                copyright: string;
                type: string;
            };
            gallery?: Array<{
                title: string;
                copyright: string;
                alttext: string;
                imageVariants: {
                    '1x1-144': string;
                    '1x1-256': string;
                    '1x1-432': string;
                    '1x1-640': string;
                    '1x1-840': string;
                    '16x9-256': string;
                    '16x9-384': string;
                    '16x9-512': string;
                    '16x9-640': string;
                    '16x9-960': string;
                    '16x9-1280': string;
                    '16x9-1920'?: string;
                };
                type: string;
            }>;
            quotation?: {
                text: string;
            };
        }>;
        tracking: Array<{
            sid: string;
            src: string;
            ctp: string;
            pdt: string;
            otp: string;
            cid: string;
            pti: string;
            bcr: string;
            type: string;
            av_full_show: boolean;
        }>;
        topline: string;
        firstSentence?: string;
        images: Array<{
            title?: string;
            copyright: string;
            alttext: string;
            imageVariants: {
                '1x1-144': string;
                '1x1-256': string;
                '1x1-432': string;
                '1x1-640': string;
                '1x1-840': string;
                '16x9-256': string;
                '16x9-384': string;
                '16x9-512': string;
                '16x9-640': string;
                '16x9-960': string;
                '16x9-1280': string;
                '16x9-1920'?: string;
            };
            type: string;
        }>;
        brandingImage: {
            title: string;
            copyright: string;
            alttext: string;
            imageVariants: {
                original: string;
            };
            type: string;
        };
        details: string;
        detailsweb: string;
        shareURL: string;
        geotags: Array<any>;
        regionId: number;
        regionIds: Array<number>;
        breakingNews: boolean;
        type: string;
    }>;
    newStoriesCountLink: string;
    type: string;
};
