// Seed script — fills your MongoDB database with
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Accommodation = require('../models/Accommodation');
const Reservation = require('../models/Reservation');

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Reservation.deleteMany();
    await Accommodation.deleteMany();
    await User.deleteMany();
    console.log('Cleared old data');

    // Create users (passwords get hashed automatically by the
    const admin = await User.create({
      username: 'Admin',
      email: 'admin@airbnb.com',
      password: 'password123',
      role: 'admin',
    });
    const jane = await User.create({
      username: 'Jane Doe',
      email: 'jane@airbnb.com',
      password: 'password321',
      role: 'host',
    });
    const john = await User.create({
      username: 'John Doe',
      email: 'john@airbnb.com',
      password: 'password123',
      role: 'user',
    });
    console.log('Created users');

    // Create sample accommodations owned by Jane (the host)
    await Accommodation.create([
      {
        title: 'Modern Apartment in New York',
        location: 'New York',
        type: 'Entire apartment',
        description: 'Stay in the heart of New York City with easy access to everything.',
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['wifi', 'kitchen', 'free parking'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        ],
        price: 320,
        weeklyDiscount: 10,
        cleaningFee: 50,
        serviceFee: 50,
        occupancyTaxes: 30,
        rating: 4.5,
        reviews: 320,
        enhancedCleaning: true,
        selfCheckIn: true,
        specificRatings: {
          cleanliness: 4.8,
          communication: 4.7,
          checkIn: 4.9,
          accuracy: 4.6,
          location: 4.9,
          value: 4.5,
        },
        host: jane._id,
      },
      {
        title: 'Cozy Studio near Cape Town Beach',
        location: 'Cape Town',
        type: 'Entire studio',
        description: 'A bright studio a short walk from the beach and cafés.',
        guests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['wifi', 'air conditioning', 'pool'],
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'],
        price: 150,
        weeklyDiscount: 5,
        cleaningFee: 30,
        serviceFee: 25,
        occupancyTaxes: 15,
        rating: 4.8,
        reviews: 145,
        host: jane._id,
      },
    ]);
    console.log('Created accommodations');

    console.log('\nSeed complete!');
    console.log('admin@airbnb.com / password123 (admin)');
    console.log('jane@airbnb.com / password321 (host)');
    console.log('john@airbnb.com / password123 (user)');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
