module.exports.up = async (mongoose) => {
  const { connection } = mongoose;
  const booking = connection.collection('bookings');
  const facility = connection.collection('facilities');
  const review = connection.collection('reviews');
  await booking.createIndex({ user: 1, date: -1 });
  await booking.createIndex({ facility: 1, date: 1 });
  await facility.createIndex({ 'address.coordinates': '2dsphere' });
  await facility.createIndex({ sportTypes: 1 });
  await review.createIndex({ facility: 1, rating: -1 });
};


