/**
 * OverlayComponent - Handles settings and game over screens
 */
export class OverlayComponent {
    constructor(selectors) {
        this.settings = d3.select(selectors.settings);
        this.gameOver = d3.select(selectors.gameOver);
        this.finalStats = d3.select(selectors.finalStats);
    }

    showSettings() {
        this.settings.classed("hidden", false);
        this.gameOver.classed("hidden", true);
    }

    hideAll() {
        this.settings.classed("hidden", true);
        this.gameOver.classed("hidden", true);
    }

    showGameOver(stats) {
        this.gameOver.classed("hidden", false);
        this.finalStats.html(`
            <div class="stat-box">
                <span class="label">Final Score</span>
                <span style="font-size: 2rem; color: var(--accent-color)">${stats.score}</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                <div class="stat-box"><span class="label">Accuracy</span><span class="success-text">${stats.accuracy}%</span></div>
                <div class="stat-box"><span class="label">Avg Reaction</span><span class="accent-text">${stats.avgReaction}ms</span></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                <div><span class="label">Hits</span><div>${stats.hits}</div></div>
                <div><span class="label">Miss</span><div>${stats.misses}</div></div>
                <div><span class="label">Harm</span><div>${stats.harms}</div></div>
            </div>
        `);
    }
}
