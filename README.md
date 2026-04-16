# FixMyCampus - Campus Maintenance Reporting Platform

## CPS7005 – Web Application Development
### Student: Prestha Khanal

## About
FixMyCampus is a campus maintenance reporting system where students and staff can report issues around campus, track their status, and admins can manage and resolve them. Built as a full-stack web application with React and Node.js.

## Technologies Used
- React 19 + Vite (frontend)
- Node.js + Express (backend)
- MongoDB + Mongoose (database)
- JWT + BCrypt (authentication)
- Nodemailer + Ethereal (email notifications)
- Recharts (analytics charts)
- OpenStreetMap (building location map)
- CSV export

## Features
- User registration and login with JWT authentication
- Submit maintenance reports with title, category, building, priority and description
- View and filter reports by status, category and priority
- Admin-only delete button for managing reports
- Report detail page with status updates and comments
- Analytics page with trend charts (4 Days / 2 Weeks / 1 Month)
- Notification bell with overdue and deadline warnings (7d / 14d / 30d)
- Building location map using OpenStreetMap
- Export reports as CSV
- Responsive design

## Before You Start - Install These First

1. Install Node.js: https://nodejs.org (click LTS version)
2. Install MongoDB Community Server: https://www.mongodb.com/try/download/community (click current version, follow installer, keep all default settings)

## How to Run

### Step 1 - Open the project folder
Extract the zip file and open the fixmycampus folder in terminal

### Step 2 - Install server dependencies
cd server
npm install

### Step 3 - Install client dependencies
cd ../client
npm install

### Step 4 - Start the backend
Open a terminal inside the server folder and run:
cd server
node index.js

You should see:
Server running on port 5000
MongoDB connected successfully

If you see MongoDB connected successfully the database is working correctly.

### Step 5 - Start the frontend
Open a SECOND terminal inside the client folder and run:
cd client
npm run dev

Then open your browser and go to:
http://localhost:5173

### Step 6 - Create an account
Go to http://localhost:5173/register and register a new account then log in.

## Admin Login
To test admin features such as deleting reports and updating statuses, log in with:
Email: admin@gmail.com
Password: admin123

If this account does not exist, register with these exact details.
Then open MongoDB Compass (installed with MongoDB), connect to localhost:27017,
open the fixmycampus database, open the users collection,
find the admin@gmail.com document and change the role field from "user" to "admin".
Then log in again.

## Important Notes
- You need TWO terminals open at the same time - one for server, one for client
- MongoDB must be running before you start the server
- The app runs on http://localhost:5173

## Project Structure
fixmycampus/
├── client/src/
│   ├── components/    Navbar, Notifications, LocationMap
│   ├── context/       AuthContext
│   └── pages/         Dashboard, Reports, Analytics, Guidance, Profile
└── server/
    ├── controllers/   reportController.js
    ├── models/        Report.js, User.js
    ├── routes/        auth.js, reports.js, guidance.js
    └── utils/         emailService.js, mailer.js

## GitHub
https://github.com/khanalprestha0202/fixmycampus