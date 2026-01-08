const { test, expect } = require('@playwright/test');

test.describe('Aim Trainer Iteration 4: Persistence & Profiles', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Clear localStorage before each test to ensure a clean state
        await page.evaluate(() => localStorage.clear());
        await page.reload();
    });

    test('should have player name input and empty scoreboard on load', async ({ page }) => {
        await expect(page.locator('#player-name')).toBeVisible();
        await expect(page.locator('#scoreboard-list')).toContainText('No scores yet');
    });

    test('should save and display score after a session', async ({ page }) => {
        const playerName = 'Tester';
        await page.fill('#player-name', playerName);
        await page.selectOption('#duration-select', '0.5');
        await page.click('#start-btn');

        // Play for a bit - click at least one dot to ensure score > 0
        const dot = page.locator('circle.dot').first();
        await dot.waitFor({ state: 'visible', timeout: 3000 });
        await dot.click({ force: true });

        // Wait for session to end (0.5 min = 30s) - actually let's just end it early for test speed
        // by evaluating a script to set timeLeft to 1
        await page.evaluate(() => {
            gameState.timeLeft = 1;
        });

        await expect(page.locator('#game-over-overlay')).toBeVisible({ timeout: 10000 });

        // Check if final stats show accuracy and reaction time
        await expect(page.locator('#final-stats')).toContainText('Accuracy');
        await expect(page.locator('#final-stats')).toContainText('Avg Reaction');

        // Go back to main menu
        await page.click('#restart-btn');

        // Verify scoreboard has the entry
        await expect(page.locator('.scoreboard-table tbody tr')).toHaveCount(1);
        await expect(page.locator('.scoreboard-table tbody tr td').first()).toHaveText(playerName);
    });

    test('should sort scoreboard by highest score', async ({ page }) => {
        // Inject two scores manually via localStorage
        await page.evaluate(() => {
            const scores = [
                { name: 'Player1', score: 50, accuracy: '80.0', reaction: '300', difficulty: 'intermediate', date: '1/1/2026' },
                { name: 'Player2', score: 120, accuracy: '90.0', reaction: '250', difficulty: 'intermediate', date: '1/1/2026' }
            ];
            localStorage.setItem('aimTrainer_scores', JSON.stringify(scores));
        });
        await page.reload();

        const firstRowName = await page.locator('.scoreboard-table tbody tr td').first().textContent();
        expect(firstRowName).toBe('Player2'); // Higher score should be first
    });
});
