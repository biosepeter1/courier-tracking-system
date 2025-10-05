# 🚀 Quick Start Guide

## Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Gmail account for emails

## Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Step 2: Configure Environment

**Backend** - Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/courier-tracking
JWT_SECRET=your-secret-jwt-key-change-this
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@couriertrack.com
ADMIN_EMAIL=admin@example.com
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Step 3: Start MongoDB

```bash
# If using local MongoDB
mongod
```

## Step 4: Run Application

**Terminal 1** - Backend:
```bash
cd backend
npm run dev
```

**Terminal 2** - Frontend:
```bash
cd frontend
npm run dev
```

## Step 5: Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## Step 6: Create Admin Account

1. Register a user through the UI
2. Update MongoDB:
```bash
mongosh
use courier-tracking
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## 🎉 Done!

Your CourierTrack system is ready!

### Default Test Accounts
After setup, you can create test accounts through the registration page.

### Next Steps
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Read [README.md](./README.md) for full documentation
