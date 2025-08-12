#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const backupDir = path.resolve(__dirname, '..', 'backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcourt';
const out = path.join(backupDir, `backup-${Date.now()}`);

try {
  execSync(`mongodump --uri='${uri}' --out='${out}'`, { stdio: 'inherit' });
  console.log('Backup completed at', out);
} catch (e) {
  console.error('Backup failed', e.message);
  process.exit(1);
}


