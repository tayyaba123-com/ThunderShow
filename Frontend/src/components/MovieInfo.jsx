import React from 'react';
import { Star, Clock, Calendar, Play, Plus } from 'lucide-react';

export const MovieInfo = ({ movie, onTrailerClick, onFavoriteClick, isFavorite }) => {
  return (
    <div className="flex-1 pt-12">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {movie.genres?.map((g) => (
          <span key={g.id} className="px-3 py-1 bg-red-600/20 text-red-500 rounded-full text-sm font-medium">
            {g.name}
          </span>
        ))}
      </div>
      
      <h1 className="text-4xl md:text-6xl font-black mb-6">
        {movie.title || movie.name}
      </h1>

      <div className="flex flex-wrap items-center gap-8 mb-8 text-gray-400">
        <div className="flex items-center gap-2">
          <Star className="text-amber-400" size={20} fill="currentColor" />
          <span className="text-white font-bold text-lg">{movie.vote_average?.toFixed(1)}</span>
          <span className="text-sm">/ 10</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={20} />
          <span>{movie.runtime || movie.episode_run_time?.[0]} min</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={20} />
          <span>{(movie.release_date || movie.first_air_date || '').split('-')[0]}</span>
        </div>
      </div>

      <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-3xl">
        {movie.overview || "Description not available."}
      </p>

      <div className="flex items-center gap-6">
        <button 
          onClick={onTrailerClick}
          className="px-10 py-4 bg-red-600 hover:bg-red-700 rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-red-600/20"
        >
          <Play fill="white" size={24} /> Watch Trailer
        </button>
        <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};
