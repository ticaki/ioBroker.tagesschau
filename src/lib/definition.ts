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

export const defaultChannel: ioBroker.ChannelObject = {
    _id: '',
    type: 'channel',
    common: {
        name: 'Hey no description... ',
    },
    native: {},
};

export const genericStateObjects: {
    default: ioBroker.StateObject;
    customString: ioBroker.StateObject;
    online: ioBroker.StateObject;
    json: ioBroker.StateObject;
    settings: ioBroker.FolderObject;
    global: ioBroker.FolderObject;
    authenticationError: ioBroker.StateObject;
    deviceDB: ioBroker.StateObject;
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
    deviceDB: {
        _id: '',
        type: 'state',
        common: {
            name: 'genericStateObjects.deviceDB',
            type: 'string',
            role: 'json',
            read: true,
            write: false,
        },
        native: {},
    },
    authenticationError: {
        _id: '',
        type: 'state',
        common: {
            name: 'genericStateObjects.authenticationError',
            type: 'boolean',
            role: 'indicator',
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
    inland: customChannelType;
    ausland: customChannelType;
    wirtschaft: customChannelType;
    sport: customChannelType;
    video: customChannelType;
    investigativ: customChannelType;
    wissen: customChannelType;
};

export const statesObjects: statesObjectsType = {
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
};

export const descriptionUrlAppendix = '/description.xml';

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
