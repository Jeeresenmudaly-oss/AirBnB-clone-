const express = require('express');
const { body } = require('express-validator');
const {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
  uploadImages,
} = require('../controllers/accommodationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Validation rules used when creating a listing
const createValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('type').trim().notEmpty().withMessage('Type is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('guests').isInt({ min: 1 }).withMessage('Guests must be at least 1'),
];

// /api/accommodations
router
  .route('/')
  .get(getAccommodations) // public
  .post(protect, authorize('host', 'admin'), createValidation, createAccommodation);

// POST /api/accommodations/upload (multipart form-data, field name: "images")
router.post(
  '/upload',
  protect,
  authorize('host', 'admin'),
  upload.array('images', 10),
  uploadImages,
);

// /api/accommodations/:id
router
  .route('/:id')
  .get(getAccommodationById) // public
  .put(protect, authorize('host', 'admin'), updateAccommodation)
  .delete(protect, authorize('host', 'admin'), deleteAccommodation);

module.exports = router;
