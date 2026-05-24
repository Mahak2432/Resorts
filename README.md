# Whispering Pines Resort — MERN Platform

Ultra-premium 5-star resort booking platform.

**Stack:** MongoDB · Express 4 · React 18 (Vite) · Node 20 · Tailwind CSS · Framer Motion.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  React (Vite) ── Tailwind ── Framer Motion ── Zustand        │
│      │                                                        │
│      │  axios → /api/*   (Vite proxy in dev)                  │
│      ▼                                                        │
│  Express 4 (Node 20)                                          │
│      │                                                        │
│      │  ▶ dataSource service                                  │
│      │     • if mongoose.connection.readyState === 1 → DB     │
│      │     • else                                  → dummyData│
│      ▼                                                        │
│  MongoDB ── Mongoose models (Room, Booking, User)             │
└──────────────────────────────────────────────────────────────┘
```

### The fallback rule (the headline feature)

Every controller calls `getDataSource()` from `services/dataSource.js`. That
service exposes the **same async interface** whether it's reading Mongo or the
in-memory array from `dummyData.js`, so controllers stay clean. The decision is
made per-request, so a recovering Mongo connection is picked up automatically.

```
controller
   └── const ds = getDataSource();
       └── ds.rooms.findAll()
            • Mongo:   Room.find().lean()
            • Memory:  dummyData.rooms (cloned)
```

---

## Layout

```
Resorts/
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js
│       ├── config/db.js          # mongoose connect (non-fatal)
│       ├── data/dummyData.js     # rich mock rooms / bookings / addOns / users
│       ├── models/               # Mongoose schemas
│       ├── services/dataSource.js   # ★ DB-or-Mock fallback
│       ├── middleware/auth.js
│       ├── controllers/
│       └── routes/
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx, App.jsx, index.css
        ├── api/client.js
        ├── store/{authStore,bookingStore}.js
        ├── components/
        │   ├── layout/{NavBar,StickyBookingWidget}.jsx
        │   ├── hero/ImmersiveHero.jsx
        │   ├── gallery/MasonryGallery.jsx
        │   └── booking/{BookingWizard,StepDates,StepRoom,StepAddOns,StepCheckout}.jsx
        └── pages/{HomePage,BookPage,LoginPage,RegisterPage,GuestDashboard,AdminDashboard}.jsx
```

---

## Run it

```bash
# 1. Backend (auto-falls back to dummy data if Mongo isn't reachable)
cd backend
cp .env.example .env       # optional — leave MONGO_URI empty to force dummy
npm install
npm run dev                # http://localhost:5000

# 2. Frontend
cd ../frontend
npm install
npm run dev                # http://localhost:5173 (proxies /api → :5000)
```

Health check shows the live data source:

```bash
curl http://localhost:5000/api/health
# → { "status": "ok", "dataSource": "MOCK" | "MONGO" }
```

## Production deploy (single host)

```bash
cd frontend && npm run build    # → frontend/dist
cd ../backend && npm start      # serves /api + the SPA from ../frontend/dist
```

The Express server statically hosts `../frontend/dist` and forwards all
non-`/api` paths to `index.html`, so the whole app deploys as one Node process
on Render / Railway / Fly.io.
