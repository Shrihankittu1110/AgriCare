import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  User as UserIcon,
  Mail,
  MapPin,
  Globe,
  Settings,
  Save,
  CheckCircle,
  Shield,
  Volume2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

export const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { user, preferences, updateUser } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    preferredLanguage: user?.preferredLanguage || 'en',
    locationName: user?.location?.name || 'Guntur, Andhra Pradesh',
    temperatureUnit: preferences?.temperatureUnit || 'C',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedProfile = {
        name: formData.name,
        preferredLanguage: formData.preferredLanguage,
        location: {
          name: formData.locationName,
          latitude: user?.location?.latitude || 16.3067,
          longitude: user?.location?.longitude || 80.4365,
        },
      };

      await authService.updateProfile(updatedProfile);
      updateUser(updatedProfile);
      i18n.changeLanguage(formData.preferredLanguage);

      await authService.updatePreferences({
        temperatureUnit: formData.temperatureUnit,
      });

      showToast('Profile and preferences updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update profile settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-agri-dark tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-agri-600" />
          <span>Farmer Profile & Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage your agricultural regional settings, preferred dialect, and farm coordinates.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agri-100 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Avatar & Email banner */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-agri-600 to-agri-700 text-white flex items-center justify-center font-bold text-2xl shadow-soft">
              {formData.name ? formData.name[0].toUpperCase() : 'F'}
            </div>
            <div>
              <div className="text-base font-bold text-agri-dark">{user?.name}</div>
              <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-cream-50 border border-agri-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-500 text-agri-dark"
                />
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Application & Advisory Language
              </label>
              <div className="relative flex items-center">
                <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <select
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-cream-50 border border-agri-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-500 text-agri-dark"
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు — Telugu</option>
                  <option value="hi">हिन्दी — Hindi</option>
                </select>
              </div>
            </div>

            {/* Farm Location */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Farm District / Region
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  placeholder="e.g. Guntur, Andhra Pradesh"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-cream-50 border border-agri-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-500 text-agri-dark"
                />
              </div>
            </div>

            {/* Temperature Unit */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Temperature Metric
              </label>
              <select
                value={formData.temperatureUnit}
                onChange={(e) => setFormData({ ...formData, temperatureUnit: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-cream-50 border border-agri-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-500 text-agri-dark"
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 bg-agri-600 hover:bg-agri-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Permissions Transparency Panel */}
      <div className="bg-cream-100/80 border border-cream-300/80 rounded-3xl p-6 text-xs text-agri-900 space-y-3">
        <h4 className="text-sm font-bold flex items-center gap-2 text-agri-dark">
          <Shield className="w-4 h-4 text-agri-600" />
          <span>Device Permissions & Privacy Policy</span>
        </h4>
        <p className="text-gray-600 leading-relaxed">
          AgriCare AI requests browser permissions only at the moment a feature requires it:
        </p>
        <ul className="space-y-1.5 text-gray-600 list-disc list-inside">
          <li><strong>Camera:</strong> Used exclusively to capture symptomatic crop leaf photos during live scanning. Photos are processed securely on the backend.</li>
          <li><strong>Microphone:</strong> Used only when you click the voice microphone in the AI Assistant. Audio is not recorded or stored permanently.</li>
          <li><strong>Location:</strong> Used solely to fetch local agricultural weather metrics and disease sporulation risks. You can opt out and enter manual district names anytime.</li>
        </ul>
      </div>
    </div>
  );
};
