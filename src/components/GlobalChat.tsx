import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Users } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '../types';

interface GlobalChatProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  userId: string;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ isOpen, onClose, username, userId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      socketRef.current = io();
      socketRef.current.emit('join-room', 'global');

      socketRef.current.on('previous-messages', (msgs: ChatMessage[]) => {
        setMessages(msgs);
      });

      socketRef.current.on('new-message', (msg: ChatMessage) => {
        setMessages(prev => [...prev, msg]);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    socketRef.current?.emit('send-message', {
      room: 'global',
      userId,
      username,
      message: input
    });
    setInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, x: 100 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.9, opacity: 0, x: 100 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-blue-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)] flex flex-col h-[600px]"
          >
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-blue-900/20">
              <div className="flex items-center gap-3">
                <Users className="text-blue-400" size={20} />
                <h3 className="text-white font-bold">Global Otaku Chat</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.userId === userId ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-white/40 mb-1 px-1">{msg.username}</span>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.userId === userId 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/5 bg-black/40">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalChat;
