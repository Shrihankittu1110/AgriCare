import React from 'react';
import { Camera, Mic, MapPin, X, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PermissionModal = ({ isOpen, type, onAllow, onDeny, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const config = {
    camera: {
      Icon: Camera,
      title: t('permissions.cameraTitle'),
      desc: t('permissions.cameraDesc'),
      fallbackNote: 'You can also upload photos from your phone or computer gallery anytime.',
      color: 'bg-emerald-100 text-emerald-700',
    },
    microphone: {
      Icon: Mic,
      title: t('permissions.micTitle'),
      desc: t('permissions.micDesc'),
      fallbackNote: 'You can always type your questions using the normal text keyboard.',
      color: 'bg-blue-100 text-blue-700',
    },
    location: {
      Icon: MapPin,
      title: t('permissions.locTitle'),
      desc: t('permissions.locDesc'),
      fallbackNote: 'You can also search and enter your district or village manually without sharing GPS.',
      color: 'bg-amber-100 text-amber-700',
    },
  }[type] || {
    Icon: ShieldCheck,
    title: 'Permission Request',
    desc: 'Please allow access to use this feature.',
    fallbackNote: '',
    color: 'bg-gray-100 text-gray-700',
  };

  const { Icon, title, desc, fallbackNote, color } = config;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-agri-100 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
            <Icon className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-agri-dark mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>

          {fallbackNote && (
            <div className="w-full bg-cream-100 border border-cream-300 rounded-xl p-3 text-xs text-agri-800 text-left mb-6">
              <span className="font-semibold block mb-0.5">Privacy Notice:</span>
              {fallbackNote}
            </div>
          )}

          <div className="w-full flex flex-col sm:flex-row gap-3">
            <button
              onClick={onAllow}
              className="flex-1 py-3 px-4 bg-agri-600 hover:bg-agri-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              {t('permissions.allow')}
            </button>
            <button
              onClick={onDeny}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
            >
              {t('permissions.deny')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
