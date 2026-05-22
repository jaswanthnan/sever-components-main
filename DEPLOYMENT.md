# HireSync Recruitment CRM: Deployment, Previews, and Rollbacks Guide

This guide outlines how to deploy the Next.js application to Vercel, use automated Preview Deployments for safe integration testing, manage environment variables securely in cloud runtimes, and execute rollbacks to recover instantly from unexpected production issues.

---

## 1. Deploying to Vercel

Vercel is the native platform for Next.js, offering zero-configuration compilation, global edge distribution, and serverless database integrations.

### Step-by-Step Vercel Deployment Flow:
1. **Push your code to GitHub**: Create a repository for your HireSync project on GitHub.
2. **Sign In to Vercel**: Go to [vercel.com](https://vercel.com) and log in using your GitHub account.
3. **Import the Project**:
   - Click **Add New** → **Project**.
   - Select your HireSync GitHub repository from the import list.
4. **Configure Project Settings**:
   - **Framework Preset**: Next.js (automatically detected).
   - **Root Directory**: `./` (leave default).
   - **Build Command**: `npm run build` (automatically detected).
5. **Add Environment Variables**:
   Under the **Environment Variables** section, copy the variables from your `.env.local` or `.env.example` file:
   - `MONGODB_URI` (Use a cloud-hosted MongoDB Atlas URI for production).
   - `AUTH_SECRET` (A unique 32-character key generated via `openssl rand -base64 32`).
   - `NEXTAUTH_URL` (Set to your canonical custom domain or the `.vercel.app` production domain).
   - `GROQ_API_KEY` and `ANTHROPIC_API_KEY`.
   - `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` (to upload source maps and send error telemetry).
6. **Click Deploy**:
   Vercel will compile the application, optimize your images, upload your Sentry source maps, and provision your live serverless domain (e.g., `hiresync.vercel.app`).

---

## 2. Preview Deployments (Test Before You Merge)

Vercel integrates directly with GitHub to provide isolated temporary live URLs for every code update outside the `main` branch.

### How Preview Deployments Work:
- **Automatic Triggers**: Every time you push a branch or create a Pull Request on GitHub, Vercel initiates a **Preview Build**.
- **Unique URL**: Vercel generates a unique, secure URL specifically for that branch (e.g., `hiresync-git-feature-candidate-test-yourname.vercel.app`).
- **Live Collaborative Review**: Team members, QA analysts, and stakeholders can access the temporary URL to review changes exactly as they will perform in production.
- **Automated Testing against Previews**:
  You can run your E2E Playwright test suite against the live preview URL to guarantee the application works flawlessly in the cloud before merging.
  ```bash
  # Example: Running Playwright against a live Vercel Preview URL
  npx playwright test --config=playwright.config.ts --url=https://your-preview-url.vercel.app
  ```

---

## 3. Production Rollbacks (Zero-Downtime Incident Recovery)

If a bug slips past testing and crashes your live website, Vercel enables **Instant Rollbacks** to return to a previous working version without rebuilding or pushing code.

### How to Rollback to a Previous Deployment:
1. Open the [Vercel Dashboard](https://vercel.com) and click on your HireSync project.
2. Navigate to the **Deployments** tab.
3. Browse the list of previous successful production builds.
4. Click the **dots icon (`...`)** next to the stable deployment you want to restore.
5. Select **Rollback** from the dropdown menu.
6. Confirm the action in the pop-up modal.
7. **Immediate Effect**: Within milliseconds, Vercel redirects all incoming traffic to the stable build. The rollback is instant, zero-downtime, and requires no code changes.
