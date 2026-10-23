# Cloudflare Deployment Guide — Apex Fitness

Your Next.js 16 App Router website is pre-configured and tested for deployment on **Cloudflare** using the official **OpenNext Cloudflare Adapter** (`@opennextjs/cloudflare`) and **Wrangler**.

This setup ensures that all features:
- **Landing Page & Animations** (GSAP, dynamic viewports, mobile drawer)
- **Custom Admin CMS & Authentication** (`/admin`, cookies, server actions)
- **Lead Submission API** (`/api/leads`)
- **Cloudinary Media Uploads** (`/api/admin/upload`)
- **SEO & Sitemaps** (`sitemap.xml`, `robots.txt`, OpenGraph)

run at ultra-low latency on Cloudflare's global edge network.

---

## Method 1: Instant CLI Deployment (Quickest)

You can deploy directly from your local terminal with two commands:

### Step 1: Login to Cloudflare
```bash
npx wrangler login
```
*A browser window will open asking you to authorize Wrangler.*

### Step 2: Build & Deploy
```bash
npm run deploy:cloudflare
```
*Wrangler will build the `.open-next` worker and assets bundle, upload it to Cloudflare, and return your live public URL (e.g. `https://apex-fitness.<your-subdomain>.workers.dev` or Pages URL).*

---

## Method 2: Git Continuous Deployment (GitHub + Cloudflare Dashboard)

To automatically deploy every time you push code to GitHub:

### Step 1: Push your code to GitHub
Make sure all your latest files (including `wrangler.jsonc` and `open-next.config.ts`) are pushed to your GitHub repository.

### Step 2: Create a Cloudflare Project
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, go to **Workers & Pages** > **Create application**.
3. Select the **Pages** tab and click **Connect to Git**.
4. Select your `gymwebsite` repository.

### Step 3: Configure Build Settings
In the Cloudflare build configuration screen, enter:

| Setting | Value |
| :--- | :--- |
| **Framework preset** | `None` (or select `Next.js`) |
| **Build command** | `npx @opennextjs/cloudflare build` |
| **Build output directory** | `.open-next/assets` |
| **Root directory** | `/` |

### Step 4: Add Environment Variables
Under **Settings** > **Environment variables**, add the following production variables:

```bash
NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NODE_VERSION=20
```

### Step 5: Verify Compatibility Flag
Under **Settings** > **Functions** (or **Runtime**):
- **Compatibility flag**: Ensure `nodejs_compat` is enabled.
- **Compatibility date**: Set to `2025-02-15` (matching `wrangler.jsonc`).

Click **Save and Deploy**. Your website will build and go live across Cloudflare's worldwide CDN!

---

## Local Testing
To test the Cloudflare worker bundle locally before deploying:
```bash
npm run preview:cloudflare
```
