import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ScanLine,
  Bot,
  CloudSun,
  History,
  MapPin,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Search,
  X,
  LocateFixed,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { WeatherWidget } from '../components/weather/WeatherWidget';
import { WeatherAgronomyAlerts } from '../components/weather/WeatherAgronomyAlerts';
import { weatherService } from '../services/weatherService';
import { scanService } from '../services/scanService';
import { authService } from '../services/authService';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [weather, setWeather] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [recentScans, setRecentScans] = useState([]);
  const [isScansLoading, setIsScansLoading] = useState(true);

  // Location search modal
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const handleDetectGpsLocation = () => {
    if (!('geolocation' in navigator)) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          showToast('Detecting location name...', 'info');
          const detectedName = await weatherService.reverseGeocode(latitude, longitude);
          const newLocation = {
            name: detectedName,
            latitude,
            longitude,
          };
          await authService.updateProfile({ location: newLocation });
          updateUser({ location: newLocation });
          showToast(`Location detected: ${detectedName}`, 'success');
          fetchWeather(latitude, longitude, detectedName);
          setSearchModalOpen(false);
        } catch (err) {
          console.warn('GPS location save failed:', err);
          showToast('Could not save detected GPS location', 'error');
        } finally {
          setIsDetectingGps(false);
        }
      },
      (err) => {
        console.warn('GPS error:', err.message);
        setIsDetectingGps(false);
        if (err.code === 1) {
          showToast('Location permission denied. Please allow location access in your browser.', 'error');
        } else {
          showToast('Could not acquire GPS signal. Try searching your city name above.', 'error');
        }
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  const fetchWeather = async (lat, lon, name) => {
    setIsWeatherLoading(true);
    try {
      const data = await weatherService.getWeather(lat, lon, name);
      if (data.success) {
        setWeather(data.weather);
      }
    } catch (err) {
      console.warn('[Dashboard] Weather fetch failed:', err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const fetchRecentScans = async () => {
    setIsScansLoading(true);
    try {
      const data = await scanService.getScans({ limit: 4 });
      if (data.success) {
        setRecentScans(data.scans || []);
      }
    } catch (err) {
      console.warn('[Dashboard] Scans fetch failed:', err);
    } finally {
      setIsScansLoading(false);
    }
  };

  useEffect(() => {
    const lat = user?.location?.latitude || 16.3067;
    const lon = user?.location?.longitude || 80.4365;
    const name = user?.location?.name || 'Guntur, Andhra Pradesh';

    fetchWeather(lat, lon, name);
    fetchRecentScans();
  }, [user]);

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    setIsSearching(true);
    try {
      const data = await weatherService.searchLocations(searchQuery);
      if (data.success) {
        setSearchResults(data.locations || []);
      }
    } catch (err) {
      console.warn('Location search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = async (loc) => {
    const newLocation = {
      name: loc.name,
      latitude: loc.latitude,
      longitude: loc.longitude,
    };

    setSearchModalOpen(false);
    setSearchQuery('');
    setSearchResults([]);

    try {
      await authService.updateProfile({ location: newLocation });
      updateUser({ location: newLocation });
      showToast(`Farm location updated to ${loc.name}`, 'success');
      fetchWeather(loc.latitude, loc.longitude, loc.name);
    } catch (e) {
      showToast('Could not save location to profile', 'error');
    }
  };

  const quickTips = t('dashboard.quickTipsList', { returnObjects: true }) || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-agri-700 via-agri-600 to-agri-800 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-cream-100 text-xs font-semibold backdrop-blur-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
            <span>Smart Farming Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t('dashboard.welcome')}, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-xs sm:text-sm text-cream-200/90 max-w-xl mt-1 leading-relaxed">
            Monitor your field's health conditions, track upcoming precipitation, and consult your multilingual AI agronomist.
          </p>
        </div>

        {/* Quick CTA Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <Link
            to="/scan"
            className="flex-1 sm:flex-initial py-3 px-5 bg-white text-agri-900 font-bold rounded-2xl shadow-sm hover:bg-cream-100 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            <ScanLine className="w-5 h-5 text-agri-600" />
            <span>{t('dashboard.scanCrop')}</span>
          </Link>

          <Link
            to="/assistant"
            className="flex-1 sm:flex-initial py-3 px-5 bg-agri-900/60 hover:bg-agri-900/80 border border-white/20 text-white font-bold rounded-2xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            <Bot className="w-5 h-5 text-accent-gold" />
            <span>{t('dashboard.askAssistant')}</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Weather & Agronomy on Left, Recent Scans on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Weather & Agro Alerts) */}
        <div className="lg:col-span-7 space-y-6">
          <WeatherWidget
            weather={weather}
            isRefreshing={isWeatherLoading}
            onRefresh={() =>
              fetchWeather(
                user?.location?.latitude || 16.3067,
                user?.location?.longitude || 80.4365,
                user?.location?.name || 'Farm Location'
              )
            }
            onOpenSearch={() => setSearchModalOpen(true)}
          />

          {weather?.agronomyAlerts && weather.agronomyAlerts.length > 0 && (
            <WeatherAgronomyAlerts alerts={weather.agronomyAlerts} />
          )}

          {/* Daily Farming Tips Card */}
          <div className="bg-white rounded-3xl p-6 border border-agri-100 shadow-card">
            <h3 className="text-base font-bold text-agri-dark mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent-amber" />
              <span>{t('dashboard.quickTips')}</span>
            </h3>

            <div className="space-y-2.5">
              {Array.isArray(quickTips) &&
                quickTips.map((tip, idx) => (
                  <div key={idx} className="p-3 bg-cream-50/70 rounded-2xl border border-cream-200/80 text-xs text-agri-900 flex items-start gap-2.5 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-agri-100 text-agri-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{tip}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column (Recent Scans & History) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-agri-100 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-agri-dark flex items-center gap-2">
                <History className="w-5 h-5 text-agri-600" />
                <span>{t('dashboard.recentScans')}</span>
              </h3>
              <Link
                to="/history"
                className="text-xs font-semibold text-agri-600 hover:text-agri-700 flex items-center gap-1"
              >
                <span>{t('dashboard.viewAll')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isScansLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 bg-agri-50 rounded-2xl"></div>
                ))}
              </div>
            ) : recentScans.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-agri-100 rounded-2xl">
                <ScanLine className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-4">{t('dashboard.noScans')}</p>
                <Link
                  to="/scan"
                  className="inline-flex items-center gap-2 py-2 px-4 bg-agri-600 hover:bg-agri-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>Scan Your First Leaf</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentScans.map((scan) => {
                  const isHealthy = scan.healthStatus === 'Healthy';
                  return (
                    <Link
                      key={scan._id}
                      to={`/history/${scan._id}`}
                      className="flex items-center gap-3.5 p-3 rounded-2xl border border-gray-100 hover:border-agri-200 hover:bg-agri-50/50 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                        {scan.imageUrl ? (
                          <img
                            src={scan.imageUrl}
                            alt="Crop leaf thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                            N/A
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-agri-dark truncate">
                            {scan.crop?.name}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isHealthy
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {scan.healthStatus}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 truncate">
                          {scan.disease?.name}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(scan.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Location Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-agri-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-agri-dark flex items-center gap-2">
                <MapPin className="w-5 h-5 text-agri-600" />
                <span>Search Farm Location</span>
              </h3>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* One-Click GPS Detection Button */}
            <button
              type="button"
              onClick={handleDetectGpsLocation}
              disabled={isDetectingGps}
              className="w-full mb-4 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs group"
            >
              <LocateFixed className={`w-4 h-4 text-emerald-600 ${isDetectingGps ? 'animate-spin' : 'group-hover:scale-110'}`} />
              <span>{isDetectingGps ? 'Detecting Live GPS Position...' : '📍 Use My Live Mobile Location (GPS)'}</span>
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">or search by name</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <form onSubmit={handleLocationSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city, district, or town (e.g. Hyderabad)..."
                className="flex-1 py-2.5 px-3.5 text-xs bg-cream-50 border border-agri-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-agri-500"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="py-2.5 px-4 bg-agri-600 hover:bg-agri-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                {isSearching ? <Search className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{isSearching ? 'Searching...' : 'Search'}</span>
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="text-center py-6 text-xs text-agri-600 animate-pulse">
                  Searching location database...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectLocation(loc)}
                    className="w-full p-2.5 text-left text-xs bg-cream-50 hover:bg-agri-100 rounded-xl border border-cream-200 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium text-agri-900 truncate">{loc.name}</span>
                    <span className="text-[10px] text-gray-400 ml-2">Select</span>
                  </button>
                ))
              ) : searchQuery.length >= 2 ? (
                <div className="text-center py-6 text-xs text-gray-400">
                  No matching cities found. Try typing another district or click "Use Live Mobile Location" above.
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-gray-400">
                  Type a district or city (e.g. "Hyderabad", "Vijayawada", "Guntur", "Indore") and click Search.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
