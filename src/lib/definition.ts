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

export const defaultChannel: ioBroker.ChannelObject = {
    _id: '',
    type: 'channel',
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
        type: 'channel',
        common: {
            name: 'Bildvarianten',
        },
        native: {},
    },

    '1x1-144': {
        _id: '',
        type: 'state',
        common: {
            name: 'Format: 1x1 - Auflösung: 144',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/1x1-144.png',
        },
        native: {},
    },
    '1x1-256': {
        _id: '',
        type: 'state',
        common: {
            name: 'Format: 1x1 - Auflösung: 256',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/1x1-256.png',
        },
        native: {},
    },
    '1x1-432': {
        _id: '',
        type: 'state',
        common: {
            name: 'Format: 1x1 - Auflösung: 432',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/1x1-432.png',
        },
        native: {},
    },
    '1x1-640': {
        _id: '',
        type: 'state',
        common: {
            name: 'Format: 1x1 - Auflösung: 640',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/1x1-640.png',
        },
        native: {},
    },
    '1x1-840': {
        _id: '',
        type: 'state',
        common: {
            name: 'Format: 1x1 - Auflösung: 840',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/1x1-840.png',
        },
        native: {},
    },
    '16x9-256': {
        _id: '',
        type: 'state',
        common: {
            name: 'Format: 16x9 - Auflösung: 256',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/16x9-256.png',
        },
        native: {},
    },
    '16x9-384': {
        _id: '',
        type: 'state',
        common: {
            name: 'Format: 16x9 - Auflösung: 384',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/16x9-384.png',
        },
        native: {},
    },
    '16x9-512': {
        _id: '',
        type: 'state',
        common: {
            name: 'Format: 16x9 - Auflösung: 512',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/16x9-512.png',
        },
        native: {},
    },
    '16x9-640': {
        _id: '',
        type: 'state',
        common: {
            name: 'Format: 16x9 - Auflösung: 640',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/16x9-640.png',
        },
        native: {},
    },
    '16x9-960': {
        _id: '',
        type: 'state',
        common: {
            name: 'Format: 16x9 - Auflösung: 960',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/16x9-960.png',
        },
        native: {},
    },
    '16x9-1280': {
        _id: '',
        type: 'state',
        common: {
            name: 'Format: 16x9 - Auflösung: 1280',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/16x9-1280.png',
        },
        native: {},
    },
    '16x9-1920': {
        _id: '',
        type: 'state',
        common: {
            name: 'Format: 16x9 - Auflösung: 1920',
            type: 'string',
            role: 'text.url',
            read: true,
            write: false,
            def: '/adapter/tagesschau/img/16x9-1920.png',
        },
        native: {},
    },
};

export const newsChannel: newsChannel = {
    news: {
        _channel: {
            _id: '',
            type: 'channel',
            common: {
                name: 'Nachrichten',
            },
            native: {},
        },
        _array: {
            _id: '',
            type: 'channel',
            common: {
                name: 'Nachricht',
            },
            native: { name: 'Nachricht' },
        },
        sophoraId: {
            _id: '',
            type: 'state',
            common: {
                name: 'Sophora ID',
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
                name: 'Externe ID',
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
                name: 'Titel',
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
                name: 'Datum/Uhrzeit',
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
                name: 'Datum/Uhrzeit',
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
                type: 'channel',
                common: {
                    name: 'Teaserbild',
                },
                native: {},
            },
            alttext: {
                _id: '',
                type: 'state',
                common: {
                    name: 'Alternativer Text',
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
                    name: 'Typ',
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
                type: 'channel',
                common: {
                    name: 'Schlüsselwörter',
                },
                native: {},
            },
            _array: {
                _id: '',
                type: 'channel',
                common: {
                    name: 'Schlüsselwort',
                },
                native: { name: 'Schlüsselwort' },
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
                name: 'Update Check URL',
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
                name: 'Topline',
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
                name: 'Erster Satz',
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
                name: 'Details',
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
                name: 'Detailsweb',
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
                name: 'Share URL',
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
                name: 'Breaking News',
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
            name: 'Link zu den neuen Nachrichten',
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
            name: 'Nächste Seite',
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
            name: 'Anzahl der Nachrichten',
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

const videoChannel: videoChannel = {
    channels: {
        _channel: {
            _id: '',
            type: 'channel',
            common: {
                name: 'Kanäle',
            },
            native: {},
        },
        _array: {
            _id: '',
            type: 'channel',
            common: {
                name: 'Kanal',
            },
            native: { name: 'Kanal' },
        },
        sophoraId: {
            _id: '',
            type: 'state',
            common: {
                name: 'Eindeutige ID',
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
                name: 'Externe ID',
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
                name: 'Titel',
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
                name: 'Datum/Uhrzeit',
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
                name: 'Datum/Uhrzeit',
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
                type: 'channel',
                common: {
                    name: 'Teaserbild',
                },
                native: {},
            },
            alttext: {
                _id: '',
                type: 'state',
                common: {
                    name: 'Alternativer Text',
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
                    name: 'Typ',
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
                    name: 'Urheberrecht',
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
                    name: 'Titel',
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
                type: 'channel',
                common: {
                    name: 'Schlüsselwörter',
                },
                native: {},
            },
            _array: {
                _id: '',
                type: 'channel',
                common: {
                    name: 'Schlüsselwort',
                },
                native: { name: 'Schlüsselwort' },
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
        length: {
            _id: '',
            type: 'state',
            common: {
                name: 'Länge des Videos',
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
                name: 'Update Check URL',
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
                type: 'channel',
                common: {
                    name: 'Streams',
                },
                native: {},
            },
            adaptivestreaming: {
                _id: '',
                type: 'state',
                common: {
                    name: 'Adaptive Streaming',
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
                name: 'Alternativer Text',
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
                name: 'Urheberrecht',
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
                name: 'Typ',
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
                type: 'channel',
                common: {
                    name: 'Inhalt',
                },
                native: {},
            },
            value: {
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
    totalNewsCount: {
        _id: '',
        type: 'state',
        common: {
            name: 'Gesamtanzahl der Nachrichten vor Filterung',
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
            name: 'Letztes Update',
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
            name: 'Ab welcher Nachricht soll die Liste beginnen',
            type: 'number',
            role: 'value',
            min: 0,
            step: 1,
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
                name: 'Nachrichtenvideos',
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
                name: 'Nachrichten',
            },
            native: {},
        },
        breakingNews: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'Breaking News',
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
                    name: 'Inlandsnachrichten',
                },
                native: {},
            },
            ...newsChannel,
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
            ...newsChannel,
        },
        wirtschaft: {
            _channel: {
                _id: '',
                type: 'folder',
                common: {
                    name: 'Wirtschaftsnachrichten',
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
                    name: 'Sportnachrichten',
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
                    name: 'Investigative Nachrichten',
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
                    name: 'Wissensnachrichten',
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
    regionId: 0,
    regionIds: [],
    ressort: '',
    breakingNews: false,
    type: '',
};
