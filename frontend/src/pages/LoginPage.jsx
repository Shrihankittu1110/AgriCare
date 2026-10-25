import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const redirectMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        showToast(t('auth.loginSuccess'), 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-agri-100 shadow-soft-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-agri-500 to-agri-700 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-agri-dark tracking-tight">
            {t('auth.loginTitle')}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {redirectMessage && (
          <div className="mb-4 p-3 bg-agri-50 border border-agri-200 text-agri-800 rounded-2xl text-xs font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-agri-600 flex-shrink-0" />
            <span>{redirectMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
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

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              {t('auth.password')}
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream-50/70 border border-agri-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-500 text-agri-dark"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-agri-600 hover:bg-agri-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm mt-2"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>{t('auth.loginBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-500">
          <span>{t('auth.dontHaveAccount')} </span>
          <Link to="/register" className="font-bold text-agri-700 hover:underline">
            {t('auth.signUpHere')}
          </Link>
        </div>
      </div>
    </div>
  );
};
