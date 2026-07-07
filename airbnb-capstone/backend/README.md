# Airbnb Clone — Backend API

Backend for an Airbnb clone, built with **Node.js, Express and MongoDB (Mongoose)**.
It handles accommodation listings, reservations, and JWT‑based authentication.
All data lives in a real MongoDB database and is manipulated through the API —
there is no fake/JSON data.

---

## Tech stack

| Purpose | Library |
| ------------------ | ------------------ |
| Server / API | Express |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) |
| Password hashing | bcryptjs |
| Validation | express-validator |
| Image uploads | Multer |
| Cross‑origin (CORS)| cors |
| Request logging | morgan |

---

## Project structure

```
airbnb-backend/
├── config/
│ └── db.js # MongoDB connection
├── controllers/
│ ├── accommodationController.js
│ ├── reservationController.js
│ └── userController.js
├── middleware/
│ ├── auth.js # protect (JWT) + authorize (roles)
│ ├── errorHandler.js # 404 + central error handler
│ └── upload.js # Multer image upload
├── models/
│ ├── Accommodation.js
│ ├── Reservation.js
│ └── User.js
├── routes/
│ ├── accommodationRoutes.js
│ ├── reservationRoutes.js
│ └── userRoutes.js
├── utils/
│ ├── asyncHandler.js # wraps async controllers
│ └── generateToken.js # signs JWTs
├── scripts/
│ └── seed.js # fills the DB with sample data
├── uploads/ # uploaded images are stored here
├── server.js # app entry point
├── Procfile # Heroku start command
├── .env.example # copy to .env and fill in
└── package.json
```

---

## Prerequisites

- **Node.js 18+** (LTS recommended) and npm
- A **MongoDB database** — either local or a free MongoDB Atlas cluster (see below)

---

## 1. Set up MongoDB

You need a running MongoDB and a connection string (`MONGO_URI`). Pick **one** option.

### Option A — MongoDB Atlas (free, cloud, required for Heroku)

Use this if you plan to deploy to Heroku, since Heroku has no database of its own.

1. Go to <https://www.mongodb.com/cloud/atlas/register> and create a free account.
2. Create a new **free (M0) cluster** (any provider/region is fine).
3. **Database Access** → *Add New Database User* → choose *Password* auth,
 set a username and password, give it "Read and write to any database". Save it.
4. **Network Access** → *Add IP Address* → for development you can click
 *Allow access from anywhere* (`0.0.0.0/0`). For Heroku this is required.
5. Back on the cluster, click **Connect → Drivers**, copy the connection string.
 It looks like:
 ```
 mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
 ```
6. Replace `<username>` and `<password>` with the user you created, and add a
 database name (`airbnb_clone`) before the `?`:
 ```
 mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/airbnb_clone?retryWrites=true&w=majority
 ```
 That final string is your `MONGO_URI`.

### Option B — Local MongoDB

Use this for offline development.

1. Install MongoDB Community Server: <https://www.mongodb.com/try/download/community>
2. Start it (the installer usually runs it as a service). Your `MONGO_URI` is:
 ```
 mongodb://127.0.0.1:27017/airbnb_clone
 ```
3. (Optional) Install **MongoDB Compass** to view your data with a GUI.

---

## 2. Install & configure

```bash
# from inside the airbnb-backend folder
npm install

# create your environment file and open it in an editor
cp .env.example .env
```

Now edit `.env` and set at least `MONGO_URI` and `JWT_SECRET`:

```env
PORT=5000
MONGO_URI=your-connection-string-from-step-1
JWT_SECRET=some-long-random-string
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:3000,http://localhost:3001
```

> **Tip for `JWT_SECRET`:** run `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` to generate a strong one.

---

## 3. Seed sample data (optional but recommended)

This inserts sample users and listings so you have something to test against:

```bash
npm run seed
```

It creates these logins:

| Email | Password | Role |
| ------------------- | ------------- | ----- |
| admin@airbnb.com | password123 | admin |
| jane@airbnb.com | password321 | host |
| john@airbnb.com | password123 | user |

