import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';

const getTodayHours = (facility) => {
  const firstCourt = facility?.courts?.[0];
  const operating = firstCourt?.operatingHours;
  if (!operating) return 'Hours: n/a';
  const dayKey = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
  const today = operating[dayKey];
  if (!today) return 'Hours: n/a';
  if (today.closed) return 'Closed today';
  if (today.start && today.end) return `${today.start} – ${today.end}`;
  return 'Hours: n/a';
};

const getSports = (facility) => {
  if (Array.isArray(facility?.sportTypes) && facility.sportTypes.length) return facility.sportTypes;
  const fromCourts = (facility?.courts || []).map((c) => c.sportType).filter(Boolean);
  return Array.from(new Set(fromCourts));
};

const getMinPrice = (facility) => {
  const prices = (facility?.courts || []).map((c) => Number(c.pricePerHour)).filter((n) => !Number.isNaN(n));
  if (!prices.length) return null;
  return Math.min(...prices);
};

export default function VenueCard({ facility }) {
  const city = facility?.address?.city || 'Unknown city';
  const hours = useMemo(() => getTodayHours(facility), [facility]);
  const sports = useMemo(() => getSports(facility).slice(0, 4), [facility]);
  const minPrice = useMemo(() => getMinPrice(facility), [facility]);

  return (
    <Link to={`/venues/${facility._id}`} className="block">
      <Card className="hover:shadow-glow transition">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold text-base">{facility.name}</div>
            <div className="text-xs text-gray-500 mt-1">{city}</div>
          </div>
          {typeof facility?.rating?.average === 'number' && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">★ {facility.rating.average.toFixed(1)}</span>
          )}
        </div>

        {facility.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{facility.description}</p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {sports.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-gray-700 dark:text-gray-300">{hours}</div>
          {minPrice !== null && (
            <div className="font-medium">From ${minPrice}/hr</div>
          )}
        </div>
      </Card>
    </Link>
  );
}
