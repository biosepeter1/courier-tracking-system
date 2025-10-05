# ✅ Pre-Deployment Checklist

## Before Pushing to Git

### 1. Environment Files
- [ ] Backend `.env.example` exists
- [ ] Frontend `.env.example` exists
- [ ] Actual `.env` files are in `.gitignore`
- [ ] No sensitive data in committed files

### 2. Dependencies
- [ ] Backend `package.json` has all dependencies
- [ ] Frontend `package.json` has all dependencies
- [ ] No `node_modules/` in git (check `.gitignore`)

### 3. Build Test
```bash
# Test backend
cd backend
npm install
npm start

# Test frontend
cd ../frontend
npm install
npm run build
```

- [ ] Backend starts without errors
- [ ] Frontend builds successfully
- [ ] No console errors in production build

### 4. Code Quality
- [ ] All import statements are correct
- [ ] No unused imports or variables
- [ ] Console.logs removed (except intentional)
- [ ] Error handling in place
- [ ] API endpoints are correct

### 5. Configuration Files
- [ ] `.gitignore` is complete
- [ ] `vercel.json` in frontend folder
- [ ] `DEPLOYMENT.md` is up to date
- [ ] `README.md` is complete

### 6. Security
- [ ] No hardcoded credentials
- [ ] JWT_SECRET is strong
- [ ] CORS is configured correctly
- [ ] Sensitive routes are protected

## MongoDB Atlas Setup

- [ ] Account created at mongodb.com/cloud/atlas
- [ ] Free cluster created
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0 for cloud deployment)
- [ ] Connection string copied
- [ ] Database name added to connection string

## Render Setup (Backend)

- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Environment variables ready:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRE`
  - [ ] `FRONTEND_URL`
  - [ ] `EMAIL_HOST`
  - [ ] `EMAIL_PORT`
  - [ ] `EMAIL_USER`
  - [ ] `EMAIL_PASSWORD`
  - [ ] `EMAIL_FROM`
  - [ ] `ADMIN_EMAIL`

## Vercel Setup (Frontend)

- [ ] Vercel account created
- [ ] GitHub repository ready
- [ ] Environment variables ready:
  - [ ] `VITE_API_URL`
  - [ ] `VITE_SOCKET_URL`

## Email Configuration

- [ ] Gmail account ready
- [ ] 2-Step Verification enabled
- [ ] App password generated
- [ ] SMTP settings configured

## Git Repository

```bash
# Initialize if needed
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for deployment"

# Add remote (create GitHub repo first)
git remote add origin YOUR_GITHUB_REPO_URL

# Push
git branch -M main
git push -u origin main
```

- [ ] GitHub repository created
- [ ] Repository is public or Render/Vercel has access
- [ ] All files pushed successfully
- [ ] `.env` files not in repository

## Final Verification

- [ ] All documentation reviewed
- [ ] Deployment instructions tested
- [ ] Contact information updated in:
  - [ ] README.md
  - [ ] Privacy Policy
  - [ ] Terms of Service
  - [ ] Footer components

## Post-Deployment Tests

After deployment:

- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] User registration works
- [ ] Email delivery works
- [ ] Login/logout works
- [ ] Create shipment works
- [ ] Track shipment works
- [ ] Admin dashboard accessible
- [ ] Update status works
- [ ] Email notifications sent
- [ ] Socket.io real-time updates work
- [ ] Mobile responsive on all pages
- [ ] Forms validate correctly
- [ ] Error messages display properly

## Troubleshooting Resources

- [ ] DEPLOYMENT.md has troubleshooting section
- [ ] Error logs accessible on Render
- [ ] Build logs accessible on Vercel
- [ ] MongoDB logs accessible on Atlas

## Performance Checks

- [ ] Images optimized
- [ ] Bundle size reasonable
- [ ] API response times acceptable
- [ ] Database queries optimized
- [ ] Socket.io connections stable

## Security Checks

- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] CORS properly configured
- [ ] No sensitive data in client-side code
- [ ] JWT tokens expire appropriately
- [ ] Password reset tokens expire
- [ ] Rate limiting in place (if implemented)

## Maintenance Plan

- [ ] Backup strategy for MongoDB
- [ ] Update schedule planned
- [ ] Monitoring setup (logs, errors)
- [ ] Contact information for support

---

## Quick Commands

### Test Everything Locally
```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm install && npm run dev

# Terminal 3 - MongoDB
mongod
```

### Build for Production
```bash
# Frontend build test
cd frontend && npm run build && npm run preview

# Backend production test
cd backend && NODE_ENV=production npm start
```

### Git Push Commands
```bash
# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

---

**Ready to Deploy!** 🚀

Once all items are checked, proceed with the deployment steps in [DEPLOYMENT.md](./DEPLOYMENT.md)
