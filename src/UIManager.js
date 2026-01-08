/**
 * UIManager - Handles all UI transitions, overlays, and feedback
 */
class UIManager {
    constructor(selectors) {
        this.selectors = selectors;
        this.els = {
            settings: d3.select(selectors.settings),
            gameOver: d3.select(selectors.gameOver),
            score: d3.select(selectors.score),
            hits: d3.select(selectors.hits),
            misses: d3.select(selectors.misses),
            harms: d3.select(selectors.harms),
            timer: d3.select(selectors.timer),
            playerName: d3.select(selectors.playerName),
            scoreboardList: d3.select(selectors.scoreboardList),
            finalStats: d3.select(selectors.finalStats),
            canvasWrapper: d3.select(selectors.canvasWrapper)
        };
    }

    updateStats(stats) {
        this.els.score.text(stats.score);
        this.els.hits.text(stats.hits);
        this.els.misses.text(stats.misses);
        this.els.harms.text(stats.harms);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updateTimer(seconds) {
        this.els.timer.text(this.formatTime(seconds));
    }

    showSettings() {
        this.els.settings.classed("hidden", false);
        this.els.gameOver.classed("hidden", true);
    }

    hideOverlays() {
        this.els.settings.classed("hidden", true);
        this.els.gameOver.classed("hidden", true);
    }

    showGameOver(stats) {
        this.els.gameOver.classed("hidden", false);
        this.els.finalStats.html(`
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

    updateScoreboard(scores) {
        if (!scores || scores.length === 0) {
            this.els.scoreboardList.html('<div class="empty-scoreboard">No scores yet. Train hard!</div>');
            return;
        }

        this.els.scoreboardList.html(`
            <table class="scoreboard-table">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Score</th>
                        <th>Acc%</th>
                    </tr>
                </thead>
                <tbody>
                    ${scores.map(s => `
                        <tr>
                            <td>${s.name}</td>
                            <td>${s.score}</td>
                            <td>${s.accuracy}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `);
    }

    getPlayerName() {
        return this.els.playerName.property("value").trim() || "Anonymous";
    }

    showFeedback(text, x, y, colorClass) {
        const wrapperRect = this.els.canvasWrapper.node().getBoundingClientRect();
        const relativeX = x - wrapperRect.left;
        const relativeY = y - wrapperRect.top;

        this.els.canvasWrapper.append("div")
            .attr("class", `feedback-label ${colorClass}`)
            .style("left", `${relativeX}px`)
            .style("top", `${relativeY}px`)
            .text(text)
            .on("animationend", function () { d3.select(this).remove(); });
    }
}
