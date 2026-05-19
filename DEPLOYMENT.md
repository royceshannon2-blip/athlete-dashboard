# Deployment

How to deploy APEX to GitHub Pages and other hosting platforms.

---

## GitHub Pages Deployment

APEX is configured to deploy as a static site to GitHub Pages at a subdirectory.

### Prerequisites

1. Repository on GitHub
2. GitHub Actions enabled (default)
3. Repository settings allow GitHub Pages deployment

### Setup

1. **Update repository name** in your repository settings
2. **Set `REPO_NAME`** environment variable in your build process

The build script reads `REPO_NAME` env var and `GITHUB_PAGES=true` to set the Vite base path correctly.

### Build for GitHub Pages

```bash
GITHUB_PAGES=true REPO_NAME=athlete-dashboard npm run build
```

This sets Vite's base path to `/athlete-dashboard/` so assets load correctly from the subdirectory.

**Why this matters**: GitHub Pages serves your repo at `https://username.github.io/repo-name/`, not the root. Vite needs to know the base path to generate correct asset URLs.

### Deploy to GitHub Pages

#### Option 1: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      
      - run: GITHUB_PAGES=true REPO_NAME=${{ github.event.repository.name }} npm run build
      
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
```

This workflow:
1. Triggers on push to main
2. Installs dependencies
3. Builds with correct GitHub Pages settings
4. Deploys `dist/public/` to GitHub Pages

#### Option 2: Manual Deployment

```bash
# Build locally
GITHUB_PAGES=true REPO_NAME=athlete-dashboard npm run build

# Push dist/public/ to gh-pages branch
git subtree push --prefix dist/public origin gh-pages
```

Then enable GitHub Pages in repository settings to serve from `gh-pages` branch.

### Verify Deployment

1. Go to repository Settings → Pages
2. Check that source is set to "Deploy from a branch" (gh-pages)
3. Visit `https://username.github.io/repo-name/`
4. App should load with correct styling and assets

### Troubleshooting GitHub Pages

**Problem**: Assets don't load (blank page or CSS/JS missing)
- **Cause**: Vite base path not set correctly
- **Solution**: Ensure `GITHUB_PAGES=true` and `REPO_NAME` are set during build

**Problem**: App loads but styling is broken
- **Cause**: Path aliases not resolving correctly
- **Solution**: Check `vite.config.ts` path alias configuration

**Problem**: 404 errors on refresh
- **Cause**: SPA routing not configured for GitHub Pages
- **Current**: App is a single page (`/`) so this shouldn't happen
- **Future**: If adding URL routing, need 404.html redirect

---

## Other Hosting Platforms

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist/public`
4. Environment variables:
   - `GITHUB_PAGES=false` (not needed for Netlify)
   - `REPO_NAME=athlete-dashboard` (optional, for reference only)

Netlify automatically handles asset paths correctly.

### Vercel

1. Import project from GitHub
2. Framework preset: Other (or Vite)
3. Build command: `npm run build`
4. Output directory: `dist/public`

Vercel handles asset paths automatically.

### AWS S3 + CloudFront

1. Build: `npm run build`
2. Upload `dist/public/` to S3 bucket
3. Configure CloudFront distribution
4. Set root object to `index.html`
5. Error pages: Route `/` to `index.html` for SPA routing

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --prod
COPY --from=0 /app/dist ./dist

EXPOSE 5000
CMD ["npm", "run", "start"]
```

Build and run:
```bash
docker build -t athlete-dashboard .
docker run -p 5000:5000 athlete-dashboard
```

---

## Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `GITHUB_PAGES` | `true` or `false` | Enable/disable GitHub Pages base path |
| `REPO_NAME` | e.g., `athlete-dashboard` | Repository name for base path calculation |

These are only needed during build time, not runtime.

---

## Build Process

The build script (`script/build.ts`) does the following:

1. **Check environment variables**:
   - If `GITHUB_PAGES=true`, read `REPO_NAME`
   - Otherwise, use `/` as base

2. **Set Vite config**:
   - Update `base` in Vite config based on `GITHUB_PAGES` env var
   - If true: `base: /repo-name/`
   - If false: `base: /`

3. **Build client**:
   - Run Vite build with configured base
   - Output to `dist/public/`
   - Generate CSS, JS, asset hashes for cache busting

4. **Build server**:
   - Compile Express server
   - Output to `dist/index.cjs`

5. **Result**:
   - `dist/public/` — Static assets ready to serve
   - `dist/index.cjs` — Express server (optional)

---

## Best Practices

1. **Always test builds locally**:
   ```bash
   npm run build
   npm run start
   ```
   Then visit `http://localhost:5000` to verify.

2. **Use environment variables for configuration**:
   - Don't hardcode base paths
   - Keep configuration in one place (build script)

3. **Cache busting**:
   - Vite automatically adds hashes to filenames
   - Assets update automatically when content changes
   - No manual cache invalidation needed

4. **Version control**:
   - Don't commit `dist/` directory
   - Add to `.gitignore`
   - Build fresh on each deployment

5. **Security**:
   - No sensitive data in code (no API keys, tokens)
   - App is completely client-side (safe)
   - Static hosting means no backend vulnerabilities

---

## Monitoring Deployments

Once deployed, monitor:
- Page load speed (use Chrome DevTools)
- Asset loading (check Network tab)
- Functionality (test day/category/duration selection)
- Errors (check browser Console)

---

## Rollback

If deployment breaks:

1. **GitHub Pages**: Push a new build to `gh-pages` branch
2. **Netlify**: Click "Rollback" in deployment history
3. **Vercel**: Revert to previous deployment from Deployments tab
4. **S3**: Sync old `dist/public/` contents to bucket

---

## Performance Optimization

Vite automatically optimizes the build:
- **Code splitting**: JS split into chunks loaded on demand
- **Tree shaking**: Remove unused code
- **Minification**: Compress CSS, JS, HTML
- **Asset optimization**: Optimize images

To further improve:
- Add lazy loading for large components
- Implement service worker for offline support
- Use CSS preprocessor for smaller CSS bundles
- Compress images with build tools

Currently the app is lean (~350KB gzipped), so further optimization is low priority.
