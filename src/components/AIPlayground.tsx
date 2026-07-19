'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ════════════════════════════════════════════════════════════════════════════
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  temperature: number;
  createdAt: number;
  metadata?: {
    latency?: number;
    tokens?: number;
    executionTime?: number;
  };
}

interface PromptTemplate {
  title: string;
  description: string;
  prompt: string;
  category: string;
}

const PROMPT_LIBRARY: PromptTemplate[] = [
  {
    title: 'Explain this code',
    description: 'Deconstruct complex algorithms or design patterns.',
    prompt: 'Review the following code block, explain its time complexity (Big O), and suggest 2 refactoring techniques to optimize execution:\n\n```javascript\n\n```',
    category: 'Analysis',
  },
  {
    title: 'System Design Architect',
    description: 'Design distributed architectures with trade-offs.',
    prompt: 'Draft a system design proposal for a high-volume notification microservice supporting 10,000 requests per second. Include components, databases, caching layers, and potential failover mechanics.',
    category: 'Design',
  },
  {
    title: 'Optimize Database Queries',
    description: 'Audit SQL queries for index optimization.',
    prompt: 'Analyze this SQL query. Identify bottlenecks, recommend missing indexes, and rewrite it for maximum performance:\n\n```sql\nSELECT users.id, profiles.bio, count(orders.id)\nFROM users\nLEFT JOIN profiles ON profiles.user_id = users.id\nLEFT JOIN orders ON orders.user_id = users.id\nWHERE users.status = \'active\'\nGROUP BY users.id, profiles.bio;\n```',
    category: 'Data',
  },
  {
    title: 'Construct API Endpoint',
    description: 'Generate Next.js Route Handlers.',
    prompt: 'Write a clean Next.js 15 Route Handler (TypeScript) that processes POST requests with input validation using Zod and saves the data to a database. Include complete error handling.',
    category: 'Engineering',
  },
];

const MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', desc: 'Fast, lightweight multimodal model.' },
  { id: 'gemini-pro', name: 'Gemini 1.5 Pro', provider: 'Google', desc: 'Capable reasoning and complex instructions.' },
  { id: 'groq-llama', name: 'Llama 3.3 70B (Groq)', provider: 'Groq', desc: 'Ultrafast open-source model execution.' },
  { id: 'groq-mixtral', name: 'Mixtral 8x7B (Groq)', provider: 'Groq', desc: 'High concurrency MoE model.' },
];

// ════════════════════════════════════════════════════════════════════════════
// RENDERERS
// ════════════════════════════════════════════════════════════════════════════
const MarkdownRenderer = memo(function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="flex flex-col gap-3 font-sans text-sm leading-[1.7] text-zinc-300">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : '';
          const code = match ? match[2] : part.slice(3, -3);

          return <CodeBlock key={index} language={lang} code={code.trim()} />;
        }

        const lines = part.split('\n');
        return (
          <div key={index} className="flex flex-col gap-2">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-2" />;

              if (trimmed.startsWith('# ')) {
                return <h1 key={lIdx} className="text-lg font-bold text-white mt-4 first:mt-0 tracking-tight">{trimmed.slice(2)}</h1>;
              }
              if (trimmed.startsWith('## ')) {
                return <h2 key={lIdx} className="text-base font-bold text-white mt-3 first:mt-0 tracking-tight">{trimmed.slice(3)}</h2>;
              }
              if (trimmed.startsWith('### ')) {
                return <h3 key={lIdx} className="text-sm font-bold text-white mt-2 first:mt-0 tracking-tight">{trimmed.slice(4)}</h3>;
              }

              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <ul key={lIdx} className="list-disc pl-5 flex flex-col gap-1">
                    <li className="font-light">{trimmed.slice(2)}</li>
                  </ul>
                );
              }

              if (/^\d+\.\s/.test(trimmed)) {
                const matchDot = trimmed.match(/^(\d+)\.\s(.*)/);
                return (
                  <ol key={lIdx} className="list-decimal pl-5 flex flex-col gap-1">
                    <li className="font-light" value={matchDot ? parseInt(matchDot[1]) : undefined}>
                      {matchDot ? matchDot[2] : trimmed}
                    </li>
                  </ol>
                );
              }

              const boldProcessed = trimmed.split(/(\*\*.*?\*\*)/g).map((chunk, cIdx) => {
                if (chunk.startsWith('**') && chunk.endsWith('**')) {
                  return <strong key={cIdx} className="font-semibold text-white">{chunk.slice(2, -2)}</strong>;
                }
                return chunk;
              });

              return (
                <p key={lIdx} className="font-light text-zinc-300">
                  {boldProcessed}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
});

