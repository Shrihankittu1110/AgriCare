import React from 'react';
import { Volume2, VolumeX, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const VoiceSpeechControl = ({ text, messageId, isSpeaking, activeTextId, onSpeak, onStop }) => {
  const { t, i18n } = useTranslation();

  const isThisMessageSpeaking = isSpeaking && activeTextId === messageId;

  const handleClick = () => {
    if (isThisMessageSpeaking) {
      onStop();
    } else {
      onSpeak(text, i18n.language, messageId);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all shadow-xs ${
        isThisMessageSpeaking
          ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
          : 'bg-white hover:bg-agri-50 text-agri-700 border border-agri-200'
      }`}
      title={isThisMessageSpeaking ? t('assistant.stopSpeaking') : 'Listen to answer'}
      aria-label="Listen to Audio"
    >
      {isThisMessageSpeaking ? (
        <>
          <Square className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
          <span className="text-[11px]">{t('assistant.stopSpeaking')}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-agri-600" />
          <span className="text-[11px]">Listen</span>
        </>
      )}
    </button>
  );
};
