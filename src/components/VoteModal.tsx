import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Vote, Star } from 'lucide-react';
import { Anime } from '../types';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  anime: Anime | null;
  onVote: (category: string) => void;
}

const VoteModal: React.FC<VoteModalProps> = ({ isOpen, onClose, anime, onVote }) => {
  const categories = ['Best Anime', 'Best Character', 'Best Opening', 'Best Storyline'];

  if (!anime) return null;

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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-red-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]"
          >
            <div className="p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-red-500 shadow-[0_0_15px_#ef4444]">
                <img src={anime.poster} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{anime.title}</h3>
              <p className="text-xs text-red-400 uppercase tracking-widest font-bold mb-6">Voting Arena</p>
              
              <div className="grid grid-cols-1 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onVote(cat)}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-red-500/10 hover:border-red-500/50 transition-all group"
                  >
                    <span className="text-white font-medium">{cat}</span>
                    <Star size={18} className="text-white/20 group-hover:text-red-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VoteModal;
