import React, { useState, useEffect, useRef } from 'react';
import { firebaseDb, ChatMessage } from '../services/firebaseDb';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  User,
  Radio,
  Minimize2,
  Smile,
  Info
} from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [senderName, setSenderName] = useState(() => {
    return localStorage.getItem('bashar_chat_name') || '';
  });
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Subscribe to real-time Firestore chat messages
  useEffect(() => {
    const unsubscribe = firebaseDb.subscribeToChatMessages(
      (newMessages) => {
        setIsConnected(true);
        setFirestoreError(null);
        setMessages(newMessages);

        if (!isOpen && newMessages.length > 0) {
          setUnreadCount((prev) => Math.min(prev + 1, 99));
        }
      },
      (err) => {
        setIsConnected(false);
        const errMsg = err?.message || 'Firestore connection pending';
        setFirestoreError(errMsg);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [isOpen]);

  // Scroll to bottom when messages update or chat is opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // When senderName changes, save to localStorage
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSenderName(val);
    localStorage.setItem('bashar_chat_name', val);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const finalName = isAuthenticated
      ? 'Admin (Bashar APK)'
      : senderName.trim() || 'Visitor ' + Math.floor(1000 + Math.random() * 9000);

    if (!senderName.trim() && !isAuthenticated) {
      setSenderName(finalName);
      localStorage.setItem('bashar_chat_name', finalName);
    }

    setIsSending(true);
    try {
      await firebaseDb.sendChatMessage({
        senderName: finalName,
        senderEmail: user?.email || '',
        text: inputText.trim(),
        isAdmin: Boolean(isAuthenticated)
      });
      setInputText('');
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      showToast('Failed to save message in Firebase. Check database rules.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickQuestion = (text: string) => {
    setInputText(text);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 transform hover:scale-105"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <span className="text-xs tracking-wide">Live Chat</span>

          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-slate-950/80 backdrop-blur px-4 py-3.5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  Live Community Chat
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                    Firebase
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  Real-time Firestore Database Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Firestore connection notice if error */}
          {firestoreError && (
            <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                Firebase Firestore saving enabled.
              </span>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="font-semibold text-slate-200 text-xs">
                  Welcome to Bashar APK Chat!
                </p>
                <p className="text-[11px] mt-1 text-slate-400 max-w-[220px]">
                  Say hello, ask for an Android app, or share your feedback. Everything syncs live with Firebase Firestore.
                </p>

                {/* Quick Prompts */}
                <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                  <button
                    onClick={() => handleQuickQuestion('Can you add Minecraft APK?')}
                    className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 transition-colors"
                  >
                    Request an APK
                  </button>
                  <button
                    onClick={() => handleQuickQuestion('Great collection of apps!')}
                    className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 transition-colors"
                  >
                    Awesome collection!
                  </button>
                </div>
              </div>
            ) : (
              messages.map((m, idx) => {
                const isMe =
                  (isAuthenticated && m.isAdmin) ||
                  (!isAuthenticated && m.senderName === senderName && senderName.trim().length > 0);

                const timeStr = new Date(m.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={m.id || idx}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 px-1">
                      <span className="font-semibold text-slate-300">
                        {m.senderName}
                      </span>
                      {m.isAdmin && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30 flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          ADMIN
                        </span>
                      )}
                      <span className="text-[9px] text-slate-500">{timeStr}</span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed break-words shadow-sm ${
                        isMe
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-medium rounded-tr-none'
                          : m.isAdmin
                          ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-100 rounded-tl-none'
                          : 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/50'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt bar */}
          <div className="px-3 py-1.5 bg-slate-950/50 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-500 shrink-0">Quick:</span>
            <button
              onClick={() => handleQuickQuestion('Need an APK update')}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
            >
              Update request
            </button>
            <button
              onClick={() => handleQuickQuestion('How to install APK safely?')}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
            >
              How to install?
            </button>
          </div>

          {/* Input Controls */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-950/90 border-t border-slate-800 flex flex-col gap-2"
          >
            {!isAuthenticated && !senderName && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Your Name (optional)"
                  value={senderName}
                  onChange={handleNameChange}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  isAuthenticated
                    ? 'Reply as Admin to community...'
                    : 'Type a message (saved to Firestore)...'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isSending}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-slate-950 transition-colors flex items-center justify-center shadow-md shadow-emerald-500/20"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
