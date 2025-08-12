module.exports.up = async (mongoose) => {
  const { connection } = mongoose;
  const facilities = connection.collection('facilities');
  // Ensure all facilities have coordinates field
  await facilities.updateMany(
    { 'address.coordinates': { $exists: false } },
    { $set: { 'address.coordinates': { lat: 0, lng: 0 } } }
  );
  await facilities.createIndex({ 'address.coordinates': '2dsphere' });
};


