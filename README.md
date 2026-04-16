# FixMyCampus - Campus Maintenance Reporting Platform

## CPS7005 - Web Application Development
### Student: Prestha Khanal

---

## About

FixMyCampus is a campus maintenance reporting system where students and staff can report issues around campus, track their status, and admins can manage and resolve them. Built as a full-stack web application with React and Node.js.

---

## Technologies Used

- React 19 + Vite (frontend)
- Node.js + Express (backend)
- MongoDB + Mongoose (database)
- JWT + BCrypt (authentication)
- Nodemailer + Ethereal (email notifications)
- Recharts (analytics charts)
- OpenStreetMap (building location map)
- CSV and PDF export

---

## Features

- User registration and login with JWT authentication
- Submit maintenance reports with title, category, building, priority and description
- View and filter reports by status, category and priority
- Admin-only delete button for managing reports
- Report detail page with status updates, comments and PDF export
- Analytics page with trend charts (4 Days / 2 Weeks / 1 Month)
- Notification bell with overdue and deadline warnings (7d / 14d / 30d)
- Building location map using OpenStreetMap
- Export reports as CSV
- Privacy consent on registration and report submission
- Responsive design with footer on all pages

---

## Before You Start

Install these two things first:

1. Node.js: https://nodejs.org (download the LTS version)
2. MongoDB Community Server: https://www.mongodb.com/try/download/community (keep all default settings during install)

---

## How to Run

**Step 1 - Extract the zip and open a terminal in the fixmycampus folder**

**Step 2 - Install server dependencies**

    cd server
    npm install

**Step 3 - Install client dependencies**

    cd ../client
    npm install

**Step 4 - Start the backend (Terminal 1)**

    cd server
    node index.js

You should see: Server running on port 5000 and MongoDB connected successfully

**Step 5 - Start the frontend (Terminal 2)**

    cd client
    npm run dev

Open your browser at: http://localhost:5173

**Step 6 - Register an account**

Go to http://localhost:5173/register and create an account then log in.

---

## Admin Login

To test admin features such as deleting reports and updating statuses:

    Email: admin@gmail.com
    Password: admin123

If this account does not exist, register with these exact details. Then open MongoDB Compass, connect to localhost:27017, open the fixmycampus database, open the users collection, find the admin@gmail.com document and change the role field from "user" to "admin". Then log in again.

---

## Important Notes

- You need TWO terminals open at the same time - one for the server, one for the client
- MongoDB must be running before you start the server
- The app runs on http://localhost:5173

---

## Project Structure

    fixmycampus/
    client/src/
        components/    Navbar, Notifications, LocationMap, Footer
        context/       AuthContext
        pages/         Dashboard, Reports, Analytics, Guidance, Profile
    server/
        controllers/   reportController.js
        models/        Report.js, User.js
        routes/        auth.js, reports.js, guidance.js
        utils/         emailService.js, mailer.js

---

## GitHub

https://github.com/khanalprestha0202/fixmycampus