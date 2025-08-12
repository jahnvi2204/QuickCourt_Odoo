import React from 'react';
import { NavLink } from 'react-router-dom';

const item = ({ isActive }) => `block px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'hover:bg-black/5 dark:hover:bg-white/10'}`;

export default function Sidebar() {
  return (
    <nav className="card p-3 space-y-1">
      <NavLink to="/profile" className={item}>Profile</NavLink>
      <NavLink to="/bookings" className={item}>My Bookings</NavLink>
      <NavLink to="/facilities" className={item}>Facilities</NavLink>
      <NavLink to="/admin" className={item}>Admin</NavLink>
      <a className="block px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" href="#logout">Logout</a>
    </nav>
  );
}


