import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tmdb, getImageUrl } from '../api';
import { Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFavorites } from '../store';
import { TrailerModal } from '../components/TrailerModal';
import { PosterSection } from '../components/PosterSection';
import { MovieInfo } from '../components/MovieInfo';
import { CastSection } from '../components/CastSection';
import axios from 'axios';

export const MovieDetails = () => {
  const { type, id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const { items: favorites } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  const isFavorite = favorites.some((f) => f.movie_id === Number(id));

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await tmdb.getDetails(type, id);
        console.log('Movie data:', res.data);
        console.log('Videos:', res.data.videos);
        setMovie(res.data);
        
        if (token) {
          axios.post(
            '/api/history',
            {
              movie_id: id,
              title: res.data.title || res.data.name,
              poster_path: res.data.poster_path,
              media_type: type
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [type, id, token]);

  const toggleFavorite = async () => {
    if (!token) return alert('Please login to add favorites');
    try {
      if (isFavorite) {
        await axios.delete(`/api/favorites/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(
          '/api/favorites',
          {
            movie_id: id,
            title: movie.title || movie.name,
            poster_path: movie.poster_path,
            media_type: type
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      dispatch(fetchFavorites());
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={48} />
    </div>
  );

  // Find trailer from TMDB or search YouTube
  const findTrailer = () => {
    if (movie?.videos?.results) {
      const tmdbTrailer = movie.videos.results.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube'
      );
      if (tmdbTrailer) {
        return `https://www.youtube.com/embed/${tmdbTrailer.key}?autoplay=1`;
      }
    }
    
    // Fallback: Create YouTube search URL for trailer
    const movieTitle = (movie?.title || movie?.name || '').replace(/\s+/g, '+');
    return `https://www.youtube.com/embed/results?search_query=${movieTitle}+trailer`;
  };

  const trailerUrl = findTrailer();

  return (
    <div className="pb-20">
      {/* Backdrop */}
      <div className="relative h-[70vh] w-full">
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
          <PosterSection 
            movie={movie} 
            isFavorite={isFavorite} 
            onFavoriteClick={toggleFavorite}
          />
          
          <MovieInfo 
            movie={movie}
            onTrailerClick={() => setShowTrailer(true)}
            onFavoriteClick={toggleFavorite}
            isFavorite={isFavorite}
          />
        </div>

        <CastSection cast={movie.credits?.cast} />
      </div>

      <TrailerModal 
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerUrl={trailerUrl}
      />
    </div>
  );
};