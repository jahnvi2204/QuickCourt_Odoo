let redisClient = null;

try {
  const redis = require('redis');
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  redisClient = redis.createClient({ url });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  redisClient.connect().catch(() => {});
} catch (_) {
  // redis is optional; noop if not installed
}

module.exports = redisClient;


