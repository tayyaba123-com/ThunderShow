import React from 'react';
import { motion } from 'motion/react';
import { Heart, Share2 } from 'lucide-react';
import { getImageUrl } from '../api';

export const PosterSection = ({ movie, isFavorite, onFavoriteClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full md:w-80 shrink-0"
    >
      <img
        src={getImageUrl(movie.poster_path)}
        alt={movie.title}
        className="w-full rounded-2xl shadow-2xl border border-white/10"
        referrerPolicy="no-referrer"
      />
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <button 
          onClick={onFavoriteClick}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
            isFavorite ? 'bg-red-600 text-white' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          <Heart size={20} fill={isFavorite ? 'white' : 'none'} /> 
          {isFavorite ? 'Favorited' : 'Favorite'}
        </button>
        <button className="flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all">
          <Share2 size={20} /> Share
        </button>
      </div>
    </motion.div>
  );
};