---

## 4. Run the server

```bash
npm run dev # development, auto-restarts on changes (nodemon)
# or
npm start # production style
```

You should see:

```
 MongoDB connected: ...
 Server running in development mode on port 5000
```

Visit <http://localhost:5000> — you should get `{ "message": "Airbnb Clone API is running " }`.

---

## API reference

Base URL (local): `http://localhost:5000`

All protected routes require an `Authorization` header:

```
Authorization: Bearer <token>
```

The token is returned by `/api/users/login` and `/api/users/register`.

### Users

| Method | Endpoint | Access | Body |
| ------ | --------------------- | ------- | -------------------------------------- |
| POST | `/api/users/register` | Public | `username, email, password, role?` |
| POST | `/api/users/login` | Public | `email, password` |
| GET | `/api/users/me` | Private | — |

### Accommodations

| Method | Endpoint | Access | Notes |
| ------ | ---------------------------- | ------------- | ---------------------------------- |
| GET | `/api/accommodations` | Public | `?location=New York` to filter |
| GET | `/api/accommodations/:id` | Public | Single listing |
| POST | `/api/accommodations` | host / admin | Create a listing |
| PUT | `/api/accommodations/:id` | owner / admin | Update a listing |
| DELETE | `/api/accommodations/:id` | owner / admin | Delete a listing |
| POST | `/api/accommodations/upload` | host / admin | multipart form‑data, field `images`|

### Reservations

| Method | Endpoint | Access | Body |
| ------ | -------------------------- | ---------------------- | --------------------------------------------- |
| POST | `/api/reservations` | Private | `accommodationId, checkIn, checkOut, guests` |
| GET | `/api/reservations/user` | Private | reservations you made |
| GET | `/api/reservations/host` | host / admin | reservations on your listings |
| DELETE | `/api/reservations/:id` | owner / host / admin | cancel a reservation |

> Reservation prices (subtotal, weekly discount, fees, taxes, total) are all
> calculated **on the server** from the real listing, so they can't be faked
> from the frontend.

---

## Deploying to Heroku

> Note: Heroku's free tier was retired, so you'll need a paid **Eco** or
> **Basic** dyno. (Render.com and Railway.app are free alternatives that work
> the same way if your brief allows them.)

1. Install the Heroku CLI and log in:
 ```bash
 heroku login
 ```
2. From the project folder, create the app and commit your code:
 ```bash
 git init
 git add .
 git commit -m "Backend API"
 heroku create your-app-name
 ```
3. Set your environment variables on Heroku (use your **Atlas** URI here):
 ```bash
 heroku config:set MONGO_URI="mongodb+srv://user:pass@cluster.../airbnb_clone?retryWrites=true&w=majority"
 heroku config:set JWT_SECRET="your-long-random-secret"
 heroku config:set JWT_EXPIRES_IN="30d"
 heroku config:set NODE_ENV="production"
 heroku config:set CLIENT_URL="https://your-frontend.herokuapp.com,https://your-admin.herokuapp.com"
 ```
4. Deploy:
 ```bash
 git push heroku main
 ```
5. (Optional) Seed the production database:
 ```bash
 heroku run npm run seed
 ```
6. Open it:
 ```bash
 heroku open
 ```

---

## A note on image uploads and Heroku

Multer saves uploaded images to the `uploads/` folder on disk. That works
perfectly in local development, but **Heroku's filesystem is ephemeral** —
uploaded files are wiped whenever the dyno restarts. For a production demo you
have two options:

1. Store image **URLs** on the listing (paste links) — simplest, works everywhere.
2. Upload to a service like **Cloudinary** and store the returned URL — the
 proper production approach. I can add Cloudinary integration when we build
 the admin dashboard if you'd like.

---

## Testing the API

An `api-tests.http` file is included. Open it in VS Code with the free
**REST Client** extension and click "Send Request" above any request, or import
the same requests into Postman.
