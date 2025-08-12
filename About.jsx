import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button.jsx';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">About QuickCourt</h1>
        <p className="text-gray-600 dark:text-gray-300">QuickCourt helps you discover and book sports facilities easily.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-medium">Our mission</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Make sports more accessible with transparent pricing, real-time availability, and a great booking experience.</p>
        </Card>
        <Card>
          <h3 className="font-medium">For players</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Search, compare, and book courts across multiple sports in minutes.</p>
        </Card>
        <Card>
          <h3 className="font-medium">For facility owners</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Grow your business with online bookings, payments, and analytics.</p>
        </Card>
      </div>

      <Card>
        <h3 className="font-medium mb-2">Contact us</h3>
        <div className="text-sm text-gray-700 dark:text-gray-300">Email: support@quickcourt.test</div>
        <Button variant="outline" className="mt-3" onClick={() => window.location.href = 'mailto:support@quickcourt.test'}>Email support</Button>
      </Card>
    </div>
  );
}


