# MioMusic Deployment Guide 🚀

MioMusic consists of two parts:
1.  **Website (Astro)**: Can be deployed to **Vercel** or **Netlify**.
2.  **Discord Bot (Node.js)**: Must be deployed to a **VPS** or a persistent host (Railway, Render, Hetzner).

## 1. Hosting the Website (Vercel)
- Connect your GitHub repo to Vercel.
- Vercel will automatically detect the **Astro** framework.
- The `vercel.json` in this repo is already configured.

## 2. Hosting the Bot (24/7)
**Crucial**: Vercel is *Serverless* and cannot host Discord bots with Voice support.

### Option A: Railway.app (Recommended)
1.  Create a new project on Railway.
2.  Connect your GitHub repo.
3.  Set the start command to: `npm run start:bot`.
4.  Add your Environment Variables (`TOKEN`, `CLIENT_ID`).

### Option B: VPS (Ubuntu)
1.  Connect to your VPS.
2.  Clone the repo: `git clone <repo-url>`.
3.  Install dependencies: `npm install`.
4.  Use **PM2** to keep the bot online:
    ```bash
    npm install pm2 -g
    pm2 start bot/index.js --name "mio-music"
    pm2 save
    pm2 startup
    ```

---
**Note on 24/7**: To keep Mio in the voice channel forever, ensure your environment stays active. The bot is configured to stay for 3 minutes after the last song, but you can change `leaveOnEndCooldown` in `bot/commands/play.js` to a very high number.
