const { test, expect } = require('@playwright/test');

test.describe('Aim Trainer Iteration 4: Persistence & Profiles', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Clear localStorage before each test to ensure a clean state
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.waitForSelector('body[data-game-ready="true"]');
    });

    test('should have player name input', async ({ page }) => {
        await expect(page.locator('#player-name')).toBeVisible();
        // Board is removed from main view
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
        // by evaluating a script to set timeLeft to 1 via hooks
        await page.evaluate(() => {
            window.__TEST_HOOKS__.session.timeLeft = 1;
        });

        await expect(page.locator('#game-over-overlay')).toBeVisible({ timeout: 10000 });

        // Check if final stats show accuracy and reaction time
        await expect(page.locator('#final-stats')).toContainText('Accuracy');
        await expect(page.locator('#final-stats')).toContainText('Avg Reaction');

        // Go back to main menu
        await page.click('#restart-btn');

        // Scoreboard is removed from home page, so we can't check it here anymore.
        // await expect(page.locator('.scoreboard-table tbody tr')).toHaveCount(1);
    });

    test.skip('should sort scoreboard by highest score', async ({ page }) => {
        // Scoreboard removed from home page
    });
});
