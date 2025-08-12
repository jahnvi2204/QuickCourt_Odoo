import React, { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import VenueCard from '../components/venue/VenueCard.jsx';
import Input from '../components/common/Input';
import Button from '../components/common/Button.jsx';

export default function Facilities() {
  const { request } = useApi();
  const [facilities, setFacilities] = useState([]);
  const [city, setCity] = useState('');
  const [sport, setSport] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (city) params.set('city', city);
        if (sport) params.set('sportType', sport);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        const data = await request(`/api/facilities?${params.toString()}`);
        setFacilities(data.facilities || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [request, city, sport, minPrice, maxPrice]);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Facilities</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end mb-4">
        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input placeholder="Sport" value={sport} onChange={(e) => setSport(e.target.value)} />
        <Input placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <Input placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      </div>
      {loading ? 'Loading...' : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((f) => (
            <VenueCard key={f._id} facility={f} />
          ))}
        </div>
      )}
    </div>
  );
}


