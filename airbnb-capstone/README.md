# Airbnb Clone - Full Stack Capstone

An Airbnb clone built with the MERN stack, made up of three apps:

| App         | What it is                                             | Dev port |
| ----------- | ------------------------------------------------------ | -------- |
| `backend/`  | Node/Express/MongoDB API with JWT auth                 | 5000     |
| `frontend/` | Public site: Home, Location, Location Details, booking | 3000     |
| `admin/`    | Admin dashboard: manage listings and reservations      | 3001     |

Each app has its own README with full details. Start the backend first, then the
two React apps.

## Quick start

```bash
cd backend && npm install && cp .env.example .env   # set MONGO_URI + JWT_SECRET
npm run seed && npm run dev

cd ../frontend && npm install && cp .env.example .env && npm run dev
cd ../admin && npm install && cp .env.example .env && npm run dev
```

Seed logins: admin@airbnb.com / password123, jane@airbnb.com / password321 (host),
john@airbnb.com / password123 (guest).

See `CLAUDE.md` for architecture notes, conventions, and the remaining deployment steps.
