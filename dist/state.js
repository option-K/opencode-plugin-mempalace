export class StateManager {
    counts = new Map();
    miningLocks = new Map();
    threshold;
    constructor(threshold = 15) {
        this.threshold = threshold;
    }
    incrementAndCheck(sessionId) {
        const current = this.counts.get(sessionId) || 0;
        const next = current + 1;
        if (next >= this.threshold) {
            this.counts.set(sessionId, 0);
            return true;
        }
        this.counts.set(sessionId, next);
        return false;
    }
    hasPendingMessages(sessionId) {
        return (this.counts.get(sessionId) || 0) > 0;
    }
    resetCount(sessionId) {
        this.counts.set(sessionId, 0);
    }
    getDirtySessions() {
        const dirty = [];
        for (const [sessionId, count] of this.counts.entries()) {
            if (count > 0 && !this.miningLocks.get(sessionId)) {
                dirty.push(sessionId);
            }
        }
        return dirty;
    }
    acquireMiningLock(sessionId) {
        if (this.miningLocks.get(sessionId)) {
            return false;
        }
        this.miningLocks.set(sessionId, true);
        return true;
    }
    releaseMiningLock(sessionId) {
        this.miningLocks.set(sessionId, false);
    }
}
