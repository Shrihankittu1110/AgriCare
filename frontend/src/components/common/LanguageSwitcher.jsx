import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
];

export const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = async (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);

    // If user is logged in, persist to backend profile
    if (user) {
      try {
        await authService.updateProfile({ preferredLanguage: code });
        updateUser({ preferredLanguage: code });
      } catch (e) {
        console.warn('Failed to persist language preference on backend:', e);
      }
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-agri-900 bg-white hover:bg-agri-50 border border-agri-200 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-agri-500"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-agri-600" />
        <span>{currentLang.native}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-soft-lg border border-agri-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
            Select Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-left transition-colors hover:bg-agri-50 ${
                i18n.language === lang.code ? 'font-semibold text-agri-800 bg-agri-50/60' : 'text-gray-700'
              }`}
            >
              <div>
                <span className="block">{lang.native}</span>
                <span className="text-xs text-gray-400">{lang.label}</span>
              </div>
              {i18n.language === lang.code && <Check className="w-4 h-4 text-agri-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
