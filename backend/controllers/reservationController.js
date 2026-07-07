const asyncHandler = require('../utils/asyncHandler');
const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');

// Calculate the number of nights between two dates
const nightsBetween = (checkIn, checkOut) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(checkOut) - new Date(checkIn)) / msPerDay);
};

// Create a reservation
const createReservation = asyncHandler(async (req, res) => {
  const { accommodationId, checkIn, checkOut, guests } = req.body;

  if (!accommodationId || !checkIn || !checkOut || !guests) {
    res.status(400);
    throw new Error('accommodationId, checkIn, checkOut and guests are required');
  }

  const accommodation = await Accommodation.findById(accommodationId);
  if (!accommodation) {
    res.status(404);
    throw new Error('Accommodation not found');
  }

  const nights = nightsBetween(checkIn, checkOut);
  if (nights <= 0) {
    res.status(400);
    throw new Error('Check-out date must be after the check-in date');
  }

  if (guests > accommodation.guests) {
    res.status(400);
    throw new Error(`This place allows a maximum of ${accommodation.guests} guests`);
  }

  // --- Price breakdown (mirrors the frontend cost calculator)
  const subtotal = accommodation.price * nights;
  const discountAmount = nights >= 7 ? (subtotal * (accommodation.weeklyDiscount || 0)) / 100 : 0;
  const total =
    subtotal -
    discountAmount +
    accommodation.cleaningFee +
    accommodation.serviceFee +
    accommodation.occupancyTaxes;

  const reservation = await Reservation.create({
    accommodation: accommodation._id,
    user: req.user._id,
    host: accommodation.host,
    checkIn,
    checkOut,
    guests,
    nights,
    pricePerNight: accommodation.price,
    weeklyDiscount: discountAmount,
    cleaningFee: accommodation.cleaningFee,
    serviceFee: accommodation.serviceFee,
    occupancyTaxes: accommodation.occupancyTaxes,
    total,
  });

  res.status(201).json({ success: true, reservation });
});

// Get all reservations for the logged-in user
const getUserReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id })
    .populate('accommodation', 'title location images price')
    .populate('host', 'username email')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: reservations.length, reservations });
});

// Get all reservations on the logged-in host's listings
const getHostReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ host: req.user._id })
    .populate('accommodation', 'title location images price')
    .populate('user', 'username email')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: reservations.length, reservations });
});

// Delete / cancel a reservation
const deleteReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    res.status(404);
    throw new Error('Reservation not found');
  }

  const userId = req.user._id.toString();
  const isOwner = reservation.user.toString() === userId;
  const isHost = reservation.host.toString() === userId;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isHost && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this reservation');
  }

  await reservation.deleteOne();

  res.json({ success: true, message: 'Reservation cancelled', id: req.params.id });
});

module.exports = {
  createReservation,
  getUserReservations,
  getHostReservations,
  deleteReservation,
};
