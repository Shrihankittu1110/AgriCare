import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { MobileBottomNav } from '../components/common/MobileBottomNav';
import { RefreshCw } from 'lucide-react';

export const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-agri-600 mx-auto" />
          <span className="text-xs font-semibold text-agri-800">Verifying agricultural credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-agri-dark selection:bg-agri-200 selection:text-agri-900">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-24 md:pb-12">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};
