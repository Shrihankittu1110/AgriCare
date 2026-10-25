import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bot, RefreshCw } from 'lucide-react';
import { ChatWindow } from '../components/assistant/ChatWindow';
import { assistantService } from '../services/assistantService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AssistantPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Active crop context (passed via navigate state from scan result)
  const [cropScanId, setCropScanId] = useState(location.state?.cropScanId || null);
  const [cropContext, setCropContext] = useState(location.state?.cropContext || null);

  useEffect(() => {
    const loadConversation = async () => {
      setIsInitializing(true);
      try {
        const data = await assistantService.getConversation();
        if (data.success && data.conversation?.messages) {
          setMessages(data.conversation.messages);
        }
      } catch (err) {
        console.warn('[AssistantPage] Conversation load error:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    loadConversation();
  }, []);

  const handleSendMessage = async (text) => {
    if (!text || !text.trim() || isLoading) return;

    // Immediately push user message into UI
    const tempUserMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const res = await assistantService.sendMessage({
        message: text,
        language: i18n.language,
        cropScanId: cropScanId || undefined,
        weatherContext: user?.location ? { locationName: user.location.name } : undefined,
      });

      if (res.success && res.assistantMessage) {
        setMessages((prev) => [...prev, res.assistantMessage]);
      }
    } catch (err) {
      console.error('[AssistantPage] Send failed:', err);
      const errorMsg = {
        role: 'assistant',
        content:
          'I apologize, but I could not reach the agricultural advisory service at this moment. Please check your network or try again shortly.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      showToast('Could not reach assistant service', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = async () => {
    if (!window.confirm('Are you sure you want to clear your conversation history?')) {
      return;
    }

    try {
      await assistantService.clearConversation();
      setMessages([]);
      showToast('Conversation cleared', 'info');
    } catch (err) {
      showToast('Could not clear conversation', 'error');
    }
  };

  const handleClearCropContext = () => {
    setCropScanId(null);
    setCropContext(null);
  };

  if (isInitializing) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-agri-600 mx-auto mb-3" />
        <span className="text-xs text-gray-500">Connecting to agricultural advisor...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-16">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        onClearConversation={handleClearConversation}
        isLoading={isLoading}
        cropContext={cropContext}
        onClearCropContext={handleClearCropContext}
      />
    </div>
  );
};
