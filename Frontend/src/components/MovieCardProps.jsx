import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { getImageUrl } from '../api';

export const MovieCard = ({ movie, type = 'movie' }) => {
  const title = movie.title || movie.name || movie.original_title;
  const rating = movie.vote_average?.toFixed(1);
  const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
  const mediaType = movie.media_type || type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative bg-zinc-900 rounded-xl overflow-hidden shadow-lg"
    >
      <Link to={`/${mediaType}/${movie.id}`}>
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play fill="white" size={24} />
            </div>
          </div>
          {rating && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg flex items-center gap-1 text-xs font-bold text-amber-400">
              <Star size={12} fill="currentColor" />
              {rating}
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-red-500 transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
            <span>{year}</span>
            <span className="uppercase px-1.5 py-0.5 border border-white/10 rounded text-[10px]">
              {mediaType === 'tv' ? 'TV Series' : 'Movie'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const MovieSkeleton = () => (
  <div className="bg-zinc-900 rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-[2/3] bg-zinc-800" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-zinc-800 rounded w-3/4" />
      <div className="flex justify-between">
        <div className="h-3 bg-zinc-800 rounded w-1/4" />
        <div className="h-3 bg-zinc-800 rounded w-1/4" />
      </div>
    </div>
  </div>
);