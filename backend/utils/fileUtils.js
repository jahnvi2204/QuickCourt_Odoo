const fs = require('fs');
const path = require('path');

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (_) {
    // ignore
  }
};

const getUploadsDir = () => path.resolve(process.cwd(), 'quick-court', 'backend', 'uploads');

module.exports = { ensureDir, deleteFile, getUploadsDir };


