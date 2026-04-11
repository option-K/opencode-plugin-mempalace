export declare function isInitialized(dir: string): Promise<boolean>;
export declare function initialize(dir: string): Promise<void>;
export declare function wakeUp(wing: string): Promise<string | null>;
export declare function mine(dir: string, mode: string, wing: string): Promise<void>;
export declare function mineSync(dir: string, mode: string, wing: string): void;
