# Vercel Deploy Guide

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Manual Deploy

1. Push the repo to GitHub
2. Import the project in Vercel
3. Set the following environment variables in Vercel dashboard:

   - `NVIDIA_API_KEY` — for portfolio chat widget (/api/chat)
   - `OPENCODE_API_KEY` — for full chat page (/api/chat-full)

4. Deploy!

## Local Development

```bash
npm install
npm run dev
```
