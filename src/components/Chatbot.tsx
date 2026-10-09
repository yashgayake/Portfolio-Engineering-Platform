import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Bot, 
  Send, 
  X, 
  RotateCcw, 
  Copy, 
  Check, 
  MessageSquare, 
  Sparkles, 
  Zap, 
  Cpu, 
  BrainCircuit, 
  ExternalLink,
  ChevronDown,
  Search,
  Github,
  Linkedin,
  FolderGit2
} from 'lucide-react';
import { api } from '../lib/api.ts';
import { Yash3DAvatar } from './Yash3DAvatar.tsx';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

type ModelTaskMode = 'fast' | 'general' | 'complex';

const MODEL_MODES: { id: ModelTaskMode; label: string; modelName: string; icon: typeof Zap; desc: string }[] = [
  { id: 'fast', label: 'Fast', modelName: 'gemini-3.1-flash-lite', icon: Zap, desc: 'Instant concise replies' },
  { id: 'general', label: 'Balanced', modelName: 'gemini-3.5-flash', icon: Cpu, desc: 'General portfolio Q&A' },
  { id: 'complex', label: 'Pro', modelName: 'gemini-3.1-pro-preview', icon: BrainCircuit, desc: 'Deep technical reasoning' }
];

const SUGGESTED_PROMPTS = [
  "🔗 What is Yash's LinkedIn profile link?",
  "💻 Show Yash's GitHub profile and projects",
  "🤖 What robotics projects has Yash built?",
  "📬 How can I contact or collaborate with Yash?"
];

const QUICK_TOPIC_PILLS = [
  { label: "LinkedIn", query: "What is Yash's LinkedIn profile link?", icon: Linkedin },
  { label: "GitHub Projects", query: "Show Yash's GitHub profile and projects", icon: FolderGit2 },
  { label: "Robotics", query: "What robotics projects has Yash built?", icon: Cpu },
  { label: "Contact", query: "How can I contact or hire Yash?", icon: MessageSquare }
];

const ANALYSIS_STEPS = [
  "Analyzing Yash Gayake's portfolio records...",
  "Inspecting GitHub repositories, tech stacks & LinkedIn info...",
  "Synthesizing verified response with Gemini..."
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-msg',
  role: 'assistant',
  content: "Hello! I am Yash's official AI Portfolio Assistant powered by Google Gemini. I analyze Yash's verified portfolio records in real-time.\n\nAsk me anything about Yash's **LinkedIn link**, **GitHub projects**, **robotics engineering**, **education**, or **how to collaborate** with him!",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  modelUsed: 'gemini-3.5-flash'
};

