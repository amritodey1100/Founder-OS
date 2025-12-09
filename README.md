# Founder OS - Cloud-Synced Content Pipeline

A React-based content management dashboard with Firebase Authentication and MongoDB cloud storage. Access your content pipeline across all devices!

## 🚀 Features

- ✅ **Google Sign-In** - One-click authentication
- ☁️ **Cloud Sync** - Access data from any device
- 🔄 **Auto Migration** - Automatically migrates localStorage data on first login
- 🎨 **Terminal Aesthetic** - Dark theme with modern design
- 📝 **Markdown Support** - Rich text descriptions
- 🔍 **Search & Filter** - Quick access to your content

## 🏗️ Tech Stack

### Frontend

- React 19 + Vite
- Firebase Authentication (Google Sign-In)
- Axios for API calls
- Tailwind CSS 4

### Backend

- Node.js + Express
- MongoDB (Atlas or local)
- Firebase Admin SDK for auth verification

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB (Atlas account or local install)
- Firebase project with Google Auth enabled

## ⚙️ Setup Instructions

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies (already done)
npm install

# Start the backend server
npm start
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies (already done)
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 First Time Login

1. Open `http://localhost:5173` in your browser
2. Click **"Sign in with Google"**
3. Choose your Google account
4. If you have existing localStorage data, you'll see a **Migration Modal**
5. Click "Migrate to Cloud" to transfer your data
6. Your data is now synced across all devices!

## 💾 Data Migration

- **Automatic Detection**: The app automatically detects localStorage data on first login
- **One-Time Process**: Migration only happens once
- **Safe**: Your localStorage data remains as backup
- **Preview**: See how many columns and items will be migrated

## 🌐 Cross-Device Usage

1. Sign in with the same Google account on any device
2. Your columns and items sync automatically
3. Changes made on one device appear instantly on others
4. No manual sync needed!

## 📱 Accessing on Mobile

Since you have Capacitor already set up:

```bash
# Sync with Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

## 🔧 Configuration Files

All configuration is already set up:

- ✅ Firebase config: `src/config/firebase.js`
- ✅ MongoDB connection: `server/.env`
- ✅ Service account: `serviceAccountKey.json`

## 🐛 Troubleshooting

### Backend won't start

```bash
cd server
npm start
```

Check that MongoDB connection string is correct in `server/.env`

### Frontend can't connect to backend

- Ensure backend is running on port 5000
- Check CORS settings in `server/server.js`

### Authentication fails

- Verify Google Auth is enabled in Firebase Console
- Check Firebase config in `src/config/firebase.js`

## 📝 API Endpoints

- `GET /api/columns` - Fetch user's columns
- `PUT /api/columns` - Update all columns
- `POST /api/columns/migrate` - Migrate from localStorage

## 🛡️ Security

- Firebase handles all authentication
- Backend verifies ID tokens with Firebase Admin SDK
- MongoDB stores data per user (firebaseUid)
- CORS configured for Vite dev server

## 📄 License

MIT

---

**Enjoy your cloud-synced content pipeline! 🎉**
