import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useApi from '../hooks/useApi';
import useNotifications from '../hooks/useNotifications';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Star, 
  Heart, 
  Share2, 
  Calendar,
  Users,
  DollarSign,
  Wifi,
  Car,
  Droplets,
  Coffee,
  BookOpen,
  MessageCircle,
  Image as ImageIcon,
  ArrowLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';
import VenueCard from '../components/venue/VenueCard';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';
import PaymentModal from '../components/payment/PaymentModal';

const VenueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { apiCall } = useApi();
  const { showNotification } = useNotifications();
  
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);
  const [similarVenues, setSimilarVenues] = useState([]);
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    duration: 1,
    participants: 1,
    totalPrice: 0
  });

  useEffect(() => {
    loadVenueDetails();
  }, [id]);

  const loadVenueDetails = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/api/facilities/${id}`, 'GET');
      if (response.success) {
        setVenue(response.data);
        setIsFavorite(response.data.isFavorite || false);
        loadSimilarVenues(response.data.sports, response.data.location);
      } else {
        setError('Venue not found');
      }
    } catch (error) {
      setError('Failed to load venue details');
      console.error('Error loading venue:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarVenues = async (sports, location) => {
    try {
      const response = await apiCall(`/api/facilities/similar?venueId=${id}&sports=${sports.join(',')}&location=${location}`, 'GET');
      if (response.success) {
        setSimilarVenues(response.data.slice(0, 4));
      }
    } catch (error) {
      console.error('Error loading similar venues:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      const response = await apiCall(`/api/facilities/${id}/favorite`, 'POST');
      if (response.success) {
        setIsFavorite(!isFavorite);
        showNotification(
          isFavorite ? 'Removed from favorites' : 'Added to favorites',
          'success'
        );
      }
    } catch (error) {
      showNotification('Failed to update favorites', 'error');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: venue.name,
        text: `Check out ${venue.name} - ${venue.description}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Link copied to clipboard!', 'success');
    }
  };

  const calculatePrice = () => {
    if (!venue || !selectedDate || !selectedTime || !selectedDuration) return 0;
    
    const basePrice = venue.pricePerHour;
    const durationMultiplier = selectedDuration;
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    
    // Weekend pricing
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const priceMultiplier = isWeekend ? 1.2 : 1;
    
    return basePrice * durationMultiplier * priceMultiplier;
  };

  const handleBookingSubmit = async () => {
    if (!user) {
      showNotification('Please login to book a venue', 'error');
      return;
    }

    const totalPrice = calculatePrice();
    setBookingData({
      date: selectedDate,
      startTime: selectedTime,
      duration: selectedDuration,
      participants: 1,
      totalPrice
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const bookingResponse = await apiCall('/api/bookings', 'POST', {
        venueId: id,
        date: selectedDate,
        startTime: selectedTime,
        duration: selectedDuration,
        participants: 1,
        totalPrice: bookingData.totalPrice,
        paymentId: paymentData.paymentId
      });

      if (bookingResponse.success) {
        showNotification('Booking confirmed successfully!', 'success');
        setShowPaymentModal(false);
        setShowBookingModal(false);
        // Reset form
        setSelectedDate('');
        setSelectedTime('');
        setSelectedDuration(1);
      }
    } catch (error) {
      showNotification('Failed to create booking', 'error');
    }
  };

  const checkAvailability = async () => {
    if (!selectedDate || !selectedTime) {
      showNotification('Please select date and time', 'error');
      return;
    }

    try {
      const response = await apiCall(`/api/facilities/${id}/availability`, 'GET', {
        date: selectedDate,
        time: selectedTime,
        duration: selectedDuration
      });

      if (response.success && response.data.available) {
        showNotification('Time slot is available!', 'success');
      } else {
        showNotification('Time slot is not available', 'error');
      }
    } catch (error) {
      showNotification('Failed to check availability', 'error');
    }
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: Wifi,
      parking: Car,
      shower: Droplets,
      coffee: Coffee,
      car: Car
    };
    return icons[amenity] || CheckCircle;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Venue Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/venues')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-full ${
                  isFavorite 
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative h-96 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                {venue.images && venue.images.length > 0 ? (
                  <img
                    src={venue.images[selectedImage]}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                {/* Image Navigation */}
                {venue.images && venue.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {venue.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === selectedImage ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {venue.images && venue.images.length > 1 && (
                <div className="flex space-x-2 mt-4">
                  {venue.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        index === selectedImage ? 'border-purple-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${venue.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Venue Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {venue.name}
                  </h1>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {venue.location}
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{venue.rating || 4.5}</span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        ({venue.reviewCount || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                      <span className="font-medium">${venue.pricePerHour}/hour</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {venue.description}
              </p>

              {/* Sports Available */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Sports Available</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.sports.map((sport) => (
                    <span
                      key={sport}
                      className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              {venue.amenities && venue.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {venue.amenities.map((amenity) => {
                      const Icon = getAmenityIcon(amenity.toLowerCase());
                      return (
                        <div key={amenity} className="flex items-center">
                          <Icon className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300 capitalize">
                            {amenity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: BookOpen },
                    { id: 'reviews', label: 'Reviews', icon: MessageCircle },
                    { id: 'schedule', label: 'Schedule', icon: Calendar }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">About this venue</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Opening Hours</h4>
                        <div className="space-y-1 text-gray-600 dark:text-gray-400">
                          <div className="flex justify-between">
                            <span>Monday - Friday</span>
                            <span>6:00 AM - 10:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Saturday - Sunday</span>
                            <span>7:00 AM - 11:00 PM</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Contact Information</h4>
                        <div className="space-y-2 text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {venue.phone || 'Not available'}
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {venue.email || 'Not available'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {venue.rules && venue.rules.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Rules & Guidelines</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                          {venue.rules.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Reviews</h3>
                      {user && (
                        <button
                          onClick={() => setShowReviewForm(true)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          Write Review
                        </button>
                      )}
                    </div>
                    <ReviewList venueId={id} />
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Availability Schedule</h3>
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Schedule view coming soon</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Book this venue</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select time</option>
                    {Array.from({ length: 14 }, (_, i) => {
                      const hour = i + 6; // 6 AM to 8 PM
                      return (
                        <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                          {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration (hours)</label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map((hours) => (
                      <option key={hours} value={hours}>
                        {hours} {hours === 1 ? 'hour' : 'hours'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Price per hour:</span>
                    <span>${venue.pricePerHour}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Duration:</span>
                    <span>{selectedDuration} {selectedDuration === 1 ? 'hour' : 'hours'}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${calculatePrice()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={checkAvailability}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 disabled:opacity-50"
                  >
                    Check Availability
                  </button>
                  <button
                    onClick={handleBookingSubmit}
                    disabled={!selectedDate || !selectedTime || !user}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {user ? 'Book Now' : 'Login to Book'}
                  </button>
                </div>
              </div>
            </div>

            {/* Similar Venues */}
            {similarVenues.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Similar Venues</h3>
                <div className="space-y-4">
                  {similarVenues.map((similarVenue) => (
                    <VenueCard key={similarVenue._id} venue={similarVenue} compact />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <ReviewForm
              venueId={id}
              onClose={() => setShowReviewForm(false)}
              onSuccess={() => {
                setShowReviewForm(false);
                setActiveTab('reviews');
              }}
            />
          </div>
        </div>
      )}

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={bookingData.totalPrice}
          onSuccess={handlePaymentSuccess}
          bookingData={bookingData}
        />
      )}
    </div>
  );
};

export default VenueDetail;


