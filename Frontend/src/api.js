import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Use an environment variable for the backend URL, defaulting to localhost for local work
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

const BACKEND_URL="https://thundarshow-98a1cgq7a-tayyaba123-coms-projects.vercel.app/api"
export const backend = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// Auth endpoints
export const authAPI = {
  register: (data) => backend.post('/auth/register', data),
  login: (data) => backend.post('/auth/login', data),
  logout: () => backend.get('/auth/logout'),
  getMe: () => backend.get('/auth/get-me'),
};

// Favorites endpoints
export const favoritesAPI = {
  getAll: () => backend.get('/favorites'),
  add: (data) => backend.post('/favorites', data),
  remove: (movieId) => backend.delete(`/favorites/${movieId}`),
};

// History endpoints
export const historyAPI = {
  getAll: () => backend.get('/history'),
  add: (data) => backend.post('/history', data),
};

// Admin endpoints
export const adminAPI = {
  getUsers: () => backend.get('/admin/users'),
  getMovies: () => backend.get('/admin/movies'),
  addMovie: (data) => backend.post('/admin/movies', data),
  deleteUser: (id) => backend.delete(`/admin/users/${id}`),
  deleteMovie: (id) => backend.delete(`/admin/movies/${id}`),
  updateMovie: (id, data) => backend.put(`/admin/movies/${id}`, data),
};

export const tmdb = {
  getTrending: (type = 'movie', time = 'day', page = 1) =>
    axios.get(`${BASE_URL}/trending/${type}/${time}`, {
      params: { api_key: TMDB_API_KEY, page },
    }),

  getPopular: (type = 'movie', page = 1) =>
    axios.get(`${BASE_URL}/${type}/popular`, {
      params: { api_key: TMDB_API_KEY, page },
    }),

  getTopRated: (type = 'movie', page = 1) =>
    axios.get(`${BASE_URL}/${type}/top_rated`, {
      params: { api_key: TMDB_API_KEY, page },
    }),

  getDetails: (type, id) =>
    axios.get(`${BASE_URL}/${type}/${id}`, {
      params: { api_key: TMDB_API_KEY, append_to_response: 'videos,images,credits' },
    }),

  search: (query, page = 1) =>
    axios.get(`${BASE_URL}/search/multi`, {
      params: { api_key: TMDB_API_KEY, query, page },
    }),

  getGenres: (type = 'movie') =>
    axios.get(`${BASE_URL}/genre/${type}/list`, {
      params: { api_key: TMDB_API_KEY },
    }),

  getDiscover: (type = 'movie', params = {}) =>
    axios.get(`${BASE_URL}/discover/${type}`, {
      params: { api_key: TMDB_API_KEY, ...params },
    }),
};

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
export const POSTER_SIZE = 'w500';
export const BACKDROP_SIZE = 'original';

export const getImageUrl = (path, size = POSTER_SIZE) =>
  path ? `${IMAGE_BASE_URL}${size}${path}` : 'https://via.placeholder.com/500x750?text=No+Image';