/**
 * ScoreboardComponent - Handles the high score display
 */
export class ScoreboardComponent {
    constructor(selector) {
        this.el = d3.select(selector);
    }

    update(scores) {
        if (!scores || scores.length === 0) {
            this.el.html('<div class="empty-scoreboard">No scores yet. Train hard!</div>');
            return;
        }

        this.el.html(`
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
}
