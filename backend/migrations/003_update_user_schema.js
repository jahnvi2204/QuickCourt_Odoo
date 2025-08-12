module.exports.up = async (mongoose) => {
  const { connection } = mongoose;
  const users = connection.collection('users');
  await users.updateMany(
    { preferences: { $exists: false } },
    { $set: { preferences: { notifications: true, favoritesSports: [] } } }
  );
  await users.updateMany(
    { isActive: { $exists: false } },
    { $set: { isActive: true } }
  );
};


