const crypto = require('crypto');

const ALGO = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM recommended

const getKey = () => {
  const key = process.env.ENCRYPTION_KEY || '';
  if (key.length < 32) {
    // Pad to 32 bytes if too short
    return crypto.createHash('sha256').update(key).digest();
  }
  return Buffer.from(key.slice(0, 32));
};

const encrypt = (plaintext) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
};

const decrypt = (ciphertext) => {
  const buf = Buffer.from(ciphertext, 'base64');
  const iv = buf.subarray(0, IV_LENGTH);
  const authTag = buf.subarray(IV_LENGTH, IV_LENGTH + 16);
  const data = buf.subarray(IV_LENGTH + 16);
  const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString('utf8');
};

const hash = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');

module.exports = { encrypt, decrypt, hash };


