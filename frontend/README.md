# Airbnb Clone - Frontend

The public-facing Airbnb clone: a Home page, a Location (search results) page,
and a Location Details page with a live cost calculator and reservations. Built
with React + Vite and plain CSS. All listings and reservations come from the
backend API and MongoDB.

## Views

- Home - hero with a search filter, city cards, experiences, gift cards, a
  hosting banner, and tabbed getaway inspiration. Static content, dynamic search.
- Location - reads a location from the URL, fetches matching stays from the API,
  and shows them as cards with rating, reviews and price.
- Location Details - image gallery, accommodation info, reviews with category
  ratings, host section, and a sticky cost calculator. Reserving creates a real
  record in MongoDB.
- Reservations - a table of the logged-in guest's bookings.

## Prerequisites

- Node.js 18+
- The backend running (locally on port 5000 or deployed) and seeded, so there
  are listings to browse and an account to log in with.

## Setup

```bash
npm install
cp .env.example .env      # set VITE_API_URL if the backend isn't on :5000
npm run dev
```

Opens on http://localhost:3000.

Log in from the profile menu with a seeded guest, e.g. john@airbnb.com /
password123, then reserve a stay from any details page.

## Environment variables

| Variable       | Meaning                     | Example                 |
| -------------- | --------------------------- | ----------------------- |
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000` |

## Build

```bash
npm run build      # outputs to dist/
npm run preview
```

## Deploying to Heroku

Set `VITE_API_URL` to your deployed backend before building (Vite inlines it at
build time):

```bash
heroku create your-frontend-app
heroku config:set VITE_API_URL="https://your-backend.herokuapp.com"
git init && git add . && git commit -m "Frontend"
git push heroku main
heroku open
```

Netlify or Vercel also work: build command `npm run build`, publish directory
`dist`, and add the `VITE_API_URL` environment variable.

## Notes

- The three apps share the same brand styling and axios/auth setup so the whole
  project feels consistent.
- The cost calculator mirrors the server's pricing, but the backend recalculates
  the authoritative total when a reservation is created.
