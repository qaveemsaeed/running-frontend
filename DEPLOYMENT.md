# Deployment Guide - Recipe Basket Frontend

This guide will help you deploy your React + Vite frontend application to Vercel.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Backend API**: Your backend should be deployed and accessible

## Step 1: Prepare Your Repository

### 1.1 Environment Variables
Create a `.env` file in your project root with your production API URLs:

```env
# API Configuration
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_AUTH_API_BASE_URL=https://your-auth-backend-domain.com/api
```

### 1.2 Commit Your Changes
Make sure all your changes are committed to your GitHub repository:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### 2.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project

### 2.2 Configure Project Settings
Vercel should automatically detect your project settings, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.3 Environment Variables
In the Vercel project settings, add your environment variables:

1. Go to your project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add the following variables:
   - `VITE_API_BASE_URL`: Your production backend API URL
   - `VITE_AUTH_API_BASE_URL`: Your production auth API URL

### 2.4 Deploy
Click "Deploy" and wait for the build to complete.

## Step 3: Post-Deployment

### 3.1 Verify Deployment
- Check that your app loads correctly
- Test all major functionality (login, search, cart, checkout)
- Verify API calls are working with production URLs

### 3.2 Custom Domain (Optional)
1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Configure DNS settings as instructed

## Step 4: Troubleshooting

### Common Issues

1. **API Calls Failing**
   - Check that your environment variables are set correctly
   - Verify your backend is accessible from Vercel's servers
   - Check CORS settings on your backend

2. **Build Failures**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

3. **Routing Issues**
   - The `vercel.json` file handles client-side routing
   - All routes should redirect to `index.html`

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Main API base URL | `https://api.yourapp.com/api` |
| `VITE_AUTH_API_BASE_URL` | Authentication API base URL | `https://auth.yourapp.com/api` |

## Step 5: Monitoring

### 5.1 Analytics
- Vercel provides built-in analytics
- Monitor page views, performance, and errors

### 5.2 Logs
- Check function logs in Vercel dashboard
- Monitor API response times and errors

## Alternative: Railway Deployment

If you prefer Railway:

1. **Sign up** at [railway.app](https://railway.app)
2. **Connect** your GitHub repository
3. **Configure** environment variables
4. **Deploy** - Railway will automatically detect Vite

Railway is good for full-stack applications, but Vercel is optimized for frontend deployments.

## Support

If you encounter issues:
1. Check Vercel's documentation
2. Review build logs
3. Test locally with production environment variables
4. Verify backend connectivity

---

**Note**: Make sure your backend is deployed and accessible before deploying the frontend. The frontend will not work without a functioning backend API. 