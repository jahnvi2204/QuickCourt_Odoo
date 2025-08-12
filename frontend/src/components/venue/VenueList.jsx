import React, { useState, useEffect } from 'react';
import { Filter, Star, MapPin, Clock, Users } from 'lucide-react';
import VenueCard from './VenueCard';

const VenueList = ({ venues = [], loading = false, onVenueClick }) => {
  if (loading) {
    return (
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
    );
  }

  if (venues.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <Filter className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No venues found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue) => (
        <VenueCard
          key={venue._id}
          venue={venue}
          onClick={() => onVenueClick && onVenueClick(venue._id)}
        />
      ))}
    </div>
  );
};

export default VenueList;
