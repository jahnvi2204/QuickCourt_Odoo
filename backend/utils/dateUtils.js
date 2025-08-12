const parseTime = (time) => {
  const [h, m] = String(time).split(':').map(Number);
  return h * 60 + m;
};

const overlaps = (startA, endA, startB, endB) => {
  const a1 = parseTime(startA);
  const a2 = parseTime(endA);
  const b1 = parseTime(startB);
  const b2 = parseTime(endB);
  return a1 < b2 && a2 > b1;
};

const addMinutes = (time, mins) => {
  const total = parseTime(time) + mins;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

module.exports = { parseTime, overlaps, addMinutes };


