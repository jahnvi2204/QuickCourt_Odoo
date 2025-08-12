import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Facilities from './pages/Facilities';
import VenueSearch from './pages/VenueSearch';
import VenueDetail from './pages/VenueDetail';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="venues" element={<VenueSearch />} />
          <Route path="venues/:id" element={<VenueDetail />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<Dashboard />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


