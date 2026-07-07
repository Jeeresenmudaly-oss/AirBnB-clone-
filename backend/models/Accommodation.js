const mongoose = require('mongoose');

// Accommodation (property listing) schema
const accommodationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      required: [true, 'Type is required'], // e.g. "Entire apartment"
      trim: true,
    },
    guests: {
      type: Number,
      required: true,
      min: [1, 'There must be at least 1 guest'],
      default: 1,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String], // URLs or /uploads paths
      default: [],
    },
    price: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: 0,
    },
    weeklyDiscount: { type: Number, default: 0, min: 0 }, // percentage
    cleaningFee: { type: Number, default: 0, min: 0 },
    serviceFee: { type: Number, default: 0, min: 0 },
    occupancyTaxes: { type: Number, default: 0, min: 0 },

    // Extra descriptive fields used on the details page
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    enhancedCleaning: { type: Boolean, default: false },
    selfCheckIn: { type: Boolean, default: false },
    specificRatings: {
      cleanliness: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      checkIn: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
      value: { type: Number, default: 0 },
    },

    // Which host owns this listing
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Accommodation', accommodationSchema);
