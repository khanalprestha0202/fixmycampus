# FixMyCampus - Campus Maintenance Reporting Platform

## CPS7005 – Web Application Development
### Student: Prestha Khanal

## About
This is my submission for the CPS7005 Web Application Development module. 
I built a campus maintenance reporting system called FixMyCampus, which 
allows students and staff to report issues around campus, track their 
status, and view analytics.

## Technologies Used
- React 19 + Vite (frontend)
- Node.js + Express (backend)
- MongoDB + Mongoose (database)
- Tailwind CSS (styling)
- JWT + BCrypt (authentication)
- Nodemailer (email notifications)
- Recharts (analytics charts)
- React Leaflet + OpenStreetMap (interactive map)
- jsPDF + PapaParse (PDF/CSV export)

## Features
- User registration and login
- Submit maintenance reports with category, location and description
- View and filter all reports by status, category or location
- Admin dashboard to manage and update report statuses
- Analytics page showing issue trends and common categories
- Interactive map to pin issue locations on campus
- Email notifications when report status changes
- Export reports as PDF or CSV
- Responsive design for mobile and desktop

## How to Run

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### Setup
1. Clone the repository
2. Install dependencies:
   - Root: `npm install`
   - Client: `cd client && npm install`
   - Server: `cd server && npm install`
3. Create a `.env` file in the server folder using `.env.example` as a guide
4. Run the app: `npm run dev` from the root folder
5. Frontend runs on http://localhost:5173
6. Backend runs on http://localhost:5000

## Default Admin Login
Email: admin@gmail.com  
Password: admin123