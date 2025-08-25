This README covers building the project and deploying to Netlify or Vercel.

Quick build (local)

1. Install dependencies

   npm install

2. Build

   npm run build

This creates a production bundle in the `build/` folder.

Environment variables

- If you use the Google Gemini API integration, set `REACT_APP_GEMINI_API_KEY` in your deployment environment. If you don't have this key, the app will still run but AI generation features will be disabled.

Netlify (recommended for a quick static deploy)

Option A — Deploy from GitHub (one-click):
1. Push your repository to GitHub (if not already).
2. In Netlify, choose "New site from Git" → connect your GitHub account → select the repository `lecturemind-frontend`.
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. In Netlify site settings → Environment → Add environment variable:
   - Key: `REACT_APP_GEMINI_API_KEY`
   - Value: <your-key> (optional)
5. Deploy site. Netlify will build and deploy automatically.

Option B — Drag & drop build folder:
1. Run `npm run build` locally.
2. Zip or drag the `build/` folder into Netlify's "Sites" → "Deploys" → drag & drop area.

Optional Netlify config (`netlify.toml`)

If you want a minimal `netlify.toml` in the repo root:

```toml
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Vercel (also easy — great for react-scripts apps)

Option A — Deploy from GitHub:
1. Push repo to GitHub.
2. Go to Vercel → New Project → import from GitHub → select repository.
3. Vercel will auto-detect a Create React App. Ensure these settings:
   - Build command: `npm run build`
   - Output directory: `build`
4. Add environment variable `REACT_APP_GEMINI_API_KEY` in the Vercel project settings (if needed).
5. Deploy.

Option B — CLI deploy (local build)

```bash
npm run build
vercel --prod
```

Notes and troubleshooting

- CORS / images: Portrait and works images are loaded from Wikimedia; if you see CORS issues, hosting build on Netlify/Vercel should be fine. If an image fails to load, the console will show a message.
- `react-speech-recognition`: If voice features don't work, ensure the dependency is installed and the app is served over HTTPS (browsers may restrict mic access on insecure origins). Vercel/Netlify provide HTTPS automatically.
- PowerShell `npm` script errors: Use a CMD terminal or set the ExecutionPolicy for your user (see local run notes in the project README).

One-click deploy badge (Netlify)

You can add a one-click deploy button to your repo README if you have a Netlify site preset. Netlify's UI provides the URL to generate a deploy button specific to your account/team.

If you'd like, I can:
- Add `netlify.toml` to the repo.
- Add a `vercel.json` with headers or redirects.
- Create a short `deploy.sh` script for convenience (Windows-friendly).

Tell me which you'd like next and I'll add it.
