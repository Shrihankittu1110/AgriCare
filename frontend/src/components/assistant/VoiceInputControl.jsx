import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { PermissionModal } from '../common/PermissionModal';

export const VoiceInputControl = ({ onTranscriptReady, currentText = '', onTextChange }) => {
  const { t, i18n } = useTranslation();
  const { isListening, transcript, error, isSupported, startListening, stopListening, resetTranscript } =
    useSpeechRecognition(i18n.language);

  const [permissionModalOpen, setPermissionModalOpen] = useState(false);

  // When speech transcript updates, pass to parent input so farmer can edit before sending
  useEffect(() => {
    if (transcript && transcript.trim()) {
      if (onTextChange) {
        onTextChange(transcript);
      }
    }
  }, [transcript, onTextChange]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      if (transcript && onTranscriptReady) {
        onTranscriptReady(transcript);
      }
    } else {
      // Check if user has previously allowed microphone or show friendly prompt
      const hasAsked = localStorage.getItem('agricare_mic_permission_prompted');
      if (!hasAsked) {
        setPermissionModalOpen(true);
      } else {
        startListening();
      }
    }
  };

  const handleAllowPermission = () => {
    localStorage.setItem('agricare_mic_permission_prompted', 'true');
    setPermissionModalOpen(false);
    startListening();
  };

  const handleDenyPermission = () => {
    localStorage.setItem('agricare_mic_permission_prompted', 'true');
    setPermissionModalOpen(false);
  };

  if (!isSupported) {
    return null; // Graceful fallback: text input remains fully functional
  }

  return (
    <>
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={handleMicClick}
          className={`p-2.5 rounded-2xl transition-all shadow-sm ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-red-200'
              : 'bg-agri-100 text-agri-800 hover:bg-agri-200'
          }`}
          title={isListening ? t('assistant.stopListening') : 'Speak your question'}
          aria-label={isListening ? 'Stop Listening' : 'Voice Input'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {isListening && (
          <div className="absolute bottom-12 right-0 bg-neutral-900 text-white text-xs px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2 whitespace-nowrap z-30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>{t('assistant.listening')}</span>
            <button
              type="button"
              onClick={stopListening}
              className="ml-2 font-bold underline text-red-400"
            >
              Done
            </button>
          </div>
        )}
      </div>

      <PermissionModal
        isOpen={permissionModalOpen}
        type="microphone"
        onAllow={handleAllowPermission}
        onDeny={handleDenyPermission}
        onClose={() => setPermissionModalOpen(false)}
      />
    </>
  );
};
