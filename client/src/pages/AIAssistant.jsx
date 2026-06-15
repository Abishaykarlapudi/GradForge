import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Bot, Send, Loader, Plus, MessageSquare, AlertCircle
} from 'lucide-react';

const AIAssistant = () => {
  const [topic, setTopic] = useState('General Mentor Guidance');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchChatHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get('/api/ai/chats');
      if (res.data.success) {
        setChatHistory(res.data.chats);
        if (res.data.chats.length > 0) {
          loadChatIntoMessages(res.data.chats[0]);
        } else {
          // Default greet
          setMessages([
            { sender: 'ai', text: 'Hello! I am your GradForge AI Mentor. You can ask me for code suggestions, formatting critiques, career recommendations, or project tips.' }
          ]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadChatIntoMessages = (chat) => {
    setTopic(chat.topic);
    setMessages(chat.messages);
  };

  const handleCreateNewChat = () => {
    const customTopic = prompt('Enter a topic for the new chat session:', 'Coding Help');
    if (!customTopic || !customTopic.trim()) return;

    setTopic(customTopic.trim());
    setMessages([
      { sender: 'ai', text: `Welcome to our new session regarding: ${customTopic}. Ask me any questions!` }
    ]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loadingResponse) return;

    const userText = message;
    setMessage('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoadingResponse(true);

    try {
      const res = await axios.post('/api/ai/chat', {
        message: userText,
        topic,
        context: 'AI Chat Dedicated Screen'
      });

      if (res.data.success) {
        setMessages(res.data.messages);
        fetchChatHistory();
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'ai', text: 'An error occurred while transmitting message. Check backend logs.' }]);
    } finally {
      setLoadingResponse(false);
    }
  };

  return (
    <div className="text-left space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Bot className="text-purple-400" size={28} /> AI Mentor Assistance
        </h1>
        <p className="text-gray-400 text-xs mt-1">Acquire step-by-step developer guidelines, code critiques, and resume advice.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* TOPIC HISTORY SIDEBAR */}
        <div className="space-y-4">
          <button
            onClick={handleCreateNewChat}
            className="w-full py-2.5 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition"
          >
            <Plus size={14} /> New Chat Session
          </button>

          <div className="p-5 rounded-2xl glass-panel border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Previous Chat Rooms</h3>
            {loadingHistory ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-8 bg-white/5 rounded-lg"></div>
                <div className="h-8 bg-white/5 rounded-lg"></div>
              </div>
            ) : chatHistory.length === 0 ? (
              <p className="text-xs text-gray-500">No active rooms found.</p>
            ) : (
              <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1">
                {chatHistory.map(chat => (
                  <button
                    key={chat._id}
                    onClick={() => loadChatIntoMessages(chat)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left truncate ${topic === chat.topic ? 'bg-purple-600/10 text-purple-400 font-semibold' : 'text-gray-400 hover:bg-white/5'}`}
                  >
                    <MessageSquare size={12} className="flex-shrink-0" />
                    <span className="truncate">{chat.topic}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CHAT SCREEN PANEL */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl glass-panel border border-white/5 flex flex-col h-[550px] overflow-hidden justify-between">
            
            {/* Header info */}
            <div className="p-4 bg-gradient-to-r from-[#0d101b] to-[#121626] border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Bot size={16} className="text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{topic}</h4>
                  <span className="text-[10px] font-medium text-cyan-400">GradForge AI Tutor</span>
                </div>
              </div>
            </div>

            {/* Message display frame */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6 text-xs leading-relaxed">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 border border-purple-500/10">
                      <Bot size={14} className="text-purple-400" />
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl whitespace-pre-line text-left leading-relaxed ${msg.sender === 'user' ? 'bg-purple-650 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-tr-none' : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {loadingResponse && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/10">
                    <Bot size={14} className="text-purple-400" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-2 text-gray-400">
                    <Loader size={12} className="animate-spin text-purple-400" />
                    <span>Analyzing codebase context...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Message input form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#06070a] flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask coding logic, structural explanations, or resume recommendations..."
                className="flex-grow pl-4 pr-10 py-3 bg-white/5 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              />
              <button
                type="submit"
                disabled={loadingResponse || !message.trim()}
                className="p-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white disabled:opacity-30 disabled:hover:bg-purple-600 transition"
              >
                <Send size={16} />
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AIAssistant;
