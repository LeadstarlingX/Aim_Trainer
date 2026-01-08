/**
 * DotFactory - Handles the creation of dot data objects
 */
export class DotFactory {
    constructor(config) {
        this.config = config;
        this.nextId = 0;
    }

    createDot(width, height) {
        const isPenalty = Math.random() < this.config.penaltyChance;
        const radius = this.config.dotRadius;

        return {
            id: this.nextId++,
            x: Math.random() * (width - radius * 2) + radius,
            y: Math.random() * (height - radius * 2) + radius,
            type: isPenalty ? 'penalty' : 'bonus',
            color: isPenalty ? this.config.colors.penalty : this.config.colors.bonus[Math.floor(Math.random() * this.config.colors.bonus.length)],
            spawnedAt: Date.now()
        };
    }

    reset() {
        this.nextId = 0;
    }
}
