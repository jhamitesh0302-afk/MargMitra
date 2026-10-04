# MargMitra (मार्ग मित्र)

**MargMitra** is a shared logistics and route coordination platform tailored for rural entrepreneurs, farmers, local producers, and small vehicle operators. 

It connects producers needing to transport farm produce, handicrafts, and goods to regional markets with transporters and vehicle owners who have spare vehicle payload capacity, minimizing empty return trips ("खाली वापसी बंद") and cutting transport costs by up to 40%.

---

## Key Features

- **Cargo Pooling & Shared Transportation**: Rural entrepreneurs list goods (produce, grains, dairy, handicrafts) with pickup/drop locations, date, and weight.
- **Transporter Route Scheduling**: Local vehicle owners (tractor-trolleys, pickup trucks, tempos, mini-trucks) publish planned trips and available payload capacity.
- **Smart Load Matching**: Automated route and capacity matching algorithm connecting cargo requests with passing vehicles.
- **Interactive Route Maps**: Route and pickup/drop waypoint visualization using Leaflet and OpenStreetMap.
- **Role-Based Portals**: Dedicated, easy-to-use workflows for Rural Entrepreneurs and Transporters.
- **Transparent Status Tracking**: Real-time shipment status from request to delivery with verification codes.

---

## Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide React, Leaflet, React-Leaflet
- **Backend**: Node.js, Express 5, Helmet, CORS, Morgan
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Tooling**: Concurrently, Nodemon

---

## Project Structure

```text
MargMitra/
├── client/                     # React + Vite frontend application
│   ├── public/                 # Static assets and icons
│   └── src/
│       ├── assets/             # Images and styles
│       ├── components/         # Reusable UI, Layout, and Leaflet Map components
│       ├── context/            # AuthContext and state management
│       ├── pages/              # Landing, Auth, and Role Dashboards
│       └── App.jsx             # Client routes and navigation
├── server/                     # Express.js REST API backend
│   ├── prisma/
│   │   └── schema.prisma       # Prisma relational schema for PostgreSQL
│   └── src/
│       ├── config/             # DB & JWT configurations
│       ├── controllers/        # Route controllers (Auth, Trips, Shipments, Bookings)
│       ├── middleware/         # Auth verification and error handling
│       ├── routes/             # Express API routes
│       ├── services/           # Matching algorithm & distance calculations
│       └── server.js           # Server entry point
├── package.json                # Root orchestration scripts
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on v26)
- **PostgreSQL**: PostgreSQL service running locally or in cloud

### 2. Installation
Install dependencies across root, client, and server:
```bash
npm run install:all
```
Or manually:
```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 3. Environment Setup
Configure the server environment:
```bash
cd server
cp .env.example .env
```
Update `.env` with your PostgreSQL database URL and JWT secret:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/margmitra?schema=public"
JWT_SECRET="your_jwt_secret_key_here"
```

### 4. Database Setup (Prisma)
Once PostgreSQL credentials are configured in `server/.env`:
```bash
cd server
npx prisma db push
```

### 5. Running the Application
To run both backend and frontend concurrently from the root directory:
```bash
npm run dev
```

Alternatively, run each service individually:
- **Frontend only**: `npm run client` (Runs Vite on `http://localhost:5173`)
- **Backend only**: `npm run server` (Runs Express on `http://localhost:5000`)
