import React, { useEffect, useState } from 'react';
import { tmdb, getImageUrl } from '../api';
import { MovieCard, MovieSkeleton } from '../components/MovieCardProps';
import { ChevronRight, Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroMovie, setHeroMovie] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [trendingRes, popularRes, topRatedRes] = await Promise.all([
          tmdb.getTrending(),
          tmdb.getPopular(),
          tmdb.getTopRated(),
        ]);

        const trendingResults = trendingRes?.data?.results || [];
        const popularResults = popularRes?.data?.results || [];
        const topRatedResults = topRatedRes?.data?.results || [];

        setTrending(trendingResults);
        setPopular(popularResults);
        setTopRated(topRatedResults);

        // Safe hero movie selection
        if (trendingResults.length > 0) {
          const randomIndex = Math.floor(Math.random() * trendingResults.length);
          setHeroMovie(trendingResults[randomIndex]);
        } else {
          setHeroMovie(null);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 px-4 max-w-7xl mx-auto space-y-12">
        <div className="h-[70vh] bg-zinc-900 rounded-3xl animate-pulse" />
        <section>
          <div className="h-8 bg-zinc-900 w-48 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => <MovieSkeleton key={i} />)}
          </div>
        </section>
      </div>
    );
  }

  // TMDB API key missing or API returned empty
  if (!loading && !heroMovie && trending.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 text-center">
        <Play size={64} className="text-red-600 mb-4" />
        <h1 className="text-3xl font-bold mb-2">TMDB API Key Missing</h1>
        <p className="text-gray-400 max-w-md">
          Please add your <strong>TMDB_API_KEY</strong> to the environment variables to fetch movie data.
          You can get one for free at{' '}
          <a
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            className="text-red-500 underline"
          >
            themoviedb.org
          </a>.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      {heroMovie && (
        <div className="relative h-[85vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={getImageUrl(heroMovie.backdrop_path, 'original')}
              alt={heroMovie.title || heroMovie.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center max-w-2xl">
            <span className="text-red-500 font-bold tracking-widest text-sm mb-4 uppercase">
              Trending Today
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              {heroMovie.title || heroMovie.name}
            </h1>
            <p className="text-gray-300 text-lg mb-8 line-clamp-3 max-w-xl">
              {heroMovie.overview}
            </p>
            <div className="flex items-center gap-4">
              <Link
                to={`/movie/${heroMovie.id}`}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105"
              >
                <Play fill="white" size={20} /> Watch Now
              </Link>
              <Link
                to={`/movie/${heroMovie.id}`}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                <Info size={20} /> More Info
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10 space-y-16">
        <MovieSection title="Trending Now" items={trending} />
        <MovieSection title="Popular Movies" items={popular} />
        <MovieSection title="Top Rated" items={topRated} />
      </div>
    </div>
  );
};

// Movie Section Component
const MovieSection = ({ title, items }) => (
  <section>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        {title} <ChevronRight className="text-red-600" />
      </h2>
      <Link to="/movies" className="text-sm text-gray-500 hover:text-white transition-colors">
        View All
      </Link>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {items.slice(0, 10).map((item) => (
        <MovieCard key={item.id} movie={item} />
      ))}
    </div>
  </section>
);