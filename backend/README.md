# Experiment 10 backend setup

## Requirements
- Node.js (LTS)
- MongoDB running locally, or a MongoDB Atlas database

## Start
1. Open Terminal in this `backend` folder.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and set `MONGODB_URI` to your MongoDB connection string.
4. Start the backend: `npm start`
5. Open `http://localhost:3000/exp10.html` in your browser.

Do not open `exp10.html` directly with `file://` and do not use the GitHub Pages URL for database operations. The frontend calls `/api/customers` on the Node.js server.

## Check connection
Open `http://localhost:3000/api/health`. The response should show `"server":"running"` and `"database":"connected"`.

The API provides `GET /api/customers` to fetch registrations and `POST /api/customers` to save a registration.
