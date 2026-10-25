import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const WeatherForecastCard = ({ forecast = [] }) => {
  const { t } = useTranslation();

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const renderIcon = (desc = '') => {
    const d = desc.toLowerCase();
    if (d.includes('rain') || d.includes('shower') || d.includes('drizzle')) {
      return <CloudRain className="w-6 h-6 text-blue-500" />;
    }
    if (d.includes('thunder') || d.includes('lightning')) {
      return <CloudLightning className="w-6 h-6 text-amber-500" />;
    }
    if (d.includes('cloud') || d.includes('overcast')) {
      return <Cloud className="w-6 h-6 text-gray-400" />;
    }
    return <Sun className="w-6 h-6 text-amber-400" />;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-agri-100 shadow-card">
      <h3 className="text-base sm:text-lg font-bold text-agri-dark mb-4 flex items-center justify-between">
        <span>{t('weather.forecast')}</span>
        <span className="text-xs font-normal text-gray-500">7-Day Outlook</span>
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {forecast.map((day, idx) => (
          <div
            key={day.date || idx}
            className={`p-3.5 rounded-2xl flex flex-col items-center text-center transition-all ${
              idx === 0
                ? 'bg-agri-50 border border-agri-200/80 shadow-sm'
                : 'bg-cream-50/70 border border-cream-200 hover:bg-white'
            }`}
          >
            <div className="text-xs font-bold text-agri-900 mb-1">
              {idx === 0 ? 'Today' : getDayName(day.date)}
            </div>

            <div className="my-2 p-1.5 bg-white rounded-xl shadow-xs">
              {renderIcon(day.description)}
            </div>

            <div className="text-[11px] text-gray-500 capitalize line-clamp-1 h-4 mb-2">
              {day.description}
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span className="text-agri-dark font-bold">{day.tempMax}°</span>
              <span className="text-gray-400 font-normal">{day.tempMin}°</span>
            </div>

            {day.precipitationProbability > 0 && (
              <div className="mt-2 text-[10px] text-blue-600 font-medium flex items-center gap-0.5">
                <CloudRain className="w-3 h-3" />
                <span>{day.precipitationProbability}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
