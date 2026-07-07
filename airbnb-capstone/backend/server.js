require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route modules
const userRoutes = require('./routes/userRoutes');
const accommodationRoutes = require('./routes/accommodationRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

// --- Global middleware -------------------------------------------------------

// Allow the React apps to call the API
// comma-separated origins; if it isn't set we allow
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((o) => o.trim())
  : '*';
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json()); // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form bodies

// Request logging (only in development to keep production
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded images statically at /uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Routes ------------------------------------------------------------------

app.get('/', (req, res) => {
  res.json({ message: 'Airbnb Clone API is running ' });
});

app.use('/api/users', userRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/reservations', reservationRoutes);

// --- Error handling (must be last) ------------------------------------------

app.use(notFound);
app.use(errorHandler);

// --- Start the server --------------------------------------------------------
// Only connect + listen when this file is
// When it is imported by a test file

if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`),
  );
}

module.exports = app;
