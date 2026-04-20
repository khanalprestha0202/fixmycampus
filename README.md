# FixMyCampus - Campus Maintenance Reporting Platform

## CPS7005 - Web Application Development
### Student: Prestha Khanal

---

## About

FixMyCampus is a campus maintenance reporting system for St Mary's University. Students and staff can report maintenance issues, track their status, and admins can manage and resolve them.

---

## Technologies Used

- React 19 + Vite, Node.js + Express, MongoDB + Mongoose
- JWT + BCrypt, Nodemailer, Recharts, OpenStreetMap

---

## Features

- User registration and login
- Submit, view and filter maintenance reports
- Admin delete and status management
- Analytics with trend charts
- Notification bell with deadline warnings
- Building location map, CSV and PDF export

---

## Install These First

1. Node.js: https://nodejs.org (LTS version)
2. MongoDB: https://www.mongodb.com/try/download/community (all default settings)

---

## How to Run

**Step 1 - Clone the project**

    git clone https://github.com/khanalprestha0202/fixmycampus.git
    cd fixmycampus

**Step 2 - Install dependencies**

    cd server && npm install
    cd ../client && npm install

**Step 3 - Start backend (Terminal 1)**

    cd server
    node index.js

You should see: Server running on port 5000 and MongoDB connected successfully

**Step 4 - Start frontend (Terminal 2)**

    cd client
    npm run dev

**Step 5 - Open browser**

    http://localhost:5173

**Step 6 - Register an account at http://localhost:5173/register**

---

## Mac Users Only

Port 5000 may be taken on Mac. Check with:

    lsof -i :5000

If ControlCenter appears, run these to switch to port 5001:

    sed -i '' 's/PORT=5000/PORT=5001/' server/.env
    sed -i '' "s|'http://localhost:5000'|'http://localhost:5001'|" client/vite.config.js

Also install MongoDB on Mac using:

    brew tap mongodb/brew
    brew install mongodb-community
    brew services start mongodb/brew/mongodb-community

---

## Admin Login

Register with these details then change role to admin in MongoDB Compass:

    Email: admin@gmail.com
    Password: admin123

---

## GitHub

https://github.com/khanalprestha0202/fixmycampus