const CodeBlock = memo(function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#070709] border border-white/[0.04] rounded-xl overflow-hidden my-3 shadow-lg">
      <div className="flex justify-between items-center py-2 px-4 border-b border-white/[0.03] bg-black/40 text-[10px] font-mono text-zinc-500">
        <span>{language ? language.toUpperCase() : 'CODE'}</span>
        <button
          onClick={handleCopy}
          className="hover:text-white transition-colors duration-150 flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-xs text-zinc-300 leading-[1.6]">
        <code>{code}</code>
      </pre>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// PLAYGROUND COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function AIPlayground() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [temperature, setTemperature] = useState(0.7);

  // Rate Limiting States
  const [remainingRequests, setRemainingRequests] = useState<number>(2);
  const [resetTimestamp, setResetTimestamp] = useState<number>(0);
  const [resetCountdown, setResetCountdown] = useState<string>('');

  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatParentRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Estimated stats
  const [latency, setLatency] = useState<number | null>(null);
  const [execTime, setExecTime] = useState<number | null>(null);
  const [tokensEstimated, setTokensEstimated] = useState<number | null>(null);

  // Fetch current rate limit status
  const updateRateLimitStatus = async () => {
    try {
      const res = await fetch('/api/chat/rate-limit');
      if (res.ok) {
        const data = await res.json();
        setRemainingRequests(data.remaining);
        setResetTimestamp(data.resetTime);
      }
    } catch (e) {
      console.error('Failed to sync rate limit status:', e);
    }
  };

  // Setup mount and chats
  useEffect(() => {
    updateRateLimitStatus();

    const saved = localStorage.getItem('engineering_playground_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChats(parsed);
        if (parsed.length > 0) {
          setActiveChatId(parsed[0].id);
        }
      } catch (e) {}
    } else {
      const seedChat: Chat = {
        id: 'default-chat',
        title: 'Initial Architecture Discussion',
        messages: [
          {
            id: 'm1',
            role: 'assistant',
            content: 'Hello! I am your AI engineering playground companion. Type a message or choose a prompt from the library to test live streaming across Google Gemini and Groq.',
            timestamp: Date.now(),
          },
        ],
        model: 'gemini-2.5-flash',
        temperature: 0.7,
        createdAt: Date.now(),
      };
      setChats([seedChat]);
      setActiveChatId(seedChat.id);
    }
  }, []);

  // Update countdown timer for rate limit reset
  useEffect(() => {
    if (!resetTimestamp) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = resetTimestamp - now;

      if (diff <= 0) {
        setResetCountdown('');
        setRemainingRequests(2);
        clearInterval(timer);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setResetCountdown(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [resetTimestamp]);

  const saveChats = (updatedChats: Chat[]) => {
    setChats(updatedChats);
    localStorage.setItem('engineering_playground_chats', JSON.stringify(updatedChats));
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isGenerating, scrollToBottom]);

  const handleNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newChat: Chat = {
      id: newId,
      title: `Chat ${chats.length + 1}`,
      messages: [],
      model: selectedModel,
      temperature,
      createdAt: Date.now(),
    };
    saveChats([newChat, ...chats]);
    setActiveChatId(newId);
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = chats.filter((c) => c.id !== id);
    saveChats(filtered);
    if (activeChatId === id) {
      setActiveChatId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  };

  const isLimitExhausted = remainingRequests <= 0;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || !activeChatId || isGenerating) return;
    if (isLimitExhausted) return;

    setInputMessage('');
    const userMessage: Message = {
      id: `m-usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const currentChat = chats.find((c) => c.id === activeChatId);
    if (!currentChat) return;

    const originalMessages = [...currentChat.messages];
    const updatedMessages = [...originalMessages, userMessage];

    const tempChats = chats.map((c) =>
      c.id === activeChatId ? { ...c, messages: updatedMessages } : c
    );
    setChats(tempChats);

    setIsGenerating(true);
    setLatency(null);
    setExecTime(null);
    setTokensEstimated(null);

    const startTime = Date.now();
    let firstTokenReceived = false;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const assistantMessageId = `m-ast-${Date.now()}`;
    const newAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    const finalMessages = [...updatedMessages, newAssistantMessage];
    setChats(
      chats.map((c) =>
        c.id === activeChatId ? { ...c, messages: finalMessages } : c
      )
    );

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel,
          temperature,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errorJson.message || errorJson.error || 'Server stream failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body reader could not be acquired');

      const decoder = new TextDecoder();
      let streamedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamedContent += chunk;

        if (!firstTokenReceived) {
          firstTokenReceived = true;
          setLatency(Date.now() - startTime);
        }

        setChats(
          tempChats.map((c) =>
            c.id === activeChatId
              ? {
                  ...c,
                  messages: [
                    ...updatedMessages,
                    { ...newAssistantMessage, content: streamedContent },
                  ],
                }
              : c
          )
        );
      }

      const totalTime = Date.now() - startTime;
      setExecTime(totalTime);
      setTokensEstimated(Math.floor((text.length + streamedContent.length) / 4));

      const finalChatList = chats.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              messages: [
                ...updatedMessages,
                { ...newAssistantMessage, content: streamedContent },
              ],
              model: selectedModel,
              temperature,
            }
          : c
      );
      saveChats(finalChatList);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream generation aborted by user.');
      } else {
        console.error('Streaming request error:', err);
        setChats(
          tempChats.map((c) =>
            c.id === activeChatId
              ? {
                  ...c,
                  messages: [
                    ...updatedMessages,
                    {
                      ...newAssistantMessage,
                      content: `❌ Error: ${err.message || 'Stream connection failed. Server error.'}`,
                    },
                  ],
                }
              : c
          )
        );
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
      await updateRateLimitStatus();
    }
  };

  const handleUsePrompt = (promptText: string) => {
    setInputMessage(promptText);
  };

  return (
    <div className="w-full bg-[#050506] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md relative font-sans text-white shadow-2xl flex flex-col md:grid md:grid-cols-[240px_1fr_240px] min-h-[640px] max-h-[800px] h-[75vh]">
      
      {/* ── LEFT SIDEBAR ── */}
      <AnimatePresence initial={false}>
        {showLeftSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-white/5 bg-black/40 flex flex-col justify-between overflow-y-auto"
          >
            <div className="p-4 flex flex-col gap-4">
              <button
                onClick={handleNewChat}
                className="w-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-lg py-2 px-3 font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>+</span> New Chat
              </button>

              <div className="flex flex-col gap-1 mt-2">
                <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase px-2 mb-2 block">
                  Recent Conversations
                </span>
                <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto pr-1">
                  {chats.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveChatId(c.id)}
                      className={`w-full text-left py-2 px-2.5 rounded-lg text-xs font-mono flex items-center justify-between cursor-pointer transition-colors ${
                        activeChatId === c.id
                          ? 'bg-white/[0.04] text-white'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.01]'
                      }`}
                    >
                      <span className="truncate pr-2">{c.title}</span>
                      {chats.length > 1 && (
                        <span
                          onClick={(e) => handleDeleteChat(c.id, e)}
                          className="text-[9px] text-zinc-600 hover:text-red-400 px-1.5"
                        >
                          ✕
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Library */}
              <div className="flex flex-col gap-1 mt-4">
                <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase px-2 mb-2 block">
                  Prompt Library
                </span>
                <div className="flex flex-col gap-2">
                  {PROMPT_LIBRARY.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleUsePrompt(item.prompt)}
                      className="w-full text-left p-2 rounded-lg border border-white/[0.02] bg-white/[0.01] hover:border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer flex flex-col gap-0.5"
                    >
                      <span className="text-[10px] font-semibold text-zinc-300">{item.title}</span>
                      <span className="text-[8px] text-zinc-500 line-clamp-1">{item.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Provider Badges */}
            <div className="p-4 border-t border-white/5 bg-black/60 flex flex-col gap-2 select-none font-mono text-[9px] text-zinc-500">
              <span className="uppercase tracking-widest text-[8px] mb-1">Powered by API</span>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded bg-[#0d0d12] border border-white/[0.04] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>GEMINI</span>
                </div>
                <div className="px-2 py-1 rounded bg-[#0d0d12] border border-white/[0.04] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>GROQ</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CENTER CHAT INTERFACE ── */}
      <div className="flex flex-col justify-between h-full bg-[#050506]/40 overflow-hidden">
        {/* Chat Header */}
        <div className="w-full border-b border-white/5 bg-black/20 py-2.5 px-4 flex justify-between items-center text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ☰
            </button>
            <span>AI CORE LAB / CHAT</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[9px] text-[var(--accent)] font-medium">
              REQUESTS REMAINING: {remainingRequests} / 2
            </span>
            <button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              ⚙
            </button>
          </div>
        </div>

        {/* Message logs */}
        <div
          ref={chatParentRef}
          className="flex-1 overflow-y-auto p-6 flex flex-col gap-6"
        >
          {activeChat && activeChat.messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-16">
              <span className="text-2xl opacity-30">💬</span>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                Start a conversation by typing below...
              </p>
            </div>
          ) : (
            activeChat?.messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col gap-1.5 max-w-[85%] ${
                  m.role === 'user' ? 'align-self-end items-end ml-auto' : 'align-self-start'
                }`}
              >
                <div className="flex items-center gap-2 text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                  <span>{m.role}</span>
                </div>
                <div
                  className={`rounded-2xl px-5 py-4 border shadow-sm ${
                    m.role === 'user'
                      ? 'bg-white/[0.03] border-white/5 text-white'
                      : 'bg-[#09090b]/60 border-white/[0.04] text-zinc-100'
                  }`}
                >
                  <MarkdownRenderer content={m.content} />
                </div>
              </div>
            ))
          )}

          {isGenerating && activeChat?.messages.slice(-1)[0]?.content === '' && (
            <div className="flex flex-col gap-1.5 align-self-start">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                Assistant
              </span>
              <div className="rounded-2xl px-5 py-4 border border-white/[0.04] bg-[#09090b]/60 text-zinc-500 font-mono text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-ping" />
                <span>THINKING...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input panel / Rate Limit exhaustion overlay */}
        <div className="p-4 border-t border-white/5 bg-black/40 flex flex-col gap-3">
          {isLimitExhausted ? (
            <div className="border border-white/5 bg-white/[0.01] rounded-xl p-5 text-center flex flex-col gap-2 font-mono text-xs select-none">
              <span className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">
                Playground Limit Reached
              </span>
              <p className="text-zinc-400 font-sans text-xs font-light max-w-[350px] mx-auto leading-relaxed mt-1">
                You have used your 2 complimentary AI requests. The Playground resets every hour.
              </p>
              <div className="mt-2 text-[10px] text-[var(--accent)] font-semibold uppercase tracking-wider">
                Next reset in: {resetCountdown || 'Calculating...'}
              </div>
            </div>
          ) : (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-center bg-[#070709] border border-white/5 rounded-xl overflow-hidden focus-within:border-white/10 transition-colors"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    isGenerating ? 'Assistant is streaming...' : 'Ask about architecture, code optimization...'
                  }
                  disabled={isGenerating}
                  className="w-full bg-transparent p-3.5 pr-20 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
                />
                <div className="absolute right-2 flex items-center gap-1.5">
                  {isGenerating ? (
                    <button
                      type="button"
                      onClick={handleStopGeneration}
                      className="bg-red-550 border border-red-500/20 text-white rounded-lg px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider hover:bg-red-500 transition-colors cursor-pointer"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="bg-white hover:bg-zinc-200 text-black disabled:opacity-30 disabled:hover:bg-white rounded-lg px-4 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer"
                    >
                      Send
                    </button>
                  )}
                </div>
              </form>
              <div className="flex justify-between items-center text-[8px] font-mono text-zinc-600 tracking-wider">
                <span>SECURE PROXIED PIPELINE</span>
                <span>PRESS ENTER TO SUBMIT</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <AnimatePresence initial={false}>
        {showRightSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-white/5 bg-black/40 flex flex-col justify-between p-4 overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-3 block">
                  Model Selector
                </span>
                <div className="flex flex-col gap-2">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-white/10 rounded-lg p-2.5 font-mono text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-[9px] text-zinc-500 leading-normal font-sans font-light">
                    {MODELS.find((m) => m.id === selectedModel)?.desc}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-3 block">
                  Hyperparameters
                </span>
                <div className="flex flex-col gap-2 font-mono text-[10px]">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>TEMPERATURE</span>
                    <span className="text-white">{temperature.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-white"
                  />
                  <div className="flex justify-between text-[8px] text-zinc-600">
                    <span>DETERMINISTIC</span>
                    <span>CREATIVE</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-3 block">
                  Stream Telemetry
                </span>
                <div className="flex flex-col gap-2.5 font-mono text-[10px] bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg">
                  <div className="flex justify-between text-zinc-500">
                    <span>PROVIDER</span>
                    <span className="text-zinc-300">
                      {selectedModel.startsWith('gemini') ? 'Google' : 'Groq'}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>LATENCY (TTFT)</span>
                    <span className="text-zinc-300">{latency ? `${latency}ms` : '—'}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>EXECUTION TIME</span>
                    <span className="text-zinc-300">{execTime ? `${(execTime / 1000).toFixed(2)}s` : '—'}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>TOKENS (EST)</span>
                    <span className="text-zinc-300">{tokensEstimated ?? '—'}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>CONTEXT USED</span>
                    <span className="text-zinc-300">
                      {activeChat ? activeChat.messages.length : 0} turns
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-white/5 bg-black/20">
              <button
                onClick={() => {
                  if (!activeChat) return;
                  const dataStr = JSON.stringify(activeChat, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                  const exportFileDefaultName = `chat-${activeChat.id}.json`;
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
                className="w-full border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-zinc-400 hover:text-white rounded-lg py-2 font-mono text-[9px] uppercase tracking-wider cursor-pointer transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={() => {
                  if (activeChatId) {
                    saveChats(chats.map((c) => (c.id === activeChatId ? { ...c, messages: [] } : c)));
                  }
                }}
                className="w-full border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-zinc-400 hover:text-white rounded-lg py-2 font-mono text-[9px] uppercase tracking-wider cursor-pointer transition-colors"
              >
                Clear History
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
