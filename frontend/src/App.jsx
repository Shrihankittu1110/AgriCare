import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScanCropPage } from './pages/ScanCropPage';
import { ScanHistoryPage } from './pages/ScanHistoryPage';
import { ScanDetailPage } from './pages/ScanDetailPage';
import { WeatherPage } from './pages/WeatherPage';
import { AssistantPage } from './pages/AssistantPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected Farmer Layout */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/scan" element={<ScanCropPage />} />
              <Route path="/history" element={<ScanHistoryPage />} />
              <Route path="/history/:id" element={<ScanDetailPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* 404 Catch-All */}
            <Route element={<MainLayout />}>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
