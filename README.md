# FixMyCampus

FixMyCampus is a full-stack web application designed for campus maintenance and issue reporting. Students and staff can submit reports about campus issues (e.g., broken facilities, cleanliness problems), track them, view analytics, and receive guidance. Features include interactive maps for location pinning, PDF exports, email notifications, and admin dashboards.

## ✨ Features

- **User Authentication**: Secure login/register with JWT and bcrypt.
- **Report Management**: Create, view, update, and delete maintenance reports with images/locations.
- **Interactive Map**: Pin issues on campus map (LocationMap component).
- **Analytics Dashboard**: Visualize report trends using Recharts.
- **Guidance System**: AI-powered or rule-based maintenance guidance.
- **Notifications & Emails**: Real-time toast notifications and email alerts via Nodemailer.
- **PDF Export**: Download reports as PDFs.
- **Responsive UI**: Modern React interface with routing and context management.
- **Security**: Helmet, CORS, rate-limiting, MongoDB sanitization.

## 🛠️ Tech Stack

| Frontend | Backend | Database | Other |
|----------|---------|----------|-------|
| React 19 | Node.js / Express 5 | MongoDB | Vite, Axios, Recharts, Nodemailer, JWT |
| Vite | Mongoose | | react-hot-toast, react-router-dom |

## 🚀 Quick Start

### Prerequisites
- Node.js (18+)
- MongoDB (local or Atlas)
- `.env` file (see below)

### 1. Clone & Install
```bash
git clone <repo>
cd fixmycampus
```

### 2. Environment Setup
Create `.env` in root:
```
MONGO_URI=mongodb://localhost:27017/fixmycampus
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Install Dependencies
```bash
# Root (optional concurrent scripts)
npm install

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4. Run the App
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- Open http://localhost:5173 in browser.

## 📁 Project Structure
```
fixmycampus/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Navbar, LocationMap, PDFExport
│   │   ├── pages/       # Login, Dashboard, Reports, Analytics
│   │   └── context/     # AuthContext
│   └── public/
├── server/          # Express + MongoDB backend
│   ├── models/     # User, Report schemas
│   ├── routes/     # auth, reports, guidance
│   ├── utils/      # emailService
│   └── index.js
├── package.json
└── README.md
```

## 🧪 Testing
- Frontend: `cd client && npm run lint`
- Backend: Manual API tests with Postman (e.g., POST /api/auth/register)

## 🔧 Development
- Proxy configured: Frontend APIs proxy to backend.
- HMR enabled in Vite.
- ESLint for code quality.

## 📄 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET/POST | `/api/reports` | List/create reports |
| GET | `/api/guidance` | Maintenance guidance |

## 🤝 Contributing
1. Fork the repo.
2. Create feature branch.
3. Submit PR.

## 📄 License
ISC

## 🙏 Acknowledgments
Built with ❤️ for better campus living.

