/**
 * StatsManager - Handles all scoring and session statistics
 */
export class StatsManager {
    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.hits = 0;
        this.misses = 0;
        this.harms = 0;
        this.totalClicks = 0;
        this.reactionTimes = [];
    }

    registerHit(reactionTime) {
        this.hits++;
        this.score += 10;
        this.totalClicks++;
        if (reactionTime !== undefined) {
            this.reactionTimes.push(reactionTime);
        }
    }

    registerMiss() {
        this.misses++;
        this.totalClicks++;
    }

    registerHarm() {
        this.harms++;
        this.score = Math.max(0, this.score - 15);
        this.totalClicks++;
    }

    getAccuracy() {
        return this.totalClicks > 0
            ? ((this.hits / this.totalClicks) * 100).toFixed(1)
            : "0.0";
    }

    getAvgReactionTime() {
        return this.reactionTimes.length > 0
            ? (this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length).toFixed(0)
            : "0";
    }

    getStats() {
        return {
            score: this.score,
            hits: this.hits,
            misses: this.misses,
            harms: this.harms,
            accuracy: this.getAccuracy(),
            avgReaction: this.getAvgReactionTime()
        };
    }
}
