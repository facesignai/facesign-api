# Deploying FaceSign API Documentation to Vercel

This guide walks you through deploying the FaceSign API documentation to Vercel using the free Hobby plan.

## Prerequisites

- GitHub repository with the documentation
- Vercel account (free at [vercel.com](https://vercel.com))
- Repository must be public for free tier

## Deployment Steps

### 1. Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Authorize Vercel to access your repositories

### 2. Import Project

1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Vercel will auto-detect it as a Next.js project

### 3. Configure Project Settings

```
Framework Preset: Next.js (auto-detected)
Root Directory: docs
Build Command: npm run build (auto-detected)
Output Directory: .next (auto-detected)
Install Command: npm install (auto-detected)
```

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your documentation will be live at `https://your-project-name.vercel.app`

**Total estimated cost: $0/month** for typical API documentation usage patterns.