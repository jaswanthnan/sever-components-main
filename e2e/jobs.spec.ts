import { test, expect } from '@playwright/test';

test.describe('Jobs E2E Flow', () => {
  test('should log in, post a new job, view it in the admin table, and check on public jobs page', async ({ page }) => {
    // Enable console logs tracking in E2E tests
    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE] [${msg.type()}] ${msg.text()}`);
    });
    page.on('pageerror', err => {
      console.error(`[BROWSER UNCAUGHT EXCEPTION] ${err.message}`);
    });

    // 1. Visit Login page
    await page.goto('/login');
    await expect(page).toHaveTitle(/Sign In|Welcome back|HireSync/i);

    // 2. Fill in credentials (Admin Demo user)
    await page.fill('#username', 'admin');
    await page.fill('#password', 'password');
    
    // 3. Submit login form and wait for redirect
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await expect(page.locator('header h2')).toContainText(/Dashboard/i);

    // 4. Navigate to Jobs Admin page
    await page.goto('/jobs-admin');
    await page.waitForURL('**/jobs-admin');
    await expect(page.locator('h2').filter({ hasText: 'Active Job Openings' })).toBeVisible();

    // 5. Click "Post Job" button to navigate to /jobs-admin/new
    await page.click('a:has-text("Post Job")');
    await page.waitForURL('**/jobs-admin/new');
    await expect(page.locator('h1')).toContainText(/Post a New Position/i);

    // 6. Fill out the Job posting form
    const uniqueJobTitle = `E2E Test Job Title ${Date.now()}`;
    await page.fill('input[name="title"]', uniqueJobTitle);
    await page.fill('input[name="department"]', 'Engineering');
    await page.selectOption('select[name="type"]', 'Full-time');
    await page.fill('input[name="location"]', 'Remote, US');
    await page.fill('input[name="salaryRange"]', '$130,000 - $160,000');
    await page.fill('textarea[name="description"]', 'This is an automated E2E test job description. We are looking for talented developers to join our growing engineering team.');
    await page.fill('textarea[name="requirements"]', '3+ years experience with Next.js and React\nStrong TypeScript knowledge\nGood communication skills');

    // 7. Submit the form
    await page.click('button[type="submit"]');

    // 8. Verify redirection back to /jobs-admin
    await page.waitForURL('**/jobs-admin');
    await expect(page.locator('h2').filter({ hasText: 'Active Job Openings' })).toBeVisible();
    
    // Verify the newly created job is in the list
    await expect(page.locator(`text=${uniqueJobTitle}`)).toBeVisible();

    // 9. Verify the job appears on the public Careers page
    await page.goto('/jobs');
    await page.waitForURL('**/jobs');
    await expect(page.locator('h2').first()).toContainText('Open Positions');
    await expect(page.locator(`text=${uniqueJobTitle}`).first()).toBeVisible();

    // 10. Navigate back to /jobs-admin to test Edit functionality
    await page.goto('/jobs-admin');
    await page.waitForURL('**/jobs-admin');

    // Locate the row containing our unique job title
    const row = page.locator('.ag-row', { hasText: uniqueJobTitle });
    await row.locator('button[title="Edit Job"]').click();

    // Verify Edit page load
    await page.waitForURL('**/edit');
    await expect(page.locator('h1')).toContainText(/Edit Job Posting/i);

    // Verify fields populated correctly
    await expect(page.locator('input[name="title"]')).toHaveValue(uniqueJobTitle);
    await expect(page.locator('input[name="department"]')).toHaveValue('Engineering');
    await expect(page.locator('textarea[name="description"]')).toHaveValue('This is an automated E2E test job description. We are looking for talented developers to join our growing engineering team.');

    // Edit the title
    const editedJobTitle = `${uniqueJobTitle} Edited`;
    await page.fill('input[name="title"]', editedJobTitle);

    // Save changes
    await page.click('button[type="submit"]');

    // Verify redirection and new title in list
    await page.waitForURL('**/jobs-admin');
    await expect(page.locator(`text=${editedJobTitle}`)).toBeVisible();

    // 11. Verify edited job appears on public Careers page
    await page.goto('/jobs');
    await page.waitForURL('**/jobs');
    await expect(page.locator(`text=${editedJobTitle}`).first()).toBeVisible();

    // 12. Navigate back to /jobs-admin to test Delete functionality
    await page.goto('/jobs-admin');
    await page.waitForURL('**/jobs-admin');

    // Setup dialog listener to accept the delete confirmation
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Are you sure you want to delete this job posting?');
      await dialog.accept();
    });

    // Locate the edited row and click delete button
    const editedRow = page.locator('.ag-row', { hasText: editedJobTitle });
    await editedRow.locator('button[title="Delete Job"]').click();

    // Verify job title is no longer visible in list
    await expect(page.locator(`text=${editedJobTitle}`)).not.toBeVisible();

    // 13. Verify the deleted job is no longer on public Careers page
    await page.goto('/jobs');
    await page.waitForURL('**/jobs');
    await expect(page.locator(`text=${editedJobTitle}`)).not.toBeVisible();
  });
});
