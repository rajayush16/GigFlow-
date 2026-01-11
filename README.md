# GigFlow

GigFlow is a mini freelance marketplace where clients post gigs and freelancers place bids. Clients can review bids and hire one freelancer with transactional safety, while hired freelancers receive realtime notifications.

## Tech Stack

- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT with HttpOnly cookies
- Realtime: Socket.io

## Core Features

- Authentication with register/login/logout and session restore
- Gig feed with search by title
- Post new gigs (title, description, budget)
- Bid on gigs (message, price)
- Owner-only bid review
- Hire flow with atomic transaction:
  - Gig status changes to assigned
  - Selected bid becomes hired
  - All other bids are rejected
- Realtime hire notification via Socket.io

## Project Structure

```
.
├── src/                 # Frontend React app
├── public/
├── server/              # Express API + Socket.io
│   ├── models/          # Mongoose models
│   ├── routes/          # Auth, gigs, bids
│   ├── realtime/        # Socket helpers
│   └── lib/             # Auth + DB helpers
└── README.md
```

## Environment Variables

Create the following files:

Frontend `.env`:
```
VITE_API_BASE=http://localhost:4000
```

Backend `server/.env`:
```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/gigflow
JWT_SECRET=replace_me
CLIENT_ORIGIN=http://localhost:5173
COOKIE_NAME=gigflow_token
COOKIE_SECURE=false
```

## Run Locally

1) Install and run MongoDB.
2) Start the backend:
```
cd server
npm install
npm run dev
```
3) Start the frontend:
```
cd ..
npm install
npm run dev
```
4) Open `http://localhost:5173`.

## Transaction Safety (Bonus)

Hiring uses MongoDB transactions to prevent race conditions. For local use, run MongoDB as a replica set:
```
mongod --replSet rs0 --dbpath "C:\data\db"
mongosh --eval "rs.initiate()"
```

## Deployment Notes

- Frontend: Vercel (set `VITE_API_BASE` to the API URL)
- Backend: Render/Railway/Fly (set `CLIENT_ORIGIN` to the Vercel URL, `COOKIE_SECURE=true`)
- MongoDB Atlas recommended for production
