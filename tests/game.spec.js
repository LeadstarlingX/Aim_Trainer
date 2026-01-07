const { test, expect } = require('@playwright/test');

test.describe('Aim Trainer Core Mechanics', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load the game with settings overlay', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText('Aim Trainer');
        await expect(page.locator('#settings-overlay')).toBeVisible();
        await expect(page.locator('#timer')).toHaveText('00:00');
    });

    test('should start the game and countdown', async ({ page }) => {
        await page.selectOption('#duration-select', '0.5');
        await page.click('#start-btn');

        await expect(page.locator('#settings-overlay')).toBeHidden();

        // Check if timer changes from 00:30 (initial for 0.5 min)
        await expect(page.locator('#timer')).not.toHaveText('00:30', { timeout: 2000 });
    });

    test('should register misses on background click', async ({ page }) => {
        await page.click('#start-btn');

        // Click explicitly on the game canvas SVG
        const canvas = page.locator('#game-canvas');
        const box = await canvas.boundingBox();
        await page.mouse.click(box.x + 10, box.y + 10);

        await expect(page.locator('#misses')).toHaveText('1');
        await expect(page.locator('.feedback-label.danger-text')).toContainText('Miss');
    });

    test('should spawn dots in the game canvas', async ({ page }) => {
        await page.click('#start-btn');

        // Wait for at least one dot to spawn (spawnInterval is 1000ms)
        // D3 adds them as <circle class="dot">
        await page.waitForSelector('circle.dot', { timeout: 3000 });
        const dotCount = await page.locator('circle.dot').count();
        expect(dotCount).toBeGreaterThan(0);
    });

    test('should increase score when clicking a bonus dot', async ({ page }) => {
        await page.click('#start-btn');

        // Wait for a dot and click it
        const dot = page.locator('circle.dot').first();
        await dot.waitFor({ state: 'visible', timeout: 3000 });
        await dot.click({ force: true }); // Use force: true to ensure click on moving target

        // Stats might update to Hit or Harm depending on RNG, but score should change
        await expect(page.locator('#score')).not.toHaveText('0', { timeout: 2000 });
    });
});
