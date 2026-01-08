const { test, expect } = require('@playwright/test');

test.describe('Aim Trainer Core Mechanics', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        //await page.waitForSelector('body[data-game-ready="true"]');
        await page.waitForSelector('#settings-overlay:not(.hidden)');
    });

    test('should load the game with settings overlay', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText('Aim Trainer');
        await expect(page.locator('#settings-overlay')).toBeVisible();
        await expect(page.locator('#timer')).toHaveText('00:00');
    });

    test('should start the game with selected difficulty', async ({ page }) => {
        await page.selectOption('#difficulty-select', 'elite');
        await page.click('#start-btn');
        await expect(page.locator('#settings-overlay')).toBeHidden();
    });

    test('should register misses on background click', async ({ page }) => {
        await page.click('#start-btn');
        const canvas = page.locator('#game-canvas');
        const box = await canvas.boundingBox();
        // Click more reliably in center
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await expect(page.locator('#misses')).not.toHaveText('0');
    });

    test('should have dots disappear after lifespan', async ({ page }) => {
        // Select Elite (800ms lifespan)
        await page.selectOption('#difficulty-select', 'elite');
        await page.click('#start-btn');

        // Wait for a dot to appear and get its unique ID
        const dotLocator = page.locator('circle.dot').first();
        await dotLocator.waitFor({ state: 'visible', timeout: 3000 });
        const id = await dotLocator.getAttribute('id');
        const specificDot = page.locator(`#${id}`);

        // Wait for that specific element to disappear
        await expect(specificDot).toBeHidden({ timeout: 4000 });
    });

    test('should spawn dots in the game canvas', async ({ page }) => {
        await page.click('#start-btn');
        await page.waitForSelector('circle.dot', { timeout: 3000 });
        const dotCount = await page.locator('circle.dot').count();
        expect(dotCount).toBeGreaterThan(0);
    });

    test('should update stats when clicking a dot', async ({ page }) => {
        await page.click('#start-btn');
        const dot = page.locator('circle.dot').first();
        await dot.waitFor({ state: 'visible', timeout: 3000 });
        await dot.click({ force: true });

        // Stats or score should change
        // Using a broad check because first dot might be penalty (score stays 0)
        await expect(page.locator('.feedback-label')).toBeVisible({ timeout: 2000 });
    });
});
