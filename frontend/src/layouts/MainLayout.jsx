import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MobileBottomNav } from '../components/common/MobileBottomNav';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-agri-dark selection:bg-agri-200 selection:text-agri-900">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 md:pb-12">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};
