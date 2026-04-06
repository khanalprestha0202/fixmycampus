# FixMyCampus - Campus Maintenance Reporting Platform

A full-stack web application for reporting and tracking campus maintenance issues.

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

### Setup

1. Clone the repository:
\`\`\`
git clone https://github.com/khanalprestha0202/fixmycampus.git
cd fixmycampus
\`\`\`

2. Install server dependencies:
\`\`\`
cd server
npm install
\`\`\`

3. Install client dependencies:
\`\`\`
cd ../client
npm install
\`\`\`

4. Create server/.env file:
\`\`\`
PORT=5000
MONGO_URI=mongodb://localhost:27017/fixmycampus
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
\`\`\`

5. Start MongoDB service:
\`\`\`
net start MongoDB
\`\`\`

6. Start the server:
\`\`\`
cd server
node index.js
\`\`\`

7. Start the client:
\`\`\`
cd client
npm run dev
\`\`\`

8. Open http://localhost:5173

## Default Admin Account
- Email: admin@gmail.com
- Password: admin123

## API Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/reports | Get all reports | Yes |
| POST | /api/reports | Create report | Yes |
| GET | /api/reports/:id | Get report | Yes |
| PUT | /api/reports/:id | Update report | Yes |
| DELETE | /api/reports/:id | Delete report | Admin |
| GET | /api/reports/stats/analytics | Get analytics | Yes |
| GET | /api/guidance | Get guidance | Yes |

## Security
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