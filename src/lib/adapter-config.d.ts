// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
    namespace ioBroker {
        interface AdapterConfig {
            'L1': boolean;
            'L2': boolean;
            'L3': boolean;
            'L4': boolean;
            'L5': boolean;
            'L6': boolean;
            'L7': boolean;
            'L8': boolean;
            'L9': boolean;
            'L10': boolean;
            'L11': boolean;
            'L12': boolean;
            'L13': boolean;
            'L14': boolean;
            'L15': boolean;
            'L16': boolean;
            inland: boolean;
            ausland: boolean;
            sport: boolean;
            wirtschaft: boolean;
            video: boolean;
            investigativ: boolean;
            wissen: boolean;
            selectedTags: string[];
            interval: number;
            newsEnabled: boolean;
            videosEnabled: boolean;
            maxEntries: number;
            selectedUserTags: string[] | undefined;
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export { };

