import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ScanLine,
  CloudSun,
  Bot,
  Mic,
  Languages,
  History,
  ShieldCheck,
  Activity,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PhoneCall,
  Leaf,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const handleScanClick = () => {
    if (isAuthenticated) {
      navigate('/scan');
    } else {
      navigate('/register', {
        state: { message: 'Please create a free farmer account to scan and save your crop health records.' },
      });
    }
  };

  const featureCards = [
    {
      icon: <ScanLine className="w-7 h-7 text-emerald-600" />,
      title: t('features.leafDetection.title'),
      desc: t('features.leafDetection.desc'),
      bg: 'bg-emerald-50',
    },
    {
      icon: <Activity className="w-7 h-7 text-teal-600" />,
      title: t('features.cropHealth.title'),
      desc: t('features.cropHealth.desc'),
      bg: 'bg-teal-50',
    },
    {
      icon: <CloudSun className="w-7 h-7 text-blue-600" />,
      title: t('features.localWeather.title'),
      desc: t('features.localWeather.desc'),
      bg: 'bg-blue-50',
    },
    {
      icon: <Bot className="w-7 h-7 text-agri-700" />,
      title: t('features.aiAssistant.title'),
      desc: t('features.aiAssistant.desc'),
      bg: 'bg-agri-50',
    },
    {
      icon: <Mic className="w-7 h-7 text-amber-600" />,
      title: t('features.voiceInteraction.title'),
      desc: t('features.voiceInteraction.desc'),
      bg: 'bg-amber-50',
    },
    {
      icon: <Languages className="w-7 h-7 text-indigo-600" />,
      title: t('features.multilingual.title'),
      desc: t('features.multilingual.desc'),
      bg: 'bg-indigo-50',
    },
    {
      icon: <History className="w-7 h-7 text-purple-600" />,
      title: t('features.history.title'),
      desc: t('features.history.desc'),
      bg: 'bg-purple-50',
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-emerald-700" />,
      title: t('features.preventive.title'),
      desc: t('features.preventive.desc'),
      bg: 'bg-emerald-50',
    },
  ];

  const faqs = [
    {
      q: 'How does AgriCare AI detect leaf diseases?',
      a: 'AgriCare AI uses deep vision neural models trained on plant pathology datasets. It analyzes foliar lesion shapes, yellow halos (chlorosis), discoloration, and necrosis patterns to provide preliminary disease assessments and verified cultural remedies.',
    },
    {
      q: 'Which languages are supported?',
      a: 'AgriCare AI natively supports English, Telugu (తెలుగు), and Hindi (हिन्दी) across the entire platform, including user interface text, AI agronomic guidance, and voice speech.',
    },
    {
      q: 'Does it work if I don’t have an active internet connection or high-end smartphone?',
      a: 'AgriCare AI is designed mobile-first and works across standard smartphone browsers. We also provide offline-resilient demo models and graceful fallbacks so you can test and explore features smoothly.',
    },
    {
      q: 'Are the chemical pesticide recommendations safe?',
      a: 'Yes. AgriCare AI enforces a strict conservative agronomic policy prioritizing cultural hygiene, biological treatments (such as Neem and Trichoderma), and preventive crop rotation. Any synthetic chemical advice strictly directs farmers to consult local agricultural extension officers (KVK/ICAR) and follow certified government product labels.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-12 sm:pb-20 bg-gradient-to-b from-cream-100 via-cream-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-100 border border-agri-200 text-agri-800 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-agri-600" />
                <span>{t('hero.tag')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-agri-dark tracking-tight leading-[1.15]">
                {t('hero.title')}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleScanClick}
                  className="w-full sm:w-auto px-7 py-3.5 bg-agri-600 hover:bg-agri-700 text-white font-bold rounded-2xl shadow-soft hover:shadow-soft-lg transition-all active:scale-95 flex items-center justify-center gap-2.5"
                >
                  <ScanLine className="w-5 h-5" />
                  <span>{t('hero.scanCrop')}</span>
                </button>

                <a
                  href="#features"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-cream-100 text-agri-900 font-bold rounded-2xl border border-agri-200 shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>{t('hero.exploreFeatures')}</span>
                  <ArrowRight className="w-4 h-4 text-agri-600" />
                </a>
              </div>

              {/* Trust Badge */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-xs text-agri-800 font-medium">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
                    TN
                  </div>
                  <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
                    AP
                  </div>
                  <div className="w-7 h-7 rounded-full bg-agri-700 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
                    MH
                  </div>
                </div>
                <span>{t('hero.badge')}</span>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-soft-lg border border-agri-100">
                {/* Visual Leaf Specimen Card */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 to-agri-200 relative mb-5 flex items-center justify-center shadow-inner">
                  <div className="absolute inset-0 bg-[radial-gradient(#154F24_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
                  <div className="text-center p-6 z-10">
                    <Leaf className="w-16 h-16 text-agri-700 mx-auto mb-2 animate-bounce" />
                    <span className="text-xs font-bold text-agri-900 uppercase tracking-wider block">
                      Tomato Leaf Sample
                    </span>
                    <span className="text-[11px] text-agri-700">Early Blight (Alternaria solani)</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-800 border border-amber-200">
                    Confidence: 91%
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400">Diagnosis</div>
                      <div className="text-base font-bold text-agri-dark">Alternaria solani (Early Blight)</div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg">
                      Moderate
                    </span>
                  </div>

                  <div className="p-3 bg-agri-50 rounded-xl text-xs text-agri-900 leading-relaxed border border-agri-100">
                    <span className="font-bold">Agronomic Advisory:</span> Prune lower 30 cm canopy leaves to improve air flow. Avoid overhead irrigation.
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                    <span>Environmental: 26°C • 82% Humidity</span>
                    <span className="text-agri-600 font-semibold">Available in Telugu & Hindi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 FEATURE CARDS */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-agri-dark tracking-tight mb-3">
            {t('features.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-3xl border border-agri-100 shadow-card hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl ${feat.bg} flex items-center justify-center mb-5`}>
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-agri-dark mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS (4 SIMPLE STEPS) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-agri-900 via-agri-800 to-agri-dark rounded-3xl p-8 sm:p-14 text-white shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-cream-50">
              {t('howItWorks.title')}
            </h2>
            <p className="text-sm sm:text-base text-cream-200/80">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-agri-700/80 border border-agri-500/40 text-accent-gold flex items-center justify-center font-black text-xl">
                1
              </div>
              <h3 className="text-base font-bold text-white">{t('howItWorks.step1.title')}</h3>
              <p className="text-xs text-cream-200/70 leading-relaxed">{t('howItWorks.step1.desc')}</p>
            </div>

            <div className="relative space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-agri-700/80 border border-agri-500/40 text-accent-gold flex items-center justify-center font-black text-xl">
                2
              </div>
              <h3 className="text-base font-bold text-white">{t('howItWorks.step2.title')}</h3>
              <p className="text-xs text-cream-200/70 leading-relaxed">{t('howItWorks.step2.desc')}</p>
            </div>

            <div className="relative space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-agri-700/80 border border-agri-500/40 text-accent-gold flex items-center justify-center font-black text-xl">
                3
              </div>
              <h3 className="text-base font-bold text-white">{t('howItWorks.step3.title')}</h3>
              <p className="text-xs text-cream-200/70 leading-relaxed">{t('howItWorks.step3.desc')}</p>
            </div>

            <div className="relative space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-agri-700/80 border border-agri-500/40 text-accent-gold flex items-center justify-center font-black text-xl">
                4
              </div>
              <h3 className="text-base font-bold text-white">{t('howItWorks.step4.title')}</h3>
              <p className="text-xs text-cream-200/70 leading-relaxed">{t('howItWorks.step4.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* REGIONAL FARMER BENEFITS */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-agri-600 uppercase tracking-wider">
              Farmer-First Agronomy
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-agri-dark tracking-tight">
              Designed for Smallholders, Commercial Growers & Agricultural Officers
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Plant diseases cause significant yield loss annually across Indian agriculture. AgriCare AI bridges the gap between laboratory pathology research and rural farming reality through instant AI diagnostics on everyday smartphones.
            </p>

            <div className="space-y-3">
              {[
                'Instant leaf scanning with immediate disease probability scoring',
                'Weather risk alerts warning when high humidity promotes fungal spores',
                'Speak and listen naturally in Telugu (తెలుగు), Hindi (हिन्दी), or English',
                'Conservative IPM guidance prioritizing biological neem and cultural spacing',
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-agri-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-agri-600 hover:bg-agri-700 text-white font-bold rounded-xl shadow-md transition-all"
              >
                <span>Create Free Farmer Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-cream-100/90 rounded-3xl p-6 sm:p-8 border border-cream-300/80 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-agri-dark">
              Supported Agricultural Diagnostics
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-cream-200">
                <span className="font-bold text-agri-900 block mb-1">Tomato (టమోటా / टमाटर)</span>
                <span className="text-gray-500">Early Blight, Late Blight, Leaf Mold, Bacterial Spot</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-cream-200">
                <span className="font-bold text-agri-900 block mb-1">Cotton (పత్తి / कपास)</span>
                <span className="text-gray-500">Leaf Curl Virus, Bacterial Blight, Grey Mildew</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-cream-200">
                <span className="font-bold text-agri-900 block mb-1">Rice / Paddy (వరి / धान)</span>
                <span className="text-gray-500">Blast, Brown Spot, Bacterial Leaf Blight, Sheath Rot</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-cream-200">
                <span className="font-bold text-agri-900 block mb-1">Potato (బంగాళాదుంప / आलू)</span>
                <span className="text-gray-500">Late Blight, Early Blight, Black Scurf</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-cream-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-agri-900 block">Kisan Call Center Integration</span>
                <span className="text-[11px] text-gray-500">Toll-free advisory 1800-180-1551</span>
              </div>
              <PhoneCall className="w-5 h-5 text-accent-amber" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-dark tracking-tight mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Answers to common queries regarding AI accuracy, languages, and weather alerts.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-agri-100 overflow-hidden shadow-card transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-sm text-agri-dark hover:bg-agri-50/50"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-agri-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
