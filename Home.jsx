import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useApi from '../hooks/useApi';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Star, 
  Users, 
  Award, 
  Clock, 
  DollarSign,
  ArrowRight,
  Play,
  CheckCircle,
  Heart,
  MessageCircle,
  Shield,
  Zap,
  Globe,
  TrendingUp
} from 'lucide-react';
import VenueCard from '../components/venue/VenueCard';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { apiCall } = useApi();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [featuredVenues, setFeaturedVenues] = useState([]);
  const [popularVenues, setPopularVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    venues: 0,
    users: 0,
    bookings: 0,
    sports: 0
  });

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [featuredResponse, popularResponse, statsResponse] = await Promise.all([
        apiCall('/api/facilities/featured', 'GET'),
        apiCall('/api/facilities/popular', 'GET'),
        apiCall('/api/stats', 'GET')
      ]);

      if (featuredResponse.success) {
        setFeaturedVenues(featuredResponse.data);
      }
      if (popularResponse.success) {
        setPopularVenues(popularResponse.data);
      }
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (selectedLocation) params.append('location', selectedLocation);
    if (selectedSport) params.append('sports', selectedSport);
    navigate(`/venues?${params.toString()}`);
  };

  const sports = [
    { name: 'Tennis', icon: '🎾', color: 'bg-green-500' },
    { name: 'Basketball', icon: '🏀', color: 'bg-orange-500' },
    { name: 'Football', icon: '⚽', color: 'bg-blue-500' },
    { name: 'Cricket', icon: '🏏', color: 'bg-red-500' },
    { name: 'Badminton', icon: '🏸', color: 'bg-purple-500' },
    { name: 'Swimming', icon: '🏊', color: 'bg-cyan-500' }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Book your favorite sports venue in seconds with our streamlined booking process.'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Your payments are protected with bank-level security and encryption.'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Browse and book venues anytime, anywhere with our mobile-friendly platform.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of sports enthusiasts and build your fitness community.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Tennis Player',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: 'QuickCourt has made booking tennis courts so much easier. I can find and book courts near me in minutes!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Basketball Coach',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'As a coach, I need reliable venues for my team. QuickCourt never disappoints with their quality facilities.',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Fitness Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'The variety of sports venues available is amazing. I can try different activities without any hassle.',
      rating: 5
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Search Venues',
      description: 'Find sports venues near you by location, sport type, or availability.',
      icon: Search
    },
    {
      step: 2,
      title: 'Choose & Book',
      description: 'Select your preferred time slot and book instantly with secure payment.',
      icon: Calendar
    },
    {
      step: 3,
      title: 'Play & Enjoy',
      description: 'Arrive at your venue and enjoy your game with friends or family.',
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block text-yellow-400">Sports Venue</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
              Discover and book the best sports facilities in your area. From tennis courts to swimming pools, 
              we've got everything you need to stay active and healthy.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-8">
              <div className="bg-white rounded-lg p-2 shadow-lg flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search venues, sports, or locations..."
                    className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900"
                  >
                    <option value="">Any Location</option>
                    <option value="downtown">Downtown</option>
                    <option value="uptown">Uptown</option>
                    <option value="suburbs">Suburbs</option>
                  </select>
                  <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900"
                  >
                    <option value="">Any Sport</option>
                    <option value="tennis">Tennis</option>
                    <option value="basketball">Basketball</option>
                    <option value="football">Football</option>
                    <option value="cricket">Cricket</option>
                  </select>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-semibold"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold mb-1">
                    {key === 'venues' && `${value}+`}
                    {key === 'users' && `${value}+`}
                    {key === 'bookings' && `${value}+`}
                    {key === 'sports' && value}
                  </div>
                  <div className="text-purple-200 capitalize">
                    {key === 'venues' && 'Venues'}
                    {key === 'users' && 'Users'}
                    {key === 'bookings' && 'Bookings'}
                    {key === 'sports' && 'Sports'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sports Categories */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Sports
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find venues for your favorite sports and activities
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sports.map((sport) => (
              <Link
                key={sport.name}
                to={`/venues?sports=${sport.name.toLowerCase()}`}
                className="group text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
              >
                <div className={`w-16 h-16 ${sport.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{sport.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  {sport.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Get started in just three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="text-center">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                    Step {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Venues */}
      {featuredVenues.length > 0 && (
        <div className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Featured Venues
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Top-rated venues handpicked for you
                </p>
              </div>
              <Link
                to="/venues"
                className="flex items-center text-purple-600 hover:text-purple-700 font-semibold"
              >
                View All
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVenues.map((venue) => (
                <VenueCard key={venue._id} venue={venue} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose QuickCourt?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We make booking sports venues simple, secure, and enjoyable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join thousands of satisfied sports enthusiasts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Playing?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of sports enthusiasts and book your next game today
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {user ? (
              <Link
                to="/venues"
                className="px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Browse Venues
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-purple-600 transition-colors font-semibold"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


