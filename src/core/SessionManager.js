/**
 * SessionManager - Handles all timing and intervals
 */
export class SessionManager {
    constructor(eventEmitter) {
        this.events = eventEmitter;
        this.timeLeft = 0;
        this.spawnTimer = null;
        this.countdownTimer = null;
    }

    start(durationMinutes, spawnInterval) {
        this.timeLeft = durationMinutes * 60;
        this.stop(); // Ensure clean start

        this.countdownTimer = setInterval(() => {
            this.timeLeft--;
            this.events.emit('timerTick', this.timeLeft);
            if (this.timeLeft <= 0) {
                this.stop();
                this.events.emit('timerEnd');
            }
        }, 1000);

        this.spawnTimer = setInterval(() => {
            this.events.emit('spawnRequest');
        }, spawnInterval);
    }

    stop() {
        if (this.spawnTimer) clearInterval(this.spawnTimer);
        if (this.countdownTimer) clearInterval(this.countdownTimer);
        this.spawnTimer = null;
        this.countdownTimer = null;
    }

    getTimeLeft() { return this.timeLeft; }
}
