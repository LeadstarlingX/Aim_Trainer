/**
 * PersistenceManager - Handles localStorage for profiles and high scores
 */
export class PersistenceManager {
    constructor(storageKey = 'aimTrainer_scores') {
        this.storageKey = storageKey;
    }

    saveScore(name, stats, difficulty) {
        const scores = this.getScores();
        scores.push({
            name: name || "Anonymous",
            score: stats.score,
            accuracy: stats.accuracy,
            reaction: stats.avgReaction,
            difficulty: difficulty,
            date: new Date().toLocaleDateString()
        });

        // Keep top 5 for this specific difficulty
        const filtered = scores
            .filter(s => s.difficulty === difficulty)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        // Merge back with scores from other difficulties
        const others = scores.filter(s => s.difficulty !== difficulty);
        localStorage.setItem(this.storageKey, JSON.stringify([...others, ...filtered]));
    }

    getScores(difficulty = null) {
        const data = localStorage.getItem(this.storageKey);
        const scores = data ? JSON.parse(data) : [];

        if (difficulty) {
            return scores
                .filter(s => s.difficulty === difficulty)
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);
        }
        return scores;
    }

    clearAll() {
        localStorage.removeItem(this.storageKey);
    }
}
