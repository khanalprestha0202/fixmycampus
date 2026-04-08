# FixMyCampus - Campus Maintenance Reporting Platform

A full-stack web application for reporting and tracking campus maintenance issues.

## 🚀 Quick Start (Development)

```bash
git clone https://github.com/khanalprestha0202/fixmycampus.git
cd fixmycampus
npm install:all
npm run dev
```

## Features
- Submit and track maintenance reports
- Real-time status updates with email notifications
- Analytics dashboard with charts
- Role-based access (Admin/User)
- OpenStreetMap building location viewer
- PDF and CSV export
- JWT authentication with BCrypt password hashing
- Rate limiting and security headers

## Tech Stack
- **Frontend:** React, React Router, Recharts, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Security:** JWT, BCrypt, Helmet.js, express-rate-limit
- **External API:** OpenStreetMap

## Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Complete Setup
1. `npm run install:all`
2. Copy `.env.example` to `server/.env` and configure
3. `npm run dev`

Or manually:
1. `cd server && npm install`
2. `cd ../client && npm install`
3. Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/fixmycampus
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```
4. Start MongoDB: `net start MongoDB`
5. `npm run dev`

Open http://localhost:5173

## Default Admin Account
- Email: `admin@gmail.com`
- Password: `admin123`

## 🧪 Testing
```bash
npm test
# Runs server Jest tests
```

## 🚀 Production Deployment

1. **Build Client:** `cd client && npm run build`
2. **Backend:** Deploy to Railway/Render/Heroku (set env vars)
3. **Database:** MongoDB Atlas
4. **Frontend:** Static hosting (Vercel/Netlify)

**Recommended:** Use Railway for full-stack (one-click MongoDB + Node)

## API Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/reports` | Get all reports | Yes |
| POST | `/api/reports` | Create report | Yes |
| GET | `/api/reports/:id` | Get report | Yes |
| PUT | `/api/reports/:id` | Update report | Yes |
| DELETE | `/api/reports/:id` | Delete report | Admin |
| GET | `/api/reports/stats/analytics` | Get analytics | Yes |
| GET | `/api/guidance` | Get guidance | Yes |

## 🔒 Security
- JWT tokens expire after 7 days
- Passwords hashed with BCrypt (10 rounds)
- Rate limiting: 100 requests/15min general, 10 requests/15min for auth
- Helmet.js HTTP security headers
- CORS restricted to client URL
- Server-side input validation on all report submissions

## Ethics & Privacy
- User consent required before data submission
- Privacy notice displayed on registration and report forms
- GDPR-compliant data deletion request process
- Personal data never shared with third parties
- Secure password storage with BCrypt hashing

## 🤝 Contributing
1. Fork the repo
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Run tests (`npm test`)
5. Push to branch (`git push origin feature/AmazingFeature`)
6. Open Pull Request

## ❓ Troubleshooting
- **MongoDB connection failed:** Verify `MONGO_URI` and MongoDB service
- **CORS errors:** Check `CLIENT_URL` in `.env`
- **Email not sending:** Use Gmail App Password (not regular password)
- **Tests failing:** Ensure MongoDB is running for integration tests
- **Port conflicts:** Change `PORT` in `.env`

## License
ISC
