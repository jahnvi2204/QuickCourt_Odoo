import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Input from '../common/Input';

const linkClass = ({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${
  isActive ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300 hover:text-primary'
}`;

export default function Navbar({ onToggleTheme, dark }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    navigate(`/venues?search=${encodeURIComponent(q)}`);
  };
  return (
    <nav className="navbar">
      <div className="container mx-auto px-4 py-3 flex gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-xl font-semibold">QuickCourt</Link>
          <NavLink to="/venues" className={linkClass}>Search</NavLink>
          <NavLink to="/facilities" className={linkClass}>Facilities</NavLink>
          <NavLink to="/bookings" className={linkClass}>Bookings</NavLink>
          <NavLink to="/profile" className={linkClass}>Profile</NavLink>
          <NavLink to="/admin" className={linkClass}>Admin</NavLink>
        </div>
        <div className="flex gap-2 items-center">
          <form onSubmit={submit} className="hidden md:flex items-center">
            <Input placeholder="Search venues..." value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />
          </form>
          <NavLink to="/login" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-gray-900 text-white' : 'border border-primary text-primary hover:bg-primary/10'}`}>Login</NavLink>
          <NavLink to="/register" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'btn-primary'}`}>Sign up</NavLink>
          <button className="px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-white/10" onClick={onToggleTheme}>{dark ? 'Light' : 'Dark'}</button>
        </div>
      </div>
    </nav>
  );
}


