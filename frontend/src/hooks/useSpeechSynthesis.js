import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTextId, setActiveTextId] = useState(null);
  const [voices, setVoices] = useState([]);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    } else {
      setIsSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (text, language = 'en', textId = null) => {
      if (!('speechSynthesis' in window)) return;

      // Stop any existing speech before starting new speech
      window.speechSynthesis.cancel();

      if (!text || text.trim() === '') return;

      // Clean markdown characters from spoken text so it speaks cleanly
      const cleanText = text
        .replace(/[*#_`~>]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\n+/g, '. ');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utteranceRef.current = utterance;

      const langMap = {
        en: ['en-IN', 'en-US', 'en-GB'],
        te: ['te-IN', 'te'],
        hi: ['hi-IN', 'hi'],
      };

      const preferredLangs = langMap[language] || ['en-IN', 'en-US'];

      // Find matching voice
      const matchedVoice = voices.find((v) =>
        preferredLangs.some((pref) => v.lang.toLowerCase().startsWith(pref.toLowerCase()))
      );

      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = preferredLangs[0];
      }

      utterance.rate = 0.95; // Slightly slower for clear agricultural comprehension
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setActiveTextId(textId);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setActiveTextId(null);
      };

      utterance.onerror = (e) => {
        console.warn('[SpeechSynthesis] Error:', e);
        setIsSpeaking(false);
        setActiveTextId(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [voices]
  );

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveTextId(null);
  }, []);

  return {
    isSpeaking,
    activeTextId,
    isSupported,
    speak,
    stop,
  };
};
