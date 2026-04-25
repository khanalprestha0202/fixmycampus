# FixMyCampus - Campus Maintenance Reporting Platform

## CPS7005 - Web Application Development
### Student: Prestha Khanal

---

## About

FixMyCampus is a campus maintenance reporting system for St Mary's University. Students and staff can report maintenance issues, track their status, and admins can manage and resolve them.

---

## Technologies Used

**Frontend**
- React 19 + Vite — UI framework and build tool
- React Router v7 — client-side routing
- Axios — HTTP requests to the backend
- Recharts — analytics charts and data visualisation
- Custom CSS — responsive styling without frameworks

**Backend**
- Node.js + Express.js — server and REST API
- MongoDB + Mongoose — database and schema modelling
- JWT + BCrypt — authentication and password hashing
- Nodemailer — email notifications on status changes
- Helmet.js — HTTP security headers
- Express Rate Limiter — API request limiting

**External API**
- OpenStreetMap — interactive building location maps

**Dev Tools**
- Git + GitHub — version control with feature branches
- Jest + Supertest — backend testing
- Vite — frontend development server and bundler

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

**Step 3 - Create the .env file inside the server folder**

Create a file called `.env` inside the `server` folder with these contents:

    PORT=5000
    MONGO_URI=mongodb://localhost:27017/fixmycampus
    JWT_SECRET=fixmycampus_secret_key_2024
    CLIENT_URL=http://localhost:5173
    EMAIL_HOST=smtp.ethereal.email
    EMAIL_PORT=587
    EMAIL_USER=xngghrn6esflsabn@ethereal.email
    EMAIL_PASS=bFPcdE21CupKpr38eF

> **Note for assessor:** The MONGO_URI above uses a local MongoDB installation.
> If you prefer to use MongoDB Atlas (cloud, no installation needed):
> 1. Create a free cluster at https://cloud.mongodb.com
> 2. Replace MONGO_URI with your Atlas connection string:
>    `mongodb+srv://username:password@cluster.mongodb.net/fixmycampus`

**Step 4 - Start backend (Terminal 1)**

    cd server
    node index.js

You should see: Server running on port 5000 and MongoDB connected successfully

**Step 5 - Start frontend (Terminal 2)**

    cd client
    npm run dev

**Step 6 - Open browser**

    http://localhost:5173

**Step 7 - Register an account at http://localhost:5173/register**

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