import React from 'react';
import Navbar from './Navbar';
import BotWidget from './BotWidget';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 SchemeSaathi — Empowering Indian Citizens</p>
          <p className="mt-1">Powered by <span className="font-medium text-orange-500">IBM watsonx.ai</span></p>
        </div>
      </footer>
      <BotWidget />
    </div>
  );
}
