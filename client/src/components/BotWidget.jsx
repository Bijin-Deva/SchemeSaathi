import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import i18n from '../i18n';
import { useAuth } from '../context/AuthContext';
import { Bot, Maximize2, X } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
  { code: 'te', label: 'TE' },
];

const MIN_W = 320;
const MIN_H = 400;
const MAX_W = 800;
const MAX_H = 900;

// Renders plain text with markdown table support
function MessageContent({ content }) {
  const lines = content.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    // Detect markdown table: line contains | and next line is separator (|---|)
    if (line.includes('|') && lines[i + 1] && /^\|[\s\-|:]+\|/.test(lines[i + 1])) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      result.push(<MarkdownTable key={i} lines={tableLines} />);
    } else {
      // Render bold (**text**) inline
      result.push(
        <p key={i} className="mb-1 last:mb-0">
          <InlineText text={line} />
        </p>
      );
      i++;
    }
  }
  return <div className="text-sm leading-relaxed">{result}</div>;
}

function InlineText({ text }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function MarkdownTable({ lines }) {
  const rows = lines
    .filter((l) => !/^\|[\s\-|:]+\|/.test(l)) // remove separator row
    .map((l) =>
      l
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim())
    );

  if (rows.length === 0) return null;
  const [header, ...body] = rows;

  return (
    <div className="overflow-x-auto my-2 rounded-lg border border-gray-200">
      <table className="text-xs w-full border-collapse">
        <thead>
          <tr className="bg-orange-50">
            {header.map((cell, i) => (
              <th key={i} className="px-2 py-1.5 text-left font-semibold text-orange-800 border-b border-orange-200 whitespace-nowrap">
                <InlineText text={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-2 py-1.5 border-b border-gray-100 align-top">
                  <InlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BotWidget() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am SchemeSaathi AI. Ask me about any government scheme.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [botLang, setBotLang] = useState(
    i18n.language === 'hi' ? 'Hindi' : i18n.language === 'te' ? 'Telugu' : 'English'
  );

  // Resizable state
  const [size, setSize] = useState({ w: 370, h: 520 });
  const isResizing = useRef(false);
  const resizeStart = useRef({});
  const panelRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Resize handlers
  const onResizeMouseDown = useCallback((e) => {
    e.preventDefault();
    isResizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };

    function onMove(e) {
      if (!isResizing.current) return;
      const dx = resizeStart.current.x - e.clientX; // drag left = wider
      const dy = resizeStart.current.y - e.clientY; // drag up = taller
      setSize({
        w: Math.min(MAX_W, Math.max(MIN_W, resizeStart.current.w + dx)),
        h: Math.min(MAX_H, Math.max(MIN_H, resizeStart.current.h + dy)),
      });
    }
    function onUp() {
      isResizing.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [size]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const conversationHistory = messages.slice(-10);
      const userProfile = user
        ? {
            name: user.name,
            age: user.age,
            gender: user.gender,
            state: user.state,
            income: user.income,
            occupation: user.occupation,
            caste_category: user.caste_category,
          }
        : null;
      const { data } = await api.post('/api/bot/chat', {
        message: userMsg,
        language: botLang,
        conversationHistory,
        userProfile,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I could not process your request right now.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleLangChange(code) {
    setBotLang(code === 'hi' ? 'Hindi' : code === 'te' ? 'Telugu' : 'English');
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          ref={panelRef}
          style={{ width: size.w, height: size.h }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
        >
          {/* Resize handle — top-left corner */}
          <div
            onMouseDown={onResizeMouseDown}
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-10"
            style={{ bottom: 'auto', right: 'auto' }}
            title="Drag to resize"
          />

          {/* Header */}
          <div className="bg-[#0A0A0A] px-4 py-3 flex items-center justify-between flex-shrink-0 select-none border-b border-[#262626]">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">{t('bot.title')}</span>
              {/* Resize hint */}
              <span
                onMouseDown={onResizeMouseDown}
                className="text-gray-400 hover:text-white text-xs cursor-nw-resize select-none"
                title="Drag to resize"
              ><Maximize2 size={14} /></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 bg-[#262626] rounded-full px-1.5 py-0.5 border border-[#333333]">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                      (botLang === 'Hindi' && lang.code === 'hi') ||
                      (botLang === 'Telugu' && lang.code === 'te') ||
                      (botLang === 'English' && lang.code === 'en')
                        ? 'bg-white text-[#0A0A0A] font-semibold shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white hover:text-gray-300 transition-colors text-lg leading-none p-1"
              ><X size={16} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0 bg-[#FAFAFA]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[90%] text-sm px-3.5 py-2.5 rounded-2xl leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#0A0A0A] text-white rounded-br-sm'
                      : 'bg-[#F3F3F3] text-[#0A0A0A] border border-[#E5E5E5] rounded-bl-sm'
                  }`}
                >
                  {msg.role === 'assistant'
                    ? <MessageContent content={msg.content} />
                    : msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#F3F3F3] border border-[#E5E5E5] text-[#6B7280] text-sm px-3.5 py-2 rounded-2xl rounded-bl-sm">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-[#E8E8E8] bg-white flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('bot.placeholder')}
              className="flex-1 text-sm border border-[#E5E5E5] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A0A0A] text-[#0A0A0A]"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-[#0A0A0A] hover:bg-black disabled:bg-gray-300 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm"
            >
              {t('bot.send')}
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-[#FAFAFA] border-t border-[#E8E8E8] text-center flex-shrink-0">
            <p className="text-xs text-[#6B7280]">{t('bot.powered_by')}</p>
            <p className="text-xs text-[#9CA3AF]">{t('bot.privacy')}</p>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="bot-toggle bg-[#0A0A0A] hover:bg-black text-white shadow-xl flex items-center justify-center transition-colors rounded-full w-12 h-12"
        aria-label="Open SchemeSaathi AI"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>
    </div>
  );
}
