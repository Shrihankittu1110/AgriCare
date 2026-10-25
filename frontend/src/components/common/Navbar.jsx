import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sprout,
  Menu,
  X,
  ScanLine,
  CloudSun,
  Bot,
  History,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-agri-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-agri-500 to-agri-700 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-agri-900 block leading-tight">
                AgriCare <span className="text-agri-600">AI</span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-agri-600 tracking-wider uppercase block">
                Smart Agriculture
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/dashboard') ? 'text-agri-700' : 'text-gray-600 hover:text-agri-700'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t('nav.dashboard')}
                </Link>
                <Link
                  to="/scan"
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/scan') ? 'text-agri-700' : 'text-gray-600 hover:text-agri-700'
                  }`}
                >
                  <ScanLine className="w-4 h-4" />
                  {t('nav.scan')}
                </Link>
                <Link
                  to="/weather"
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/weather') ? 'text-agri-700' : 'text-gray-600 hover:text-agri-700'
                  }`}
                >
                  <CloudSun className="w-4 h-4" />
                  {t('nav.weather')}
                </Link>
                <Link
                  to="/assistant"
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/assistant') ? 'text-agri-700' : 'text-gray-600 hover:text-agri-700'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  {t('nav.assistant')}
                </Link>
                <Link
                  to="/history"
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/history') ? 'text-agri-700' : 'text-gray-600 hover:text-agri-700'
                  }`}
                >
                  <History className="w-4 h-4" />
                  {t('nav.history')}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/') ? 'text-agri-700 font-semibold' : 'text-gray-600 hover:text-agri-700'
                  }`}
                >
                  {t('nav.home')}
                </Link>
                <a
                  href="/#features"
                  className="text-sm font-medium text-gray-600 hover:text-agri-700 transition-colors"
                >
                  {t('nav.features')}
                </a>
                <a
                  href="/#how-it-works"
                  className="text-sm font-medium text-gray-600 hover:text-agri-700 transition-colors"
                >
                  {t('nav.howItWorks')}
                </a>
                <Link
                  to="/weather"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/weather') ? 'text-agri-700 font-semibold' : 'text-gray-600 hover:text-agri-700'
                  }`}
                >
                  {t('nav.weather')}
                </Link>
                <a
                  href="/#about"
                  className="text-sm font-medium text-gray-600 hover:text-agri-700 transition-colors"
                >
                  {t('nav.about')}
                </a>
              </>
            )}
          </div>

          {/* Right Header: Language Switcher + User/Auth actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-agri-50 text-agri-900 transition-colors"
                  title="Farmer Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-agri-100 border border-agri-300 text-agri-800 flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'F'}
                  </div>
                  <span className="text-sm font-semibold text-agri-900 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title={t('nav.logout')}
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-agri-800 hover:text-agri-900 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-agri-600 hover:bg-agri-700 rounded-xl shadow-sm transition-all active:scale-[0.98]"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-agri-700 rounded-xl hover:bg-agri-50 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-agri-100 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          {isAuthenticated ? (
            <div className="space-y-1">
              <div className="px-3 py-2 bg-agri-50 rounded-xl mb-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-agri-200 text-agri-800 flex items-center justify-center font-bold text-sm">
                  {user?.name ? user.name[0].toUpperCase() : 'F'}
                </div>
                <div>
                  <div className="text-sm font-bold text-agri-900">{user?.name}</div>
                  <div className="text-xs text-agri-600">{user?.email}</div>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-800 hover:bg-agri-50 hover:text-agri-800"
              >
                <LayoutDashboard className="w-5 h-5 text-agri-600" />
                {t('nav.dashboard')}
              </Link>
              <Link
                to="/scan"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-800 hover:bg-agri-50 hover:text-agri-800"
              >
                <ScanLine className="w-5 h-5 text-agri-600" />
                {t('nav.scan')}
              </Link>
              <Link
                to="/weather"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-800 hover:bg-agri-50 hover:text-agri-800"
              >
                <CloudSun className="w-5 h-5 text-agri-600" />
                {t('nav.weather')}
              </Link>
              <Link
                to="/assistant"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-800 hover:bg-agri-50 hover:text-agri-800"
              >
                <Bot className="w-5 h-5 text-agri-600" />
                {t('nav.assistant')}
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-800 hover:bg-agri-50 hover:text-agri-800"
              >
                <History className="w-5 h-5 text-agri-600" />
                {t('nav.history')}
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-800 hover:bg-agri-50 hover:text-agri-800"
              >
                <UserIcon className="w-5 h-5 text-agri-600" />
                {t('nav.profile')}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 text-left mt-2"
              >
                <LogOut className="w-5 h-5" />
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-800 hover:bg-agri-50"
              >
                {t('nav.home')}
              </Link>
              <a
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-800 hover:bg-agri-50"
              >
                {t('nav.features')}
              </a>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-800 hover:bg-agri-50"
              >
                {t('nav.howItWorks')}
              </a>
              <Link
                to="/weather"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-800 hover:bg-agri-50"
              >
                {t('nav.weather')}
              </Link>
              <div className="pt-4 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-agri-800 bg-agri-50 rounded-xl"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-agri-600 rounded-xl shadow-md"
                >
                  {t('nav.register')}
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
