import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, Loader } from 'lucide-react';

const AIAssistantDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your GradForge AI Mentor. How can I help you with your projects, resumes, portfolios, or assignments today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = message;
    setMessage('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', {
        message: userMsg,
        topic: 'General Guidance',
        context: window.location.pathname
      });

      if (res.data.success) {
        setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error. Please make sure your server is online.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 hover:scale-105 transition duration-300 relative glow-pulse"
        >
          <MessageSquare size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full"></span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] rounded-2xl glass-panel flex flex-col shadow-2xl overflow-hidden border border-white/10">
          {/* Drawer Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#0d101b] to-[#121626] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Bot size={18} className="text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">AI Mentor Assistant</h4>
                <span className="text-[10px] text-cyan-400 font-medium">Online & Active</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Messages list */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Bot size={12} className="text-purple-400" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 max-w-[80%]">
                <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Bot size={12} className="text-purple-400" />
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-2 text-gray-400">
                  <Loader size={12} className="animate-spin text-purple-400" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Drawer Form input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-[#06070a]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask project guidance, code help..."
                className="w-full pl-3 pr-10 py-2 text-xs bg-white/5 border border-white/5 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="absolute right-2 text-purple-400 hover:text-purple-300 disabled:opacity-30 transition"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistantDrawer;
