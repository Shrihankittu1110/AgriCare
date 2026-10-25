import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, Thermometer, MapPin, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const WeatherWidget = ({ weather, onRefresh, isRefreshing = false, onOpenSearch, className = '' }) => {
  const { t } = useTranslation();

  if (!weather || !weather.current) {
    return (
      <div className={`p-6 bg-white rounded-3xl border border-agri-100 shadow-card ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-500">Weather Unavailable</span>
          {onRefresh && (
            <button onClick={onRefresh} className="p-2 text-agri-600 hover:bg-agri-50 rounded-xl">
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500">Unable to load meteorological data. Click refresh to retry.</p>
      </div>
    );
  }

  const { current, location, provider } = weather;

  const renderWeatherIcon = (desc = '') => {
    const d = desc.toLowerCase();
    if (d.includes('rain') || d.includes('shower') || d.includes('drizzle')) {
      return <CloudRain className="w-10 h-10 text-blue-500" />;
    }
    if (d.includes('thunder') || d.includes('lightning')) {
      return <CloudLightning className="w-10 h-10 text-amber-500" />;
    }
    if (d.includes('cloud') || d.includes('overcast')) {
      return <Cloud className="w-10 h-10 text-gray-400" />;
    }
    return <Sun className="w-10 h-10 text-amber-400" />;
  };

  return (
    <div className={`p-6 bg-gradient-to-br from-white to-agri-50/50 rounded-3xl border border-agri-100 shadow-card transition-all ${className}`}>
      {/* Location header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-agri-800 hover:text-agri-900 group"
          title="Click to change location"
        >
          <MapPin className="w-4 h-4 text-agri-600 group-hover:scale-110 transition-transform" />
          <span className="truncate max-w-[200px]">{location?.name || 'Farm Location'}</span>
          <span className="text-[10px] text-agri-600 underline ml-1">Change</span>
        </button>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 text-agri-600 hover:bg-agri-100 rounded-xl transition-all"
            title="Refresh Weather Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Main Temp & Condition */}
      <div className="flex items-center justify-between pb-5 border-b border-agri-100/80">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-agri-100/60">
            {renderWeatherIcon(current.description)}
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-agri-dark tracking-tight">
              {current.temperature}°C
            </div>
            <div className="text-xs sm:text-sm font-medium text-agri-700 capitalize">
              {current.description}
            </div>
          </div>
        </div>

        <div className="text-right text-xs text-gray-500">
          <div>{t('weather.feelsLike')}</div>
          <div className="text-sm font-bold text-agri-900">{current.feelsLike}°C</div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 pt-4 text-center">
        <div className="bg-white/80 p-2.5 rounded-2xl border border-agri-50">
          <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <div className="text-[10px] text-gray-500">{t('weather.humidity')}</div>
          <div className="text-xs sm:text-sm font-bold text-agri-900">{current.humidity}%</div>
        </div>

        <div className="bg-white/80 p-2.5 rounded-2xl border border-agri-50">
          <Wind className="w-4 h-4 text-teal-600 mx-auto mb-1" />
          <div className="text-[10px] text-gray-500">{t('weather.windSpeed')}</div>
          <div className="text-xs sm:text-sm font-bold text-agri-900">{current.windSpeed} km/h</div>
        </div>

        <div className="bg-white/80 p-2.5 rounded-2xl border border-agri-50">
          <CloudRain className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
          <div className="text-[10px] text-gray-500">{t('weather.precipitation')}</div>
          <div className="text-xs sm:text-sm font-bold text-agri-900">{current.precipitation} mm</div>
        </div>
      </div>

      {/* Provider badge */}
      <div className="mt-4 pt-3 border-t border-agri-100/50 flex items-center justify-between text-[11px] text-gray-400">
        <span>Verified Provider:</span>
        <span className="font-semibold text-agri-700">{provider}</span>
      </div>
    </div>
  );
};
