import React from 'react';

export const MovieForm = ({ movie, setMovie, onSubmit, submitLabel }) => (
  <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[
      { label: 'Title', name: 'title', type: 'text', required: true },
      { label: 'Poster URL', name: 'poster_url', type: 'text', required: true },
      { label: 'Release Date', name: 'release_date', type: 'date' },
      { label: 'Trailer URL', name: 'trailer_url', type: 'text' },
      { label: 'Genre', name: 'genre', type: 'text' },
    ].map(({ label, name, type, required }) => (
      <div key={name} className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <input
          required={required}
          type={type}
          value={movie[name]}
          onChange={(e) => setMovie({ ...movie, [name]: e.target.value })}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>
    ))}

    <div className="space-y-2 md:col-span-2">
      <label className="text-sm font-medium text-gray-400">Description</label>
      <textarea
        required
        value={movie.description}
        onChange={(e) => setMovie({ ...movie, description: e.target.value })}
        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600 h-24"
      />
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-400">Category</label>
      <select
        value={movie.category}
        onChange={(e) => setMovie({ ...movie, category: e.target.value })}
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
      {submitLabel}
    </button>
  </form>
);