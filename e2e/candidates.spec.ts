import { test, expect } from '@playwright/test';

test.describe('Candidates E2E Flow', () => {
  test('should log in, create a candidate, and view them in the table', async ({ page }) => {
    // 1. Visit Login page
    await page.goto('/login');
    await expect(page).toHaveTitle(/Sign In|Welcome back|HireSync/i);

    // 2. Fill in credentials (Admin Demo user)
    await page.fill('#username', 'admin');
    await page.fill('#password', 'password');
    
    // 3. Submit login form and wait for redirect
    await page.click('button[type="submit"]');
    
    // Wait for the navigation to dashboard
    await page.waitForURL('**/dashboard');
    await expect(page.locator('header h2')).toContainText(/Dashboard/i);

    // 4. Navigate to Add Candidate page
    await page.goto('/candidates/new');
    await page.waitForURL('**/candidates/new');
    await expect(page.locator('h1')).toContainText(/Add New Candidate/i);

    // 5. Fill out the Candidate registration form
    const uniqueName = `E2E Test Candidate ${Date.now()}`;
    const uniqueEmail = `e2e_candidate_${Date.now()}@hiresync.com`;
    await page.fill('input[name="name"]', uniqueName);
    await page.fill('input[name="email"]', uniqueEmail);
    await page.selectOption('select[name="role"]', 'Frontend Developer');
    await page.fill('input[name="experience"]', '4');
    await page.fill('input[name="location"]', 'San Francisco, CA');

    // Toggle a popular skill to add/verify (e.g. Python)
    const pythonBtn = page.locator('button:has-text("Python")');
    await pythonBtn.click();

    // Type a custom skill and add it
    await page.fill('input[placeholder*="Type custom skill"]', 'Docker');
    await page.click('button:has-text("Add")');

    // 6. Submit the form
    await page.click('button[type="submit"]');

    // 7. Verify redirection back to the candidates list page
    await page.waitForURL('**/candidates');
    await expect(page.locator('header h2')).toContainText(/Candidates/i);
    
    // Verify that our newly added candidate exists in the candidate list table
    await expect(page.locator(`text=${uniqueName}`)).toBeVisible();
  });
});
