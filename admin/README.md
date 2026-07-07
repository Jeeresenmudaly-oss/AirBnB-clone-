# Airbnb Clone — Admin Dashboard

A React admin dashboard for managing the Airbnb clone: log in, create / view /
update / delete listings, upload images, and view reservations. It talks to the
Node/Express/MongoDB backend over a real API — no fake data.

Built with **React + Vite**, plain **CSS**, **React Router**, **axios**, and
**JWT** auth (token stored in the browser and sent with every request).

---

## What it does (maps to the brief)

| Requirement | Where it lives |
| ------------------------------ | ----------------------------------------------- |
| Top header + profile dropdown | `src/components/Header.jsx` |
| Login with validation | `src/pages/LoginPage.jsx` |
| Create listing (+ image upload)| `src/pages/CreateListingPage.jsx` + `ListingForm`|
| View listings (edit / delete) | `src/pages/ViewListingsPage.jsx` |
| Update listing (pre-filled) | `src/pages/UpdateListingPage.jsx` |
| View reservations | `src/pages/ReservationsPage.jsx` |
| JWT auth + protected routes | `src/context/AuthContext.jsx`, `ProtectedRoute` |
| Routing / URLs per view | `src/App.jsx` (React Router) |

---

## Prerequisites

- Node.js 18+
- The **backend must be running** (locally on port 5000, or deployed). Start it
 first and seed it (`npm run seed`) so you have a login and some listings.

---

## Setup

```bash
npm install
cp .env.example .env # then set VITE_API_URL if your backend isn't on :5000
npm run dev
```

The app opens on <http://localhost:3001>.

Log in with a seeded account, e.g. **jane@airbnb.com / password321** (host) or
**admin@airbnb.com / password123** (admin).

> The dashboard is behind authentication — creating/deleting listings requires a
> `host` or `admin` account, which is what the seed script sets up.

---

## Environment variables

| Variable | Meaning | Example |
| -------------- | ------------------------------ | -------------------------------- |
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000` |

In production set it to your deployed backend, e.g. `https://your-backend.herokuapp.com`.

---

## Build

```bash
npm run build # outputs static files to dist/
npm run preview # preview the production build locally
```

---

## Deploying to Heroku

This is a static Single Page App served by the `serve` package.

1. Make sure `VITE_API_URL` points at your **deployed** backend. On Heroku, Vite
 reads it at build time, so set it as a config var **before** deploying:
 ```bash
 heroku create your-admin-app
 heroku config:set VITE_API_URL="https://your-backend.herokuapp.com"
 ```
2. Commit and push:
 ```bash
 git init && git add . && git commit -m "Admin dashboard"
 git push heroku main
 ```
 Heroku runs `heroku-postbuild` (which builds the app) and then `serve -s dist`
 (declared in the `Procfile`) to serve it.
3. `heroku open`.

> **Easier alternative:** Netlify or Vercel deploy Vite apps in a couple of
> clicks — set the build command to `npm run build`, the publish directory to
> `dist`, and add the `VITE_API_URL` environment variable. Use these if your
> brief allows anything other than Heroku.

---

## Notes

- The JWT is stored in `localStorage` and attached to every request by an axios
 interceptor (`src/api/axios.js`). If the token expires, the app clears it and
 redirects to the login page automatically.
- Image uploads go to the backend's `/api/accommodations/upload` route. Remember
 that uploaded files don't persist on Heroku's ephemeral filesystem — for a live
 demo, paste image URLs, or switch the backend to Cloudinary.
