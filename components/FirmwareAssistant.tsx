
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { getProtocolAdvisor } from '../services/geminiService';
import { ChatMessage } from '../types';

const FirmwareAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm your Embedded Systems Assistant. I can help with UART timing, SPI configuration, ADC resolution, or logic analyzer data interpretation. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getProtocolAdvisor(input, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error while processing your request. Please check your API key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
        <Bot className="w-5 h-5 text-blue-400" />
        <h3 className="font-semibold text-slate-200">Firmware Architect AI</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] uppercase font-bold">
                {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                {msg.role}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about SPI bit-banging, UART baud errors..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-100"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirmwareAssistant;
