const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const Accommodation = require('../models/Accommodation');

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(
      errors
        .array()
        .map((e) => e.msg)
        .join(', '),
    );
  }
};

// Create a new accommodation listing
const createAccommodation = asyncHandler(async (req, res) => {
  checkValidation(req, res);

  const accommodation = await Accommodation.create({
    ...req.body,
    host: req.user._id, // the logged-in host owns the listing
  });

  res.status(201).json({ success: true, accommodation });
});

// Get all accommodation listings (optionally filtered by location)
const getAccommodations = asyncHandler(async (req, res) => {
  const filter = {};

  // Optional case-insensitive location filter for the Location Page
  if (req.query.location) {
    filter.location = { $regex: req.query.location, $options: 'i' };
  }

  const accommodations = await Accommodation.find(filter)
    .populate('host', 'username email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: accommodations.length,
    accommodations,
  });
});

// Get a single accommodation by id
const getAccommodationById = asyncHandler(async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id).populate(
    'host',
    'username email',
  );

  if (!accommodation) {
    res.status(404);
    throw new Error('Accommodation not found');
  }

  res.json({ success: true, accommodation });
});

// Update an accommodation listing
const updateAccommodation = asyncHandler(async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);

  if (!accommodation) {
    res.status(404);
    throw new Error('Accommodation not found');
  }

  // Only the host who owns it (or an
  if (accommodation.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this listing');
  }

  const updated = await Accommodation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, accommodation: updated });
});

// Delete an accommodation listing
const deleteAccommodation = asyncHandler(async (req, res) => {
  const accommodation = await Accommodation.findById(req.params.id);

  if (!accommodation) {
    res.status(404);
    throw new Error('Accommodation not found');
  }

  if (accommodation.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this listing');
  }

  await accommodation.deleteOne();

  res.json({ success: true, message: 'Accommodation removed', id: req.params.id });
});

// Upload one or more images and return their
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No image files were uploaded');
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const urls = req.files.map((file) => `${baseUrl}/uploads/${file.filename}`);

  res.status(201).json({ success: true, images: urls });
});

module.exports = {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
  uploadImages,
};
