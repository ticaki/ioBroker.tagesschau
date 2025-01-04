// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
    namespace ioBroker {
        interface AdapterConfig {
            '1': boolean;
            '2': boolean;
            '3': boolean;
            '4': boolean;
            '5': boolean;
            '6': boolean;
            '7': boolean;
            '8': boolean;
            '9': boolean;
            '10': boolean;
            '11': boolean;
            '12': boolean;
            '13': boolean;
            '14': boolean;
            '15': boolean;
            '16': boolean;
            inland: boolean;
            ausland: boolean;
            sport: boolean;
            wirtschaft: boolean;
            video: boolean;
            investigativ: boolean;
            wissen: boolean;
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export { };

