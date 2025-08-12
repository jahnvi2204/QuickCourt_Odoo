import React from 'react';
import { 
  MapPin, 
  Filter, 
  Star, 
  DollarSign, 
  Calendar, 
  Clock, 
  Wifi, 
  Car, 
  Droplets, 
  Coffee,
  X
} from 'lucide-react';

const VenueFilters = ({
  location,
  locations = [],
  sports = [],
  sportsOptions = [],
  priceRange = { min: '', max: '' },
  rating = '',
  availability = { date: '', time: '' },
  amenities = [],
  amenitiesOptions = [],
  distance = '10',
  sortBy = 'relevance',
  onFilterChange,
  onClearFilters
}) => {
  const handleLocationChange = (e) => {
    onFilterChange('location', e.target.value);
  };

  const handleSportsChange = (selectedSports) => {
    onFilterChange('sports', selectedSports);
  };

  const handlePriceRangeChange = (field, value) => {
    onFilterChange('priceRange', { ...priceRange, [field]: value });
  };

  const handleRatingChange = (e) => {
    onFilterChange('rating', e.target.value);
  };

  const handleAvailabilityChange = (field, value) => {
    onFilterChange('availability', { ...availability, [field]: value });
  };

  const handleAmenitiesChange = (amenity) => {
    const newAmenities = amenities.includes(amenity)
      ? amenities.filter(a => a !== amenity)
      : [...amenities, amenity];
    onFilterChange('amenities', newAmenities);
  };

  const handleDistanceChange = (e) => {
    onFilterChange('distance', e.target.value);
  };

  const handleSortChange = (e) => {
    onFilterChange('sortBy', e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          <Filter className="w-5 h-5 inline mr-2" />
          Filters
        </h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-purple-600 hover:text-purple-700 underline"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <select
            value={location}
            onChange={handleLocationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Sports Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sports
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {sportsOptions.map((sport) => (
              <label key={sport} className="flex items-center">
                <input
                  type="checkbox"
                  checked={sports.includes(sport)}
                  onChange={() => {
                    const newSports = sports.includes(sport)
                      ? sports.filter(s => s !== sport)
                      : [...sports, sport];
                    handleSportsChange(newSports);
                  }}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{sport}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Price Range (per hour)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Star className="w-4 h-4 inline mr-1" />
            Minimum Rating
          </label>
          <select
            value={rating}
            onChange={handleRatingChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Any rating</option>
            <option value="4.5">4.5+ stars</option>
            <option value="4.0">4.0+ stars</option>
            <option value="3.5">3.5+ stars</option>
            <option value="3.0">3.0+ stars</option>
          </select>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Availability
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={availability.date}
              onChange={(e) => handleAvailabilityChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <select
              value={availability.time}
              onChange={(e) => handleAvailabilityChange('time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Any time</option>
              <option value="morning">Morning (6 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
              <option value="evening">Evening (6 PM - 10 PM)</option>
            </select>
          </div>
        </div>

        {/* Amenities Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amenities
          </label>
          <div className="space-y-2">
            {amenitiesOptions.map((amenity) => {
              const Icon = amenity.icon;
              return (
                <label key={amenity.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity.id)}
                    onChange={() => handleAmenitiesChange(amenity.id)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <Icon className="w-4 h-4 ml-2 text-gray-600 dark:text-gray-400" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{amenity.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Distance Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Maximum Distance
          </label>
          <select
            value={distance}
            onChange={handleDistanceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="20">Within 20 km</option>
            <option value="50">Within 50 km</option>
            <option value="100">Any distance</option>
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="relevance">Most Relevant</option>
            <option value="rating">Highest Rated</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="distance">Nearest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default VenueFilters;


