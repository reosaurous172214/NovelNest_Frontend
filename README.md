# 📚 NovelNest – Frontend

> A modern, full-stack novel reading platform where users can discover, read, track, and analyze their reading habits — built with React.

NovelNest is designed to deliver a smooth, fast, and distraction-free reading experience with analytics and interactive features.  
This repository contains the **React frontend client** that connects to a **Node.js + Express + MongoDB (Atlas)** backend.

---

## ✨ Live Features

🎬 **Live Demo:** [NovelNest](https://novel-nest-frontend-yg2s.vercel.app/)

### 📖 Reading Experience
- Browse and explore novels
- Category & tag filtering
- Search functionality
- Clean reading interface
- Reading progress tracking
- Bookmark chapters
- Personal library

### 👤 User System
- Signup / Login authentication
- Secure sessions
- Personalized dashboard
- Saved history

### 📊 Analytics Dashboard
- Reading activity insights
- Usage tracking
- Personalized statistics
- Visual analytics

### 💬 Interaction
- Comments system
- (Planned) Community discussions
- (Planned) Real-time chat

---

## 🛠 Tech Stack

### Frontend
- React
- React Router
- Axios
- Context API (state management)
- CSS / modern responsive UI
- Create React App build system

### Backend (separate repo)
- Node.js
- Express
- MongoDB Atlas
- REST APIs

---

## 📂 Project Structure

```
src/
 ┣ components/      Reusable UI components
 ┣ pages/           Screens / routes
 ┣ context/         Global state management
 ┣ hooks/           Custom hooks
 ┣ api/             API requests
 ┣ ui/              Helper functions
 ┣ assets/          Images & static files
 ┣ App.js
 ┗ index.js
```

---

## ⚙️ Getting Started

### 1️⃣ Clone
```bash
git clone https://github.com/SaurabhSharma1369/NovelNest_Frontend.git
cd novelnest-frontend
```

### 2️⃣ Install
```bash
npm install
```

### 3️⃣ Environment Variables

Create `.env` in root:

```
REACT_APP_API_URL=http://localhost:5000
```

(Change to your backend URL if different)

---

## ▶️ Run Development Server

```bash
npm start
```

Open:
```
http://localhost:3000
```

Hot reload enabled for instant updates.

---

## 🏗 Production Build

```bash
npm run build
```

Optimized static files will be generated inside:

```
/build
```

Ready for deployment.

---

## 🚀 Deployment

Works perfectly with:

- Vercel
- Netlify
- Firebase
- Render
- Any static hosting

After deployment, update:

```
REACT_APP_API_URL=<production-backend-url>
```

---



## 🛣 Roadmap

- ✅ Core reading system
- ✅ Dashboard analytics
- ✅ Authentication
- ✅ Recommendation engine (ML based)
- ✅ Notifications
- ✅ Multiple Themes
- ⏳ Real-time chat
- ⏳ PWA support

---



## 👨‍💻 Author

**Saurabh Sharma**  
Full Stack Developer  

Tech Interests:
- React
- Node.js
- MongoDB
- Blockchain
- Machine Learning
- Recommendation Systems

---

## 💡 Why NovelNest?

NovelNest was built to combine:
- 📚 Reading
- 📊 Analytics
- ⚡ Performance
- 🧠 Smart recommendations (upcoming)

All in one modern platform.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐  
It helps a lot and motivates further development.
