import React from 'react';
import { AlertTriangle, Info, CheckCircle2, CloudRain, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const WeatherAgronomyAlerts = ({ alerts = [] }) => {
  const { t } = useTranslation();

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-agri-100 shadow-card">
      <h3 className="text-base sm:text-lg font-bold text-agri-dark mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-accent-amber" />
        <span>{t('weather.alerts')}</span>
      </h3>

      <div className="space-y-3.5">
        {alerts.map((alert, idx) => {
          let border = 'border-amber-200 bg-amber-50/70 text-amber-900';
          let icon = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />;

          if (alert.type === 'caution') {
            border = 'border-orange-200 bg-orange-50/70 text-orange-900';
            icon = <CloudRain className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />;
          } else if (alert.type === 'success') {
            border = 'border-emerald-200 bg-emerald-50/70 text-emerald-900';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />;
          } else if (alert.type === 'info') {
            border = 'border-blue-200 bg-blue-50/70 text-blue-900';
            icon = <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />;
          }

          return (
            <div key={alert.id || idx} className={`p-4 rounded-2xl border transition-all ${border}`}>
              <div className="flex items-start gap-3">
                {icon}
                <div className="flex-1">
                  <h4 className="text-sm font-bold mb-1">{alert.title}</h4>
                  <p className="text-xs leading-relaxed opacity-90 mb-2">{alert.message}</p>
                  {alert.actionableAdvice && (
                    <div className="text-xs font-semibold bg-white/70 p-2 rounded-xl border border-black/5 flex items-center gap-1.5">
                      <span className="text-agri-800">Action:</span>
                      <span>{alert.actionableAdvice}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
