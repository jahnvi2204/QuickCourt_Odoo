const levels = ['error', 'warn', 'info', 'debug'];

const currentLevel = process.env.LOG_LEVEL || 'info';
const currentLevelIndex = levels.indexOf(currentLevel);

const formatMessage = (level, message, meta) => {
  const base = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
  if (!meta) return base;
  try {
    return `${base} ${JSON.stringify(meta)}`;
  } catch {
    return base;
  }
};

module.exports = {
  error: (message, meta) => {
    if (currentLevelIndex >= 0) console.error(formatMessage('error', message, meta));
  },
  warn: (message, meta) => {
    if (currentLevelIndex >= 1) console.warn(formatMessage('warn', message, meta));
  },
  info: (message, meta) => {
    if (currentLevelIndex >= 2) console.log(formatMessage('info', message, meta));
  },
  debug: (message, meta) => {
    if (currentLevelIndex >= 3) console.debug(formatMessage('debug', message, meta));
  }
};


