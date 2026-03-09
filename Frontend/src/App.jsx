import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, fetchFavorites } from './store';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { MovieDetails } from './pages/MovieDEtails';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // console.log(state.auth,token)

  useEffect(() => {
    if (token) {
      dispatch(fetchFavorites());
    }
  }, [token, dispatch]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/:type/:id" element={<MovieDetails />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/favorites" element={user ? <Profile /> : <Navigate to="/login" />} />
      
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/movies" element={<Home />} />
          <Route path="/tv" element={<Home />} />
        </Routes>
      </main>

      <footer className="py-12 border-t border-white/10 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-400 bg-clip-text text-transparent mb-4">
            THUNDER SHOW
          </p>
          <p className="text-gray-500 text-sm">
            © 2026  THUNDER SHOW. All rights reserved. Powered by TMDB API.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}