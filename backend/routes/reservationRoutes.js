const express = require('express');
const {
  createReservation,
  getUserReservations,
  getHostReservations,
  deleteReservation,
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All reservation routes require the user to be
router.use(protect);

// POST /api/reservations
router.post('/', createReservation);

// GET /api/reservations/user -> bookings made by the logged-in
router.get('/user', getUserReservations);

// GET /api/reservations/host -> bookings on the logged-in host's
router.get('/host', authorize('host', 'admin'), getHostReservations);

// DELETE /api/reservations/:id
router.delete('/:id', deleteReservation);

module.exports = router;
