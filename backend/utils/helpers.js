const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const pick = (obj, keys) => keys.reduce((acc, k) => {
  if (Object.prototype.hasOwnProperty.call(obj, k)) acc[k] = obj[k];
  return acc;
}, {});

const omit = (obj, keys) => Object.keys(obj).reduce((acc, k) => {
  if (!keys.includes(k)) acc[k] = obj[k];
  return acc;
}, {});

module.exports = { asyncHandler, pick, omit };


