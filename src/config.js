/**
 * Aim Trainer - Global Configuration
 */

const config = {
    dotRadius: 20,
    spawnInterval: 1000,
    maxDots: 7,
    colors: {
        bonus: ['#58a6ff', '#3fb950', '#d29922'],
        penalty: '#f85149' // Red
    },
    penaltyChance: 0.2,
    difficulty: {
        beginner: { lifespan: 2500, spawnInterval: 1200 },
        intermediate: { lifespan: 1800, spawnInterval: 1000 },
        advanced: { lifespan: 1200, spawnInterval: 800 },
        elite: { lifespan: 800, spawnInterval: 600 }
    }
};
