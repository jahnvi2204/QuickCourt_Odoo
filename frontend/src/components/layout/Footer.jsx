import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200/60 dark:border-white/10">
      <div className="container mx-auto px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
        <span>© {new Date().getFullYear()} QuickCourt</span>
        <div className="flex gap-3">
          <a className="link" href="#about">About</a>
          <a className="link" href="#contact">Contact</a>
          <a className="link" href="#privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}


