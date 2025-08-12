#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');

const seedUsers = require('../seeders/userSeeder');
const seedFacilities = require('../seeders/facilitySeeder');
const seedBookings = require('../seeders/bookingSeeder');

const run = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcourt';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  await seedUsers();
  await seedFacilities();
  await seedBookings();

  await mongoose.disconnect();
  console.log('Seeding completed');
};

run().catch((e) => {
  console.error('Seeding failed', e);
  process.exit(1);
});


