import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  Bug,
  HelpCircle,
  Activity,
  Calendar,
  CloudSun,
  Bot,
  Printer,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ScanResultCard = ({ scan, onScanAnother }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cultural'); // 'cultural' | 'organic' | 'preventive'

  if (!scan) return null;

  const {
    crop,
    disease,
    healthStatus,
    confidenceScore,
    severityEstimate,
    visibleSymptoms = [],
    likelyCauses = [],
    recommendations = {},
    weatherContext,
    expertConsultationNote,
    disclaimer,
    imageUrl,
    providerMetadata,
    createdAt,
  } = scan;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Healthy':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
          label: 'Healthy Canopy',
        };
      case 'Suspected Disease':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          label: 'Suspected Disease',
        };
      case 'Pest Damage':
        return {
          bg: 'bg-orange-100 text-orange-800 border-orange-300',
          icon: <Bug className="w-4 h-4 text-orange-600" />,
          label: 'Pest Infestation',
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: <HelpCircle className="w-4 h-4 text-gray-500" />,
          label: status || 'Preliminary',
        };
    }
  };

  const badge = getStatusBadge(healthStatus);

  const handleAskAssistant = () => {
    navigate('/assistant', {
      state: {
        cropScanId: scan._id,
        cropContext: {
          cropName: crop?.name,
          diseaseName: disease?.name,
          healthStatus: healthStatus,
        },
      },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-agri-100 shadow-soft-lg overflow-hidden transition-all">
      {/* Top Banner / Demo Notice */}
      {providerMetadata?.isDemoMode && (
        <div className="bg-amber-500/10 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="font-semibold">Development / Demonstration Mode:</span>
            <span>Preliminary simulated pathology analysis.</span>
          </div>
          <span className="hidden sm:inline-block bg-amber-200/80 px-2 py-0.5 rounded text-[10px] font-bold">
            DEMO
          </span>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="p-6 sm:p-8">
        {/* Header: Photo + Overview */}
        <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-agri-100">
          {/* Leaf Photo */}
          <div className="w-full md:w-56 h-56 rounded-2xl overflow-hidden bg-gray-100 border border-agri-200 flex-shrink-0 relative shadow-sm">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Analyzed leaf specimen"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Preview
              </div>
            )}
            <div className="absolute top-2.5 left-2.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${badge.bg}`}>
                {badge.icon}
                <span>{badge.label}</span>
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Diagnostic Assessment ID: {scan._id?.slice(-8)}</span>
                {createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-dark tracking-tight mb-1">
                {crop?.name || 'Crop Leaf'} — <span className="text-agri-700">{disease?.name || 'Observation'}</span>
              </h2>

              {(crop?.scientificName || disease?.scientificName) && (
                <p className="text-xs italic text-gray-500 mb-4">
                  {crop?.scientificName} {disease?.scientificName && `• Pathogen: ${disease.scientificName}`}
                </p>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                <div className="bg-agri-50/70 p-3 rounded-2xl border border-agri-100">
                  <div className="text-[11px] text-gray-500 font-medium">{t('scan.result.confidence')}</div>
                  <div className="text-lg font-bold text-agri-900 flex items-center gap-2">
                    {confidenceScore}%
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-agri-600 h-full rounded-full transition-all"
                      style={{ width: `${confidenceScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-agri-50/70 p-3 rounded-2xl border border-agri-100">
                  <div className="text-[11px] text-gray-500 font-medium">{t('scan.result.severity')}</div>
                  <div className="text-lg font-bold text-agri-900">{severityEstimate || 'Moderate'}</div>
                  <div className="text-[10px] text-agri-600 mt-1">Canopy Evaluation</div>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-agri-50/70 p-3 rounded-2xl border border-agri-100">
                  <div className="text-[11px] text-gray-500 font-medium">Model / Provider</div>
                  <div className="text-xs font-bold text-agri-900 truncate">
                    {providerMetadata?.model || 'AgriPath-v1'}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {providerMetadata?.provider || 'Vision AI'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleAskAssistant}
                className="flex items-center gap-2 py-2.5 px-4 bg-agri-600 hover:bg-agri-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI Agronomist About This</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>

              {onScanAnother && (
                <button
                  onClick={onScanAnother}
                  className="py-2.5 px-4 text-xs font-semibold text-agri-700 hover:bg-agri-50 rounded-xl transition-all ml-auto"
                >
                  Scan Another Leaf
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Symptoms & Causes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-agri-100">
          <div>
            <h4 className="text-sm font-bold text-agri-900 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-agri-600" />
              <span>{t('scan.result.symptoms')}</span>
            </h4>
            <ul className="space-y-2">
              {visibleSymptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-agri-500 flex-shrink-0 mt-1.5"></div>
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-agri-900 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>{t('scan.result.causes')}</span>
            </h4>
            <ul className="space-y-2">
              {likelyCauses.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5"></div>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tabbed Recommendations */}
        <div className="py-6 border-b border-agri-100">
          <h4 className="text-base font-bold text-agri-dark mb-4">
            {t('scan.result.recommendations')}
          </h4>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-4 gap-2">
            <button
              onClick={() => setActiveTab('cultural')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'cultural'
                  ? 'border-agri-600 text-agri-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Cultural & Field Practices
            </button>
            <button
              onClick={() => setActiveTab('organic')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'organic'
                  ? 'border-agri-600 text-agri-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Organic & Bio-Remedies
            </button>
            <button
              onClick={() => setActiveTab('preventive')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'preventive'
                  ? 'border-agri-600 text-agri-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Long-term Prevention
            </button>
          </div>

          {/* Active Tab Content */}
          <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200">
            {activeTab === 'cultural' && (
              <ul className="space-y-2">
                {(recommendations.cultural || []).map((rec, i) => (
                  <li key={i} className="text-xs text-agri-900 flex items-start gap-2">
                    <span className="font-bold text-agri-600">{i + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'organic' && (
              <ul className="space-y-2">
                {(recommendations.organic || []).map((rec, i) => (
                  <li key={i} className="text-xs text-agri-900 flex items-start gap-2">
                    <span className="font-bold text-agri-600">{i + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'preventive' && (
              <ul className="space-y-2">
                {(recommendations.preventive || []).map((rec, i) => (
                  <li key={i} className="text-xs text-agri-900 flex items-start gap-2">
                    <span className="font-bold text-agri-600">{i + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}

            {recommendations.cautiousChemicalNotes && recommendations.cautiousChemicalNotes.length > 0 && (
              <div className="mt-4 pt-3 border-t border-cream-300/80 text-[11px] text-gray-600 bg-white/70 p-3 rounded-xl border border-cream-200">
                <span className="font-bold text-red-700 block mb-1">Cautious Chemical Management:</span>
                {recommendations.cautiousChemicalNotes.map((note, i) => (
                  <p key={i}>{note}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weather Context & Expert Escalation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {weatherContext && weatherContext.temperature && (
            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
                <CloudSun className="w-4 h-4 text-blue-600" />
                <span>{t('scan.result.weatherConsiderations')}</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                {weatherContext.weatherAssessment ||
                  `Recorded at ${weatherContext.temperature}°C, ${weatherContext.humidity}% humidity.`}
              </p>
            </div>
          )}

          {expertConsultationNote && (
            <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{t('scan.result.expertEscalation')}</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">{expertConsultationNote}</p>
            </div>
          )}
        </div>

        {/* Mandatory Disclaimer */}
        <div className="mt-4 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-500 leading-relaxed">
          <span className="font-bold text-gray-700 block mb-0.5">Agricultural Disclaimer:</span>
          {disclaimer || t('scan.result.disclaimer')}
        </div>
      </div>
    </div>
  );
};