const STORAGE_KEY = 'yash_portfolio_chat_history';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [INITIAL_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [taskMode, setTaskMode] = useState<ModelTaskMode>('general');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycling analysis steps while loading
  useEffect(() => {
    if (!isLoading) {
      setAnalysisStage(0);
      return;
    }
    const timer = setInterval(() => {
      setAnalysisStage(prev => (prev + 1) % ANALYSIS_STEPS.length);
    }, 1100);
    return () => clearInterval(timer);
  }, [isLoading]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  // Save history to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Map messages for Gemini API
      const apiMessages = newMessages.map(m => ({
        role: (m.role === 'assistant' ? 'model' : 'user') as 'model' | 'user',
        content: m.content
      }));

      const activeConfig = MODEL_MODES.find(m => m.id === taskMode) || MODEL_MODES[1];
      const result = await api.sendChatMessage(
        apiMessages,
        activeConfig.modelName,
        taskMode
      );

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: result.modelUsed || activeConfig.modelName
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ ${err.message || 'Unable to communicate with Gemini right now. Please ensure your Gemini API key is configured or try again in a moment.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentModeInfo = MODEL_MODES.find(m => m.id === taskMode) || MODEL_MODES[1];
  const CurrentIcon = currentModeInfo.icon;

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Callout tooltip when closed */}
        {!isOpen && (
          <div className="mb-2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/95 border border-neutral-800 text-xs font-mono text-neutral-300 shadow-xl backdrop-blur-md animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ask AI: LinkedIn, GitHub & Projects</span>
          </div>
        )}

        <button
          id="chatbot-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close AI Chatbot" : "Open AI Chatbot"}
          className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 shadow-2xl active:scale-95 ${
            isOpen
              ? 'bg-neutral-800 text-neutral-200 border border-neutral-700 hover:bg-neutral-700'
              : 'bg-gradient-to-tr from-cyan-600 via-cyan-500 to-sky-400 text-neutral-950 shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105'
          }`}
        >
          {/* Animated ping ring when idle */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-2xl bg-cyan-400 opacity-25 animate-ping pointer-events-none" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200 rotate-90 hover:rotate-0" />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
              <div className="w-12 h-12 pointer-events-none">
                <Yash3DAvatar
                  className="w-full h-full scale-125"
                  height="100%"
                  autoRotate={true}
                  interactive={false}
                  showControls={false}
                  enableSpeech={false}
                />
              </div>
              {/* Online status indicator dot */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-neutral-950 z-10" />
            </div>
          )}
        </button>
      </div>

      {/* Main Chatbot Window */}
      {isOpen && (
        <div 
          id="chatbot-window"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[440px] h-[600px] max-h-[85vh] flex flex-col rounded-2xl bg-neutral-950/95 border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Top Bar Header with Live 3D Yash Model */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-800/90 bg-neutral-900/70">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-neutral-900 border border-cyan-500/30 overflow-hidden shadow-inner">
                <Yash3DAvatar
                  className="w-full h-full scale-150"
                  height="100%"
                  autoRotate={true}
                  interactive={false}
                  showControls={false}
                  enableSpeech={false}
                />
                <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-neutral-900 z-10" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-neutral-100 tracking-tight">Yash 3D AI Assistant</h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Gemini
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono flex items-center gap-1">
                  <span>Ask about Yash's Robotics &amp; Dev</span>
                </p>
              </div>
            </div>

            {/* Actions: Model Selector, Reset, Close */}
            <div className="flex items-center gap-1.5">
              {/* Model Mode Dropdown */}
              <div className="relative">
                <button
                  id="chatbot-model-select-btn"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  title={`Active Model: ${currentModeInfo.modelName} (${currentModeInfo.label})`}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] font-mono text-neutral-300 transition-colors"
                >
                  <CurrentIcon className="w-3 h-3 text-cyan-400" />
                  <span>{currentModeInfo.label}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-500" />
                </button>

                {isModelDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-52 rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl p-1.5 z-50 text-xs">
                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      Gemini Model Mode
                    </div>
                    {MODEL_MODES.map(mode => {
                      const Icon = mode.icon;
                      const isSelected = mode.id === taskMode;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => {
                            setTaskMode(mode.id);
                            setIsModelDropdownOpen(false);
                          }}
                          className={`w-full flex items-start gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors ${
                            isSelected 
                              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' 
                              : 'hover:bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 mt-0.5 ${isSelected ? 'text-cyan-400' : 'text-neutral-500'}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between font-medium">
                              <span>{mode.label}</span>
                              <span className="text-[10px] font-mono text-neutral-400">{mode.modelName.replace('gemini-', '')}</span>
                            </div>
                            <p className="text-[10px] text-neutral-400 leading-tight">{mode.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Reset History Button */}
              <button
                id="chatbot-reset-btn"
                onClick={handleClearChat}
                title="Clear conversation history"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                id="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Filter Topic Chips */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-neutral-800/60 bg-neutral-900/40 overflow-x-auto scrollbar-none">
            {QUICK_TOPIC_PILLS.map((pill, idx) => {
              const Icon = pill.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(pill.query)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] font-mono text-neutral-300 hover:text-cyan-300 transition-colors whitespace-nowrap active:scale-95 disabled:opacity-50"
                >
                  <Icon className="w-3 h-3 text-cyan-400" />
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Scrollable Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`relative max-w-[88%] rounded-2xl p-3.5 text-xs ${
                      isAssistant
                        ? 'bg-neutral-900/90 text-neutral-200 border border-neutral-800/90 rounded-tl-sm shadow-sm'
                        : 'bg-cyan-500 text-neutral-950 font-medium rounded-tr-sm shadow-md shadow-cyan-500/10'
                    }`}
                  >
                    {isAssistant ? (
                      <div className="markdown-body space-y-2 [&_p]:mb-1.5 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1 [&_code]:bg-neutral-950 [&_code]:text-cyan-300 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_pre]:bg-neutral-950 [&_pre]:p-2 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_strong]:text-cyan-400">
                        <Markdown
                          components={{
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 transition-colors font-medium break-all"
                              >
                                <span>{children}</span>
                                <ExternalLink className="w-2.5 h-2.5 inline-block opacity-80" />
                              </a>
                            )
                          }}
                        >
                          {msg.content}
                        </Markdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                    )}

                    {/* Metadata & Actions row */}
                    <div
                      className={`flex items-center justify-between gap-3 mt-2 pt-1 border-t text-[10px] font-mono ${
                        isAssistant
                          ? 'border-neutral-800/80 text-neutral-400'
                          : 'border-cyan-600/30 text-neutral-900/80'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{msg.timestamp}</span>
                        {msg.modelUsed && (
                          <span className="hidden sm:inline-block px-1 rounded bg-neutral-950/40 text-[9px]">
                            {msg.modelUsed}
                          </span>
                        )}
                      </div>

                      {isAssistant && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          title="Copy reply"
                          className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* In-flight "Analyzing Portfolio" indicator */}
            {isLoading && (
              <div className="flex flex-col items-start w-full animate-in fade-in duration-200">
                <div className="w-full max-w-[90%] rounded-2xl rounded-tl-sm bg-neutral-900/95 border border-cyan-500/30 p-3.5 shadow-lg shadow-cyan-950/20 text-xs">
                  {/* Top status header */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400">
                        <Search className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      </div>
                      <span className="text-[11px] font-mono font-semibold tracking-wide text-cyan-300">
                        Analyzing Portfolio...
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/50">
                      Live Grounding
                    </span>
                  </div>

                  {/* Cycling analysis step */}
                  <p className="text-[11px] text-neutral-300 font-mono flex items-center gap-2 mb-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                    <span className="truncate">{ANALYSIS_STEPS[analysisStage]}</span>
                  </p>

                  {/* Cyber animated scan bar */}
                  <div className="relative h-1 w-full rounded-full bg-neutral-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-full animate-pulse"
                    />
                  </div>

                  {/* Inspected modules */}
                  <div className="flex items-center gap-1.5 mt-2 pt-1 text-[9px] font-mono text-neutral-400 overflow-x-auto scrollbar-none">
                    <span className="text-neutral-500">Checking:</span>
                    <span className="px-1 py-0.2 rounded bg-neutral-950 text-neutral-300">LinkedIn</span>
                    <span className="px-1 py-0.2 rounded bg-neutral-950 text-neutral-300">GitHub Repos</span>
                    <span className="px-1 py-0.2 rounded bg-neutral-950 text-neutral-300">Robotics</span>
                    <span className="px-1 py-0.2 rounded bg-neutral-950 text-neutral-300">Skills</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Prompts (shown when conversation is brief) */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 py-2 border-t border-neutral-800/60 bg-neutral-900/30">
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Suggested Questions</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 hover:text-cyan-300 transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-neutral-800/90 bg-neutral-900/70 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Yash's LinkedIn, GitHub projects, robotics..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              id="chatbot-send-btn"
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 disabled:opacity-40 disabled:hover:bg-cyan-500 transition-all font-semibold active:scale-95 shadow-md shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
