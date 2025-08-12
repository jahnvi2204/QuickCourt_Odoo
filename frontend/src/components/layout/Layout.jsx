import React from 'react';
import Navbar from './Navbar.jsx';

export default function Layout({ dark, onToggleTheme, children }) {
  return (
    <div className="min-h-screen">
      <Navbar dark={dark} onToggleTheme={onToggleTheme} />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}


