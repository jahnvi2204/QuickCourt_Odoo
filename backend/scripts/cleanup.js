#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const uploadsDir = path.resolve(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) process.exit(0);

const files = fs.readdirSync(uploadsDir);
const now = Date.now();
let removed = 0;

for (const file of files) {
  const full = path.join(uploadsDir, file);
  const stat = fs.statSync(full);
  // Remove files older than 7 days
  if (now - stat.mtimeMs > 7 * 24 * 60 * 60 * 1000) {
    try { fs.unlinkSync(full); removed += 1; } catch (_) {}
  }
}

console.log(`Cleanup done. Removed ${removed} old files.`);


