import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Shield, Users, Film, Trash2, Plus, Edit, X, Ban } from 'lucide-react';
import axios from 'axios';

export const AdminDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [customMovies, setCustomMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [showEditMovie, setShowEditMovie] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [newMovie, setNewMovie] = useState({
    title: '', poster_url: '', description: '', release_date: '', trailer_url: '', genre: '', category: ''
  });

  const fetchData = async () => {
    try {
      const [usersRes, moviesRes] = await Promise.all([
        axios.get('http://localhost:3000/api/admin/users', { 
          headers: { 'Authorization': `Bearer ${token}` },
          
          withCredentials: true 
        }),
        axios.get('http://localhost:3000/api/admin/movies', {
          withCredentials: true 
        }),
      ]);
      // setUsers(usersRes.data);
      console.log(usersRes)
      setCustomMovies(moviesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    if (user?.role === 'admin') fetchData();
  }, [user, token]);

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${id}`, { 
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true 
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/movies/${id}`, { 
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true 
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/admin/movies', newMovie, { 
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true 
      });
      setShowAddMovie(false);
      setNewMovie({ title: '', poster_url: '', description: '', release_date: '', trailer_url: '', genre: '', category: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const handleBanUser = async (id) => {
    if (!confirm('Ban this user?')) return;
    try {
      await axios.put(`http://localhost:3000/api/admin/users/${id}/ban`, {}, { 
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true 
      });
      fetchData();
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleUnbanUser = async (id) => {
    if (!confirm('Unban this user?')) return;
    try {
      await axios.put(`http://localhost:3000/api/admin/users/${id}/unban`, {}, { 
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true 
      });
      fetchData();
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setNewMovie({
      title: movie.title,
      poster_url: movie.poster_url,
      description: movie.description,
      release_date: movie.release_date,
      trailer_url: movie.trailer_url,
      genre: movie.genre,
      category: movie.category
    });
    setShowEditMovie(true);
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/admin/movies/${editingMovie._id}`, newMovie, { 
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true 
      });
      setShowEditMovie(false);
      setEditingMovie(null);
      setNewMovie({ title: '', poster_url: '', description: '', release_date: '', trailer_url: '', genre: '', category: '' });
      fetchData();
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield size={64} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-500">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-black flex items-center gap-4">
          <Shield className="text-amber-500" size={40} /> Admin Dashboard
        </h1>
        <button 
          onClick={() => setShowAddMovie(true)}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Add Custom Movie
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* User Management */}
        <section className="bg-zinc-900 rounded-3xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Users className="text-blue-500" /> User Management
          </h2>
          <div className="space-y-4">
            {users.map((u) => (
              <div key={u.id || u._id} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                <div className="flex-1">
                  <p className="font-bold">{u.email}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">{u.role} {u.isBanned && '• BANNED'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {u.isBanned ? (
                    <button 
                      onClick={() => handleUnbanUser(u.id || u._id)}
                      className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all text-xs font-bold"
                      title="Unban user"
                    >
                      Unban
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleBanUser(u.id || u._id)}
                      disabled={(u.id || u._id) === user.id}
                      className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-all disabled:opacity-0"
                      title="Ban user"
                    >
                      <Ban size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteUser(u.id || u._id)}
                    disabled={(u.id || u._id) === user.id}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Movies */}
        <section className="bg-zinc-900 rounded-3xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Film className="text-purple-500" /> Custom Movies
          </h2>
          <div className="space-y-4">
            {customMovies.map((m) => (
              <div key={m.id || m._id} className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5">
                <img src={m.poster_url} alt={m.title} className="w-12 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="font-bold">{m.title}</p>
                  <p className="text-xs text-gray-500">{m.category} • {m.genre}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditMovie(m)}
                    className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteMovie(m._id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {customMovies.length === 0 && (
              <p className="text-center text-gray-500 py-8">No custom movies added yet.</p>
            )}
          </div>
        </section>
      </div>

      {/* Add Movie Modal */}
      {showAddMovie && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 w-full max-w-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Add Custom Movie</h2>
              <button onClick={() => setShowAddMovie(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddMovie} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Title</label>
                <input 
                  required
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Poster URL</label>
                <input 
                  required
                  value={newMovie.poster_url}
                  onChange={(e) => setNewMovie({...newMovie, poster_url: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea 
                  required
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600 h-24"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Release Date</label>
                <input 
                  type="date"
                  value={newMovie.release_date}
                  onChange={(e) => setNewMovie({...newMovie, release_date: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Trailer URL (YouTube)</label>
                <input 
                  value={newMovie.trailer_url}
                  onChange={(e) => setNewMovie({...newMovie, trailer_url: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Genre</label>
                <input 
                  value={newMovie.genre}
                  onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Category</label>
                <select 
                  value={newMovie.category}
                  onChange={(e) => setNewMovie({...newMovie, category: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="movie">Movie</option>
                  <option value="tv">TV Show</option>
                </select>
              </div>
              
              <button 
                type="submit"
                className="md:col-span-2 py-4 bg-red-600 hover:bg-red-700 rounded-2xl font-bold transition-all"
              >
                Add Movie
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Movie Modal */}
      {showEditMovie && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 w-full max-w-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Edit Movie</h2>
              <button onClick={() => { setShowEditMovie(false); setEditingMovie(null); }} className="p-2 hover:bg-white/10 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateMovie} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Title</label>
                <input 
                  required
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Poster URL</label>
                <input 
                  required
                  value={newMovie.poster_url}
                  onChange={(e) => setNewMovie({...newMovie, poster_url: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea 
                  required
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600 h-24"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Release Date</label>
                <input 
                  type="date"
                  value={newMovie.release_date}
                  onChange={(e) => setNewMovie({...newMovie, release_date: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Trailer URL (YouTube)</label>
                <input 
                  value={newMovie.trailer_url}
                  onChange={(e) => setNewMovie({...newMovie, trailer_url: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Genre</label>
                <input 
                  value={newMovie.genre}
                  onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Category</label>
                <select 
                  value={newMovie.category}
                  onChange={(e) => setNewMovie({...newMovie, category: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="movie">Movie</option>
                  <option value="tv">TV Show</option>
                </select>
              </div>
              
              <button 
                type="submit"
                className="md:col-span-2 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all"
              >
                Update Movie
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}