import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import useGeolocation from '../hooks/useGeolocation';
import useDebounce from '../hooks/useDebounce';
import { 
  Search, 
  MapPin, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Heart, 
  Clock, 
  DollarSign,
  Map,
  Sliders,
  X,
  Calendar,
  Users,
  Wifi,
  Car,
  Droplets,
  Coffee,
  Car as CarIcon
} from 'lucide-react';
import VenueCard from '../components/venue/VenueCard';
import VenueFilters from '../components/venue/VenueFilters';

const VenueSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { apiCall } = useApi();
  const { location } = useGeolocation();
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [selectedSports, setSelectedSports] = useState(searchParams.get('sports')?.split(',') || []);
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [availability, setAvailability] = useState({
    date: searchParams.get('date') || '',
    time: searchParams.get('time') || ''
  });
  const [amenities, setAmenities] = useState(searchParams.get('amenities')?.split(',') || []);
  const [distance, setDistance] = useState(searchParams.get('distance') || '10');
  
  // UI state
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  
  // Data state
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Available options
  const [sportsOptions, setSportsOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [amenitiesOptions, setAmenitiesOptions] = useState([
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'shower', label: 'Shower', icon: Droplets },
    { id: 'coffee', label: 'Coffee', icon: Coffee },
    { id: 'car', label: 'Car Rental', icon: CarIcon }
  ]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    loadSearchOptions();
  }, []);

  useEffect(() => {
    searchVenues();
  }, [
    debouncedSearchTerm,
    selectedLocation,
    selectedSports,
    priceRange,
    rating,
    availability,
    amenities,
    distance,
    sortBy,
    currentPage
  ]);

  const loadSearchOptions = async () => {
    try {
      const [sportsResponse, locationsResponse] = await Promise.all([
        apiCall('/api/facilities/sports', 'GET'),
        apiCall('/api/facilities/locations', 'GET')
      ]);

      if (sportsResponse.success) {
        setSportsOptions(sportsResponse.data);
      }
      if (locationsResponse.success) {
        setLocationOptions(locationsResponse.data);
      }
    } catch (error) {
      console.error('Error loading search options:', error);
    }
  };

  const searchVenues = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.append('q', debouncedSearchTerm);
      if (selectedLocation) params.append('location', selectedLocation);
      if (selectedSports.length > 0) params.append('sports', selectedSports.join(','));
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);
      if (rating) params.append('rating', rating);
      if (availability.date) params.append('date', availability.date);
      if (availability.time) params.append('time', availability.time);
      if (amenities.length > 0) params.append('amenities', amenities.join(','));
      if (distance) params.append('distance', distance);
      if (sortBy) params.append('sort', sortBy);
      if (currentPage > 1) params.append('page', currentPage);
      
      // Add user location if available
      if (location && !selectedLocation) {
        params.append('userLat', location.latitude);
        params.append('userLng', location.longitude);
      }

      const response = await apiCall(`/api/facilities/search?${params.toString()}`, 'GET');
      
      if (response.success) {
        if (currentPage === 1) {
          setVenues(response.data.venues);
        } else {
          setVenues(prev => [...prev, ...response.data.venues]);
        }
        setTotalResults(response.data.total);
        setHasMore(response.data.hasMore);
        
        // Update URL params
        setSearchParams(params);
      }
    } catch (error) {
      console.error('Error searching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    searchVenues();
  };

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    switch (filterType) {
      case 'location':
        setSelectedLocation(value);
        break;
      case 'sports':
        setSelectedSports(value);
        break;
      case 'priceRange':
        setPriceRange(value);
        break;
      case 'rating':
        setRating(value);
        break;
      case 'availability':
        setAvailability(value);
        break;
      case 'amenities':
        setAmenities(value);
        break;
      case 'distance':
        setDistance(value);
        break;
      default:
        break;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedSports([]);
    setPriceRange({ min: '', max: '' });
    setRating('');
    setAvailability({ date: '', time: '' });
    setAmenities([]);
    setDistance('10');
    setSortBy('relevance');
    setCurrentPage(1);
    setSearchParams({});
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleVenueClick = (venueId) => {
    navigate(`/venues/${venueId}`);
  };

  const getAmenityIcon = (amenityId) => {
    const amenity = amenitiesOptions.find(a => a.id === amenityId);
    return amenity ? amenity.icon : null;
  };

  const hasActiveFilters = selectedLocation || selectedSports.length > 0 || 
    priceRange.min || priceRange.max || rating || availability.date || 
    availability.time || amenities.length > 0 || distance !== '10';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search venues, sports, or locations..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-lg border flex items-center space-x-2 ${
                  hasActiveFilters
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {Object.values({
                      location: selectedLocation,
                      sports: selectedSports.length,
                      price: priceRange.min || priceRange.max,
                      rating,
                      availability: availability.date || availability.time,
                      amenities: amenities.length,
                      distance: distance !== '10'
                    }).filter(Boolean).length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className={`px-4 py-3 rounded-lg border flex items-center space-x-2 ${
                  showMap
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Map className="w-5 h-5" />
                <span>Map</span>
              </button>
            </div>
          </form>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-wrap">
                {selectedLocation && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedLocation}
                    <button
                      onClick={() => setSelectedLocation('')}
                      className="ml-2 hover:text-purple-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSports.map((sport) => (
                  <span key={sport} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {sport}
                    <button
                      onClick={() => setSelectedSports(prev => prev.filter(s => s !== sport))}
                      className="ml-2 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {amenities.map((amenity) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <span key={amenity} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      {Icon && <Icon className="w-4 h-4 mr-1" />}
                      {amenity}
                      <button
                        onClick={() => setAmenities(prev => prev.filter(a => a !== amenity))}
                        className="ml-2 hover:text-green-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {totalResults} {totalResults === 1 ? 'venue' : 'venues'} found
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <VenueFilters
                location={selectedLocation}
                locations={locationOptions}
                sports={selectedSports}
                sportsOptions={sportsOptions}
                priceRange={priceRange}
                rating={rating}
                availability={availability}
                amenities={amenities}
                amenitiesOptions={amenitiesOptions}
                distance={distance}
                sortBy={sortBy}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          )}

          {/* Main Content */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {searchTerm ? `Search results for "${searchTerm}"` : 'All Venues'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {totalResults} {totalResults === 1 ? 'venue' : 'venues'} found
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="distance">Nearest First</option>
                </select>
                
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Map View */}
            {showMap && (
              <div className="mb-6 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Map view coming soon</p>
                </div>
              </div>
            )}

            {/* Results Grid/List */}
            {loading && venues.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : venues.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {venues.map((venue) => (
                  <VenueCard
                    key={venue._id}
                    venue={venue}
                    viewMode={viewMode}
                    onClick={() => handleVenueClick(venue._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No venues found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Load More */}
            {hasMore && venues.length > 0 && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More Venues'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueSearch;


