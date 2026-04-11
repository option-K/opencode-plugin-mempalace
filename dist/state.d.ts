export declare class StateManager {
    private counts;
    private miningLocks;
    private threshold;
    constructor(threshold?: number);
    incrementAndCheck(sessionId: string): boolean;
    hasPendingMessages(sessionId: string): boolean;
    resetCount(sessionId: string): void;
    getDirtySessions(): string[];
    acquireMiningLock(sessionId: string): boolean;
    releaseMiningLock(sessionId: string): void;
}
