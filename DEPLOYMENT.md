# 🚀 Vercel Deployment Guide

## What Changed
✅ Created `/api` folder with serverless functions:
- `api/stock.py` - Stock data endpoint
- `api/ask.py` - Chatbot endpoint  
- `api/requirements.txt` - Python dependencies

✅ Updated React to use `/api/*` endpoints instead of `localhost:5000`

✅ Created `vercel.json` - Vercel configuration

---

## 📋 Deploy in 3 Steps (Literally 1 Click)

### **Step 1: Add Environment Variables to Vercel** (1 minute)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (free)
3. No need to import yet - just make account

### **Step 2: Connect Your GitHub Repo** (1 minute)
1. Click "New Project"
2. Select your GitHub repo (the one you pushed)
3. Vercel auto-detects everything ✅

### **Step 3: Add Secrets & Deploy** (30 seconds)
Before deploying, add environment variables:
- Click "Environment Variables"
- Add: `GEMINI_API_KEY` = your key
- Add: `JWT_SECRET_KEY` = random string (e.g., `your-production-secret-123`)
- Click "Deploy" ✅

**DONE! Your app is live in ~2 minutes!**

---

## 🔗 What Your URLs Will Be

After deployment:
- **Frontend**: `https://yourstocklensproj.vercel.app` ← Your app!
- **Backend Stock API**: `https://yourstocklensproj.vercel.app/api/stock/AAPL`
- **Backend Chat**: `https://yourstocklensproj.vercel.app/api/ask`

---

## 📝 To Deploy Changes
Just git push - Vercel auto-deploys!
```bash
git add .
git commit -m "Ready for Vercel"
git push origin main
```

---

## 🆘 Troubleshooting

**"Import error flask"**
→ Vercel uses `api/requirements.txt` automatically

**"API not working"**
→ Check environment variables are set in Vercel dashboard

**"CORS errors"**
→ Already handled in serverless functions

---

## 💡 Next Steps (Optional)
- Add custom domain in Vercel
- Set up GitHub auto-deploy (already included)
- Enable Analytics in Vercel dashboard
