import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User,
  HelpCircle,
  Mail
} from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: 'Home',
      description: 'Go back to the main page',
      icon: Home,
      href: '/',
      color: 'bg-blue-500'
    },
    {
      title: 'Search Venues',
      description: 'Find sports venues near you',
      icon: Search,
      href: '/venues',
      color: 'bg-purple-500'
    },
    {
      title: 'My Bookings',
      description: 'View your upcoming bookings',
      icon: Calendar,
      href: '/bookings',
      color: 'bg-green-500'
    },
    {
      title: 'Profile',
      description: 'Manage your account',
      icon: User,
      href: '/profile',
      color: 'bg-orange-500'
    }
  ];

  const helpOptions = [
    {
      title: 'Contact Support',
      description: 'Get help from our team',
      icon: Mail,
      href: '/contact',
      color: 'bg-red-500'
    },
    {
      title: 'Help Center',
      description: 'Browse our help articles',
      icon: HelpCircle,
      href: '/help',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-gray-200 dark:text-gray-700 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Page Not Found
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
          <Link
            to="/"
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.title}
                  to={link.href}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                >
                  <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {link.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Need Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {helpOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Link
                  key={option.title}
                  to={option.href}
                  className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                >
                  <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Looking for something specific?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try searching for venues, sports, or locations
          </p>
          <div className="flex">
            <input
              type="text"
              placeholder="Search venues, sports, or locations..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Link
              to="/venues"
              className="px-6 py-3 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            If you believe this is an error, please{' '}
            <Link to="/contact" className="text-purple-600 hover:text-purple-700 underline">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
