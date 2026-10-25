import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ScanLine, CloudSun, Bot, History } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-agri-100 px-3 py-2 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-agri-700' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>{t('nav.dashboard')}</span>
        </NavLink>

        <NavLink
          to="/weather"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-agri-700' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <CloudSun className="w-5 h-5" />
          <span>{t('nav.weather')}</span>
        </NavLink>

        {/* Center Prominent Scan Button */}
        <NavLink
          to="/scan"
          className={({ isActive }) =>
            `flex flex-col items-center -mt-6 group focus:outline-none`
          }
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-agri-600 to-agri-500 text-white shadow-soft-lg flex items-center justify-center border-4 border-white transition-transform group-active:scale-95">
            <ScanLine className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[11px] font-bold text-agri-700 mt-1">
            {t('nav.scan')}
          </span>
        </NavLink>

        <NavLink
          to="/assistant"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-agri-700' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <Bot className="w-5 h-5" />
          <span>{t('nav.assistant')}</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-agri-700' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <History className="w-5 h-5" />
          <span>{t('nav.history')}</span>
        </NavLink>
      </div>
    </div>
  );
};
