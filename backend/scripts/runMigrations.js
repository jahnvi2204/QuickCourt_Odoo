#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');

const Migrations = [
  require('../migrations/001_create_indexes'),
  require('../migrations/002_add_geolocation'),
  require('../migrations/003_update_user_schema'),
];

const run = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcourt';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  for (const migration of Migrations) {
    // Each migration exports an async up() function
    if (typeof migration.up === 'function') {
      console.log(`Running migration: ${migration.name || 'anonymous'}`);
      // eslint-disable-next-line no-await-in-loop
      await migration.up(mongoose);
    }
  }

  await mongoose.disconnect();
  console.log('Migrations completed');
};

run().catch((e) => {
  console.error('Migration failed', e);
  process.exit(1);
});


