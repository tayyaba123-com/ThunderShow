import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, User, LogOut, Film, Tv, TrendingUp, Heart } from 'lucide-react';
import { logout } from '../store';

export const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-400 bg-clip-text text-transparent"
          >
             THUNDER SHOW
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-2">
              <TrendingUp size={16} /> Trending
            </Link>
            <Link to="/movies" className="hover:text-white transition-colors flex items-center gap-2">
              <Film size={16} /> Movies
            </Link>
            <Link to="/tv" className="hover:text-white transition-colors flex items-center gap-2">
              <Tv size={16} /> TV Shows
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/search" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Search size={20} />
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/favorites"
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-red-500"
              >
                <Heart size={20} fill="currentColor" />
              </Link>
              <div className="group relative">
                <button className="flex items-center gap-2 p-1 pr-3 hover:bg-white/10 rounded-full transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-sm font-bold">
                    {user.email[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{user.email.split('@')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg text-sm"
                  >
                    <User size={16} /> Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg text-sm text-amber-500"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      dispatch(logout());
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-500/10 text-red-500 rounded-lg text-sm mt-1"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full text-sm font-bold transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};