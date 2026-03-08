import React, { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import { tmdb } from '../api';
import { MovieCard, MovieSkeleton } from '../components/MovieCardProps';
import { useInView } from 'react-intersection-observer';

export const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { ref, inView } = useInView();

  const performSearch = useCallback(async (searchQuery, searchPage, append = false) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const res = await tmdb.search(searchQuery, searchPage);
      const newResults = res.data.results.filter((r) => r.media_type !== 'person');
      setResults(prev => append ? [...prev, ...newResults] : newResults);
      setHasMore(res.data.page < res.data.total_pages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      performSearch(query, 1);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      performSearch(query, nextPage, true);
    }
  }, [inView, hasMore, loading, page, query, performSearch]);

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="relative max-w-2xl mx-auto mb-12">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies, TV shows..."
          className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((movie) => (
            <MovieCard key={`${movie.media_type}-${movie.id}`} movie={movie} />
          ))}
          {loading && [...Array(5)].map((_, i) => <MovieSkeleton key={i} />)}
        </div>
      ) : query && !loading ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">No results found for "{query}"</p>
        </div>
      ) : !query ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">Start typing to search...</p>
        </div>
      ) : null}

      <div ref={ref} className="h-20 flex items-center justify-center">
        {loading && <Loader2 className="animate-spin text-red-600" size={32} />}
      </div>
    </div>
  );
};