import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CloudSun,
  Search,
  MapPin,
  Droplets,
  Wind,
  CloudRain,
  Thermometer,
  ShieldAlert,
  RefreshCw,
  Sun,
  Gauge,
} from 'lucide-react';
import { weatherService } from '../services/weatherService';
import { WeatherForecastCard } from '../components/weather/WeatherForecastCard';
import { WeatherAgronomyAlerts } from '../components/weather/WeatherAgronomyAlerts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const WeatherPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadWeather = async (lat, lon, name) => {
    setIsLoading(true);
    try {
      const data = await weatherService.getWeather(lat, lon, name);
      if (data.success) {
        setWeather(data.weather);
      }
    } catch (err) {
      console.warn('[WeatherPage] Fetch failed:', err);
      showToast('Could not retrieve weather data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const lat = user?.location?.latitude || 16.3067;
    const lon = user?.location?.longitude || 80.4365;
    const name = user?.location?.name || 'Guntur, Andhra Pradesh';
    loadWeather(lat, lon, name);
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    setIsSearching(true);
    try {
      const data = await weatherService.searchLocations(searchQuery);
      if (data.success) {
        setSearchResults(data.locations || []);
      }
    } catch (err) {
      showToast('Location search failed', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (loc) => {
    setSearchResults([]);
    setSearchQuery(loc.name);
    loadWeather(loc.latitude, loc.longitude, loc.name);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Page Header & Location Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-agri-dark tracking-tight flex items-center gap-2.5">
            <CloudSun className="w-8 h-8 text-agri-600" />
            <span>{t('weather.title')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {t('weather.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('weather.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-agri-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="py-2.5 px-4 bg-agri-600 hover:bg-agri-700 disabled:opacity-50 text-white font-bold rounded-2xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{t('weather.searchBtn')}</span>
            </button>
          </form>

          {/* Autocomplete dropdown results */}
          {searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 z-30 bg-white border border-agri-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in">
              {searchResults.map((loc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectLocation(loc)}
                  className="w-full p-3 text-left text-xs hover:bg-agri-50 border-b border-gray-50 last:border-0 flex items-center justify-between"
                >
                  <span className="font-semibold text-agri-900">{loc.name}</span>
                  <span className="text-[10px] text-gray-400">Select</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-agri-600 mx-auto mb-3" />
          <span className="text-xs text-gray-500">Retrieving meteorological feeds...</span>
        </div>
      ) : weather && weather.current ? (
        <div className="space-y-8">
          {/* Main Weather Hero Card */}
          <div className="bg-gradient-to-br from-agri-800 via-agri-700 to-agri-900 text-white rounded-3xl p-6 sm:p-10 shadow-soft-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/20">
              <div>
                <div className="flex items-center gap-2 text-xs text-cream-200/80 mb-1">
                  <MapPin className="w-4 h-4 text-accent-gold" />
                  <span className="text-sm font-bold text-white">{weather.location?.name}</span>
                </div>
                <div className="text-4xl sm:text-6xl font-black tracking-tight text-white mt-2">
                  {weather.current.temperature}°C
                </div>
                <div className="text-sm sm:text-base font-semibold text-accent-gold capitalize mt-1">
                  {weather.current.description}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 text-right space-y-1">
                <div className="text-xs text-cream-200/70">{t('weather.feelsLike')}</div>
                <div className="text-xl sm:text-2xl font-bold">{weather.current.feelsLike}°C</div>
                <div className="text-[11px] text-cream-200/60 pt-1">
                  Provider: {weather.provider}
                </div>
              </div>
            </div>

            {/* Microclimate Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                <Droplets className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                <div className="text-xs text-cream-200/80">{t('weather.humidity')}</div>
                <div className="text-lg sm:text-xl font-bold mt-1">{weather.current.humidity}%</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                <Wind className="w-6 h-6 text-teal-300 mx-auto mb-2" />
                <div className="text-xs text-cream-200/80">{t('weather.windSpeed')}</div>
                <div className="text-lg sm:text-xl font-bold mt-1">{weather.current.windSpeed} km/h</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                <CloudRain className="w-6 h-6 text-indigo-300 mx-auto mb-2" />
                <div className="text-xs text-cream-200/80">{t('weather.precipitation')}</div>
                <div className="text-lg sm:text-xl font-bold mt-1">{weather.current.precipitation} mm</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                <Sun className="w-6 h-6 text-amber-300 mx-auto mb-2" />
                <div className="text-xs text-cream-200/80">Weather Code</div>
                <div className="text-lg sm:text-xl font-bold mt-1">WMO #{weather.current.weatherCode}</div>
              </div>
            </div>
          </div>

          {/* Agronomy Alerts & Warnings */}
          {weather.agronomyAlerts && weather.agronomyAlerts.length > 0 && (
            <WeatherAgronomyAlerts alerts={weather.agronomyAlerts} />
          )}

          {/* 7-Day Forecast */}
          <WeatherForecastCard forecast={weather.forecast} />
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-agri-100 shadow-card">
          <p className="text-xs text-gray-500">Weather service currently unavailable. Please check your network or API keys.</p>
        </div>
      )}
    </div>
  );
};
