import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, User, Mail, Lock, Globe, MapPin, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'en',
    locationName: 'Guntur, Andhra Pradesh',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        preferredLanguage: formData.preferredLanguage,
        location: {
          name: formData.locationName || 'Indore, Madhya Pradesh',
          latitude: 22.7196,
          longitude: 75.8577,
        },
      });

      if (res.success) {
        showToast(t('auth.registerSuccess'), 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-agri-100 shadow-soft-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-agri-500 to-agri-700 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-agri-dark tracking-tight">
            {t('auth.registerTitle')}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {t('auth.registerSubtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t('auth.fullName')}
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ramesh Patel"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream-50/70 border border-agri-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-500 text-agri-dark"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t('auth.email')}
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="farmer@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream-50/70 border border-agri-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-500 text-agri-dark"
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-9 py-2.5 text-sm bg-cream-50/70 border border-agri-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-500 text-agri-dark"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 p-1 text-gray-400 hover:text-agri-700 focus:outline-none transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-9 py-2.5 text-sm bg-cream-50/70 border border-agri-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-500 text-agri-dark"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 p-1 text-gray-400 hover:text-agri-700 focus:outline-none transition-colors"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t('auth.preferredLanguage')}
            </label>
            <div className="relative flex items-center">
              <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream-50/70 border border-agri-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-500 text-agri-dark"
              >
                <option value="en">English</option>
                <option value="te">తెలుగు — Telugu</option>
                <option value="hi">हिन्दी — Hindi</option>
              </select>
            </div>
          </div>

          {/* Farm Location (Optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t('auth.farmLocation')}
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="e.g. Guntur, Andhra Pradesh"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream-50/70 border border-agri-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-500 text-agri-dark"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-agri-600 hover:bg-agri-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm mt-3"
          >
            {isLoading ? (
              <span>Creating your account...</span>
            ) : (
              <>
                <span>{t('auth.registerBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-500">
          <span>{t('auth.alreadyHaveAccount')} </span>
          <Link to="/login" className="font-bold text-agri-700 hover:underline">
            {t('auth.signInHere')}
          </Link>
        </div>
      </div>
    </div>
  );
};
