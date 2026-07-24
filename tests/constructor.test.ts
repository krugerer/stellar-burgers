import { test, expect } from '@playwright/test';

test.describe('E2E Тестирование конструктора бургеров', () => {
    test.beforeEach(async ({ page }) => {
        await page.routeFromHAR('./tests/hars/burger.har', {
            url: '**/api/**',
            update: false,
        });
    });

    test('Добавление булки и начинки в конструктор', async ({ page }) => {
        await page.goto('/');
        
        const bunCard = page.locator('[data-testid="ingredient-item"]').filter({ hasText: 'Краторная булка N-200i' });
        const mainCard = page.locator('[data-testid="ingredient-item"]').filter({ hasText: 'Биокотлета из марсианской Магнолии' });

        await bunCard.getByRole('button').click();
        await mainCard.getByRole('button').click();

        await expect(page.locator('[data-testid="constructor-bun-top"]')).toContainText('Краторная булка N-200i');
        await expect(page.locator('[data-testid="constructor-ingredients"]')).toContainText('Биокотлета из марсианской Магнолии');
        await expect(page.locator('[data-testid="constructor-bun-bottom"]')).toContainText('Краторная булка N-200i');
    });

    test.describe('Работа модального окна деталей ингредиента', () => {
        test('Открытие, проверка содержимого и закрытие модалки по крестику и оверлею', async ({ page }) => {
            await page.goto('/');
            const modal = page.locator('[data-testid="modal"]');
            
            await page.locator('[data-testid="ingredient-link"]').first().click();
            await expect(modal).toBeVisible();

            await expect(
                page.locator('[data-testid="ingredient-details-name"]')
            ).toHaveText('Краторная булка N-200i');

            await page.locator('[data-testid="modal-close"]').click();
            await expect(modal).not.toBeVisible();
            await expect(modal).not.toBeAttached();

            await page.locator('[data-testid="ingredient-link"]').first().click();
            await expect(modal).toBeVisible();

            await page.locator('[data-testid="modal-overlay"]').click({
                position: {
                    x: 10,
                    y: 10
                }
            });
            await expect(modal).not.toBeVisible();
            await expect(modal).not.toBeAttached();
            // await expect(page).toHaveURL('/');
            // await expect(page.locator('[data-testid="ingredient-link"]').first()).toBeVisible();
        });
    });

    test.describe('Создание заказа', () => {
        test('Оформление заказа авторизованным пользователем и очистка конструктора', async ({ page, context }) => {
            
            await context.addCookies([
                {
                    name: 'accessToken',
                    value: 'Bearer%20mock-access-token',
                    domain: 'localhost',
                    path: '/'
                }
            ]);

            await page.addInitScript(() => {
                localStorage.setItem('refreshToken', 'mock-refresh-token');
            });

            await page.route('**/api/auth/user', async route => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        success: true,
                        user: {
                            email: 'testuser@example.com',
                            name: 'Test User'
                        }
                    })
                });
            });

            await page.route('**/api/orders', async route => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        success: true,
                        name: 'Краторный марсианский бургер',
                        order: {
                            number: 9999
                        }
                    })
                });
            });

            await page.goto('/');

            const bunCard = page.locator('[data-testid="ingredient-item"]').filter({ hasText: 'Краторная булка N-200i' });
            const mainCard = page.locator('[data-testid="ingredient-item"]').filter({ hasText: 'Биокотлета из марсианской Магнолии' });

            await bunCard.getByRole('button', { name: 'Добавить' }).click();
            await mainCard.getByRole('button', { name: 'Добавить' }).click();

            await page.getByRole('button', { name: 'Оформить заказ' }).click();

            const modal = page.locator('[data-testid="modal"]');
            await expect(modal).toBeVisible();
            await expect(page.locator('[data-testid="order-number"]')).toHaveText('9999');

            await page.locator('[data-testid="modal-close"]').click();
            await expect(modal).not.toBeVisible();

            await expect(page.locator('[data-testid="constructor-ingredients"]')).not.toContainText('Биокотлета из марсианской Магнолии');
            await expect(page.locator('[data-testid="constructor-bun-top"]')).not.toBeVisible();
        });
    });
});