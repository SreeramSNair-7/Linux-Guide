// file: src/tests/e2e/distro-catalog.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Linux Distro Catalog E2E Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Linux Distro Catalog/);
    await expect(page.getByRole('heading', { name: /Find Your Perfect/ })).toBeVisible();
  });

  test('should navigate to distros page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Browse All Distros/i }).click();
    await expect(page).toHaveURL(/\/distros/);
    await expect(page.getByRole('heading', { name: /Linux Distributions/ })).toBeVisible();
  });

  test('should search for distros', async ({ page }) => {
    await page.goto('/distros');
    const searchInput = page.getByPlaceholder(/Search distributions/);
    await searchInput.fill('ubuntu');
    await page.waitForTimeout(500); // Wait for debounce
    await expect(page).toHaveURL(/search=ubuntu/);
  });

  test('should open distro detail page', async ({ page }) => {
    await page.goto('/distros');
    const firstDistro = page.getByRole('link', { name: /View Details/ }).first();
    await firstDistro.click();
    await expect(page).toHaveURL(/\/distros\/.+/);
    await expect(page.getByRole('tab', { name: /Overview/ })).toBeVisible();
  });

  test('should switch between tabs on distro detail', async ({ page }) => {
    await page.goto('/distros/ubuntu-24-04-lts');
    
    // Overview tab (default)
    await expect(page.getByRole('tabpanel')).toContainText(/Target Users/);
    
    // Installation tab
    await page.getByRole('tab', { name: /Installation/ }).click();
    await expect(page.getByRole('tabpanel')).toContainText(/Installation Steps/);
    
    // Download tab
    await page.getByRole('tab', { name: /Download/ }).click();
    await expect(page.getByRole('tabpanel')).toContainText(/SHA256 Checksum/);
  });

  test('should open checksum verification modal', async ({ page }) => {
    await page.goto('/distros/ubuntu-24-04-lts');
    await page.getByRole('tab', { name: /Download/ }).click();
    await page.getByRole('button', { name: /Verify Checksum/ }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/Expected SHA256 Checksum/)).toBeVisible();
  });

  test('should open AI chat widget', async ({ page }) => {
    await page.goto('/distros/ubuntu-24-04-lts');
    await page.getByRole('button', { name: /Open AI assistant/ }).click();
    await expect(page.getByRole('heading', { name: /AI Assistant/ })).toBeVisible();
  });

  test('should navigate to compare page', async ({ page }) => {
    await page.goto('/distros');
    await page.getByRole('link', { name: /Compare Distros/ }).click();
    await expect(page).toHaveURL(/\/distros\/compare/);
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/');
    const themeButton = page.getByRole('button', { name: /Toggle theme/ });
    await themeButton.click();
    // Check if theme changed (class or attribute)
    const html = page.locator('html');
    await expect(html).toHaveAttribute('class', /dark|light/);
  });
});
