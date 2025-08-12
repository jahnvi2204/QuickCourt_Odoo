const Facility = require('../models/Facility');
const User = require('../models/User');

module.exports = async () => {
  const owner = await User.findOne({ role: 'facility_owner' });
  if (!owner) return;

  const facilities = [
    {
      name: 'Downtown Sports Complex',
      description: 'Multi-sport facility with modern amenities',
      owner: owner._id,
      address: { city: 'Metropolis', country: 'US', coordinates: { lat: 0, lng: 0 } },
      photos: [],
      courts: [
        { name: 'Court 1', sportType: 'tennis', pricePerHour: 25 },
        { name: 'Court 2', sportType: 'badminton', pricePerHour: 15 }
      ],
      amenities: ['parking', 'locker rooms'],
      sportTypes: ['tennis', 'badminton'],
      isApproved: true
    }
  ];

  await Facility.deleteMany({ name: { $in: facilities.map(f => f.name) } });
  await Facility.insertMany(facilities);
};


