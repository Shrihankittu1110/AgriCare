import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Sparkles, AlertCircle, Sprout, CornerDownLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { VoiceInputControl } from './VoiceInputControl';
import { VoiceSpeechControl } from './VoiceSpeechControl';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

export const ChatWindow = ({
  messages = [],
  onSendMessage,
  onClearConversation,
  isLoading = false,
  cropContext = null,
  onClearCropContext,
}) => {
  const { t, i18n } = useTranslation();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const { isSpeaking, activeTextId, speak, stop } = useSpeechSynthesis();

  const suggestedQuestions = [
    'Why are my crop leaves turning yellow?',
    'What should I check after heavy rainfall?',
    'How can I improve soil health?',
    'What can I do to prevent leaf spots from spreading?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    onSendMessage(inputText);
    setInputText('');
  };

  const handleSuggestedClick = (q) => {
    onSendMessage(q);
  };

  return (
    <div className="flex flex-col h-[75vh] min-h-[500px] bg-white rounded-3xl border border-agri-100 shadow-card overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-agri-100 bg-gradient-to-r from-agri-50/60 to-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-agri-500 to-agri-700 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-agri-dark">
              {t('assistant.title')}
            </h3>
            <span className="text-xs text-agri-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Practical Agronomic Advisor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && onClearConversation && (
            <button
              onClick={onClearConversation}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
              title={t('assistant.clearChat')}
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Crop Context Banner */}
      {cropContext && (
        <div className="bg-cream-100/90 border-b border-cream-200 px-4 py-2 flex items-center justify-between text-xs text-agri-900">
          <div className="flex items-center gap-2 truncate">
            <Sprout className="w-4 h-4 text-agri-600 flex-shrink-0" />
            <span className="font-semibold">{t('assistant.cropContext')}:</span>
            <span className="truncate">
              {cropContext.cropName} ({cropContext.diseaseName || 'Healthy'})
            </span>
          </div>
          {onClearCropContext && (
            <button
              onClick={onClearCropContext}
              className="text-[11px] text-gray-500 hover:text-red-600 underline ml-2"
            >
              Remove Context
            </button>
          )}
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-agri-100 text-agri-700 flex items-center justify-center mb-4 shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-agri-dark mb-1">
              Ask Any Agricultural Question
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Inquire about crop symptoms, fertilizer application, irrigation schedules, or seasonal weather precautions in English, Telugu, or Hindi.
            </p>

            {/* Suggested Question Pills */}
            <div className="w-full space-y-2">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left mb-1">
                {t('assistant.suggestedTitle')}
              </div>
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedClick(q)}
                  className="w-full p-2.5 bg-cream-50 hover:bg-agri-50 border border-cream-200 hover:border-agri-300 rounded-2xl text-left text-xs text-agri-900 transition-all active:scale-[0.99] flex items-center justify-between group"
                >
                  <span className="truncate">{q}</span>
                  <CornerDownLeft className="w-3.5 h-3.5 text-agri-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const msgId = msg._id || `msg-${index}`;

            return (
              <div
                key={msgId}
                className={`flex gap-3 max-w-2xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs ${
                    isUser
                      ? 'bg-agri-600 text-white'
                      : 'bg-agri-100 text-agri-800 border border-agri-200'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-3xl p-4 shadow-sm text-sm leading-relaxed ${
                    isUser
                      ? 'bg-agri-600 text-white rounded-tr-none'
                      : 'bg-cream-50 border border-cream-200 text-agri-dark rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line break-words">{msg.content}</div>

                  {/* Speaker Control on Assistant responses */}
                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-cream-200/80 flex items-center justify-between text-[11px] text-gray-400">
                      <VoiceSpeechControl
                        text={msg.content}
                        messageId={msgId}
                        isSpeaking={isSpeaking}
                        activeTextId={activeTextId}
                        onSpeak={speak}
                        onStop={stop}
                      />
                      <span>{new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-md mr-auto">
            <div className="w-8 h-8 rounded-full bg-agri-100 text-agri-800 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin text-agri-600" />
            </div>
            <div className="bg-cream-50 border border-cream-200 rounded-3xl rounded-tl-none p-4 shadow-sm flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-agri-600 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-agri-600 animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-agri-600 animate-bounce delay-200"></div>
              <span className="ml-1">Consulting agricultural models...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3 sm:p-4 bg-gray-50/70 border-t border-agri-100">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-white rounded-2xl border border-agri-200 shadow-sm focus-within:border-agri-500 focus-within:ring-2 focus-within:ring-agri-100 transition-all">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('assistant.placeholder')}
              className="w-full py-3 px-4 text-sm bg-transparent border-0 focus:outline-none placeholder-gray-400 text-agri-dark"
              disabled={isLoading}
            />

            {/* Voice Mic Button embedded inside input */}
            <div className="pr-2">
              <VoiceInputControl
                currentText={inputText}
                onTextChange={setInputText}
                onTranscriptReady={(transcript) => {
                  setInputText(transcript);
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-agri-600 hover:bg-agri-700 disabled:opacity-40 text-white rounded-2xl shadow-sm transition-all flex items-center justify-center flex-shrink-0 active:scale-95"
            aria-label="Send Message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-2 text-center text-[11px] text-gray-400">
          {t('assistant.disclaimer')}
        </div>
      </div>
    </div>
  );
};
