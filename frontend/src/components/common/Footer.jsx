import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, PhoneCall, ShieldAlert, Heart, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-agri-900 text-cream-100 border-t border-agri-800 pt-12 pb-16 md:pb-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-agri-800/80">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-agri-500 flex items-center justify-center text-white">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                AgriCare <span className="text-agri-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-cream-200/80 leading-relaxed">
              Empowering farmers across India with AI leaf health diagnostics, localized weather risk forecasts, and practical agronomic guidance in English, Telugu, and Hindi.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-agri-300 mb-4">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-200/80">
              <li>
                <Link to="/scan" className="hover:text-white transition-colors">
                  Leaf Disease Scan
                </Link>
              </li>
              <li>
                <Link to="/weather" className="hover:text-white transition-colors">
                  7-Day Agricultural Weather
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-white transition-colors">
                  Voice Agronomist Assistant
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition-colors">
                  Field Health History
                </Link>
              </li>
            </ul>
          </div>

          {/* Farmer Emergency Helplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-agri-300 mb-4 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-accent-amber" />
              National Farmer Helplines
            </h4>
            <div className="space-y-3 text-sm text-cream-200/90">
              <div className="bg-agri-800/60 p-3 rounded-xl border border-agri-700/50">
                <div className="text-xs text-agri-300 font-semibold">Kisan Call Center (Govt. of India)</div>
                <div className="text-base font-bold text-accent-gold tracking-wide">1800-180-1551</div>
                <div className="text-[11px] text-cream-200/60">Toll-Free (6:00 AM – 10:00 PM)</div>
              </div>
              <div className="text-xs text-cream-200/70">
                Contact your nearest Krishi Vigyan Kendra (KVK) or District Agricultural Officer for critical pest outbreaks.
              </div>
            </div>
          </div>

          {/* Disclaimer & Transparency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-agri-300 mb-4 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-agri-400" />
              Advisory Disclaimer
            </h4>
            <p className="text-xs text-cream-200/70 leading-relaxed mb-3">
              AgriCare AI provides preliminary visual assessments and agronomic recommendations. It does not replace certified laboratory pathology. Always verify chemical treatment labels according to state regulations.
            </p>
            <div className="text-xs text-agri-400 flex items-center gap-1">
              <span>Supports English, తెలుగు, & हिन्दी</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-200/60 gap-4">
          <div>
            © {new Date().getFullYear()} AgriCare AI. Dedicated to Indian Farmers.
          </div>
          <div className="flex items-center gap-1">
            Built with care for a greener tomorrow
          </div>
        </div>
      </div>
    </footer>
  );
};
