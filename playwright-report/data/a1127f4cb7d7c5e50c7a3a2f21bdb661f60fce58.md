# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: jobs.spec.ts >> Jobs E2E Flow >> should log in, post a new job, view it in the admin table, and check on public jobs page
- Location: e2e\jobs.spec.ts:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/jobs", waiting until "load"

```

# Page snapshot

```yaml
- paragraph [ref=e6]: Loading...
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Jobs E2E Flow', () => {
  4  |   test('should log in, post a new job, view it in the admin table, and check on public jobs page', async ({ page }) => {
  5  |     // 1. Visit Login page
  6  |     await page.goto('/login');
  7  |     await expect(page).toHaveTitle(/Sign In|Welcome back|HireSync/i);
  8  | 
  9  |     // 2. Fill in credentials (Admin Demo user)
  10 |     await page.fill('#username', 'admin');
  11 |     await page.fill('#password', 'password');
  12 |     
  13 |     // 3. Submit login form and wait for redirect
  14 |     await page.click('button[type="submit"]');
  15 |     await page.waitForURL('**/dashboard');
  16 |     await expect(page.locator('header h2')).toContainText(/Dashboard/i);
  17 | 
  18 |     // 4. Navigate to Jobs Admin page
  19 |     await page.goto('/jobs-admin');
  20 |     await page.waitForURL('**/jobs-admin');
  21 |     await expect(page.locator('h2').filter({ hasText: 'Active Job Openings' })).toBeVisible();
  22 | 
  23 |     // 5. Click "Post Job" button to navigate to /jobs-admin/new
  24 |     await page.click('a:has-text("Post Job")');
  25 |     await page.waitForURL('**/jobs-admin/new');
  26 |     await expect(page.locator('h1')).toContainText(/Post a New Position/i);
  27 | 
  28 |     // 6. Fill out the Job posting form
  29 |     const uniqueJobTitle = `E2E Test Job Title ${Date.now()}`;
  30 |     await page.fill('input[name="title"]', uniqueJobTitle);
  31 |     await page.fill('input[name="department"]', 'Engineering');
  32 |     await page.selectOption('select[name="type"]', 'Full-time');
  33 |     await page.fill('input[name="location"]', 'Remote, US');
  34 |     await page.fill('input[name="salaryRange"]', '$130,000 - $160,000');
  35 |     await page.fill('textarea[name="description"]', 'This is an automated E2E test job description. We are looking for talented developers to join our growing engineering team.');
  36 |     await page.fill('textarea[name="requirements"]', '3+ years experience with Next.js and React\nStrong TypeScript knowledge\nGood communication skills');
  37 | 
  38 |     // 7. Submit the form
  39 |     await page.click('button[type="submit"]');
  40 | 
  41 |     // 8. Verify redirection back to /jobs-admin
  42 |     await page.waitForURL('**/jobs-admin');
  43 |     await expect(page.locator('h2').filter({ hasText: 'Active Job Openings' })).toBeVisible();
  44 |     
  45 |     // Verify the newly created job is in the list
  46 |     await expect(page.locator(`text=${uniqueJobTitle}`)).toBeVisible();
  47 | 
  48 |     // 9. Verify the job appears on the public Careers page
> 49 |     await page.goto('/jobs');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  50 |     await page.waitForURL('**/jobs');
  51 |     await expect(page.locator('h2').first()).toContainText('Open Positions');
  52 |     await expect(page.locator(`text=${uniqueJobTitle}`).first()).toBeVisible();
  53 |   });
  54 | });
  55 | 
```