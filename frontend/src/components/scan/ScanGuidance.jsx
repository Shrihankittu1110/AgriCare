import React from 'react';
import { SunMedium, Focus, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ScanGuidance = () => {
  const { t } = useTranslation();

  const guidelines = [
    {
      Icon: SunMedium,
      title: 'Good Daylight',
      desc: 'Capture under natural outdoor lighting. Avoid direct lens glare or dark shadows.',
    },
    {
      Icon: Focus,
      title: 'Focus on Symptoms',
      desc: 'Point directly at the infected leaf showing discoloration, spots, or curling.',
    },
    {
      Icon: Sparkles,
      title: 'Steady & Sharp',
      desc: 'Hold camera steady 15–25 cm away so leaf venation and lesions are crisp.',
    },
  ];

  return (
    <div className="bg-cream-100/80 border border-cream-200/90 rounded-3xl p-5 sm:p-6 shadow-sm">
      <h4 className="text-sm font-bold text-agri-900 mb-3 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-agri-600" />
        <span>{t('scan.instructionsTitle')}</span>
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {guidelines.map((item, idx) => {
          const { Icon, title, desc } = item;
          return (
            <div key={idx} className="bg-white/80 p-3.5 rounded-2xl border border-cream-200 flex flex-col">
              <div className="w-8 h-8 rounded-xl bg-agri-100 text-agri-700 flex items-center justify-center mb-2">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-agri-900 mb-1">{title}</div>
              <div className="text-[11px] text-gray-500 leading-relaxed">{desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
