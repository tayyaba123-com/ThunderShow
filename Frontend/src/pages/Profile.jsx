import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MovieCard } from '../components/MovieCardProps';
import { Heart, History, User as UserIcon, Shield } from 'lucide-react';
import axios from 'axios';

export const Profile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [favRes, histRes] = await Promise.all([
          axios.get('/api/favorites', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/history', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setFavorites(favRes.data);
        setHistory(histRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  if (!user) return null;

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-zinc-900 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center gap-8 border border-white/10">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center text-5xl font-black shadow-2xl">
          {user.email[0].toUpperCase()}
        </div>
        <div className="text-center md:text-left">
          <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
            <h1 className="text-3xl font-bold">{user.email.split('@')[0]}</h1>
            {user.role === 'admin' && (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-500 rounded text-xs font-bold flex items-center gap-1">
                <Shield size={12} /> ADMIN
              </span>
            )}
          </div>
          <p className="text-gray-400 flex items-center gap-2 justify-center md:justify-start">
            <UserIcon size={16} /> {user.email}
          </p>
        </div>
      </div>

      <div className="space-y-16">
        {/* Favorites */}
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Heart className="text-red-500" fill="currentColor" /> My Favorites
          </h2>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {favorites.map((fav) => (
                <MovieCard
                  key={fav.id}
                  movie={{
                    id: fav.movie_id,
                    title: fav.title,
                    poster_path: fav.poster_path,
                    media_type: fav.media_type
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/5 rounded-2xl p-12 text-center">
              <p className="text-gray-500">You haven't added any favorites yet.</p>
            </div>
          )}
        </section>

        {/* History */}
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <History className="text-blue-500" /> Watch History
          </h2>
          {history.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {history.map((item) => (
                <MovieCard
                  key={item.id}
                  movie={{
                    id: item.movie_id,
                    title: item.title,
                    poster_path: item.poster_path,
                    media_type: item.media_type
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/5 rounded-2xl p-12 text-center">
              <p className="text-gray-500">Your watch history is empty.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};