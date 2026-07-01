import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const content = {
  getFeatured: () => api.get('/content/featured'),
  getMovies: (params) => api.get('/content/movies', { params }),
  getSeries: (params) => api.get('/content/series', { params }),
  getMovieById: (id) => api.get(`/content/${id}`),
  search: (params) => api.get('/content/search', { params }),
  getGenres: () => api.get('/content/genres'),
  syncFromTMDB: (data) => api.post('/content/sync', data),
};

export const user = {
  getWatchlist: () => api.get('/user/watchlist'),
  addToWatchlist: (movieId) => api.post('/user/watchlist', { movieId }),
  removeFromWatchlist: (movieId) => api.delete(`/user/watchlist/${movieId}`),
  updateProgress: (data) => api.post('/user/progress', data),
  getHistory: () => api.get('/user/history'),
};

export const ratings = {
  rateMovie: (data) => api.post('/ratings', data),
  getUserRating: (movieId) => api.get(`/ratings/${movieId}/user`),
  getMovieRatings: (movieId) => api.get(`/ratings/${movieId}`),
};

export const admin = {
  getUsers: (params) => api.get('/admin/users', { params }),
  deleteMovie: (id) => api.delete(`/admin/movies/${id}`),
  updateMovie: (id, data) => api.put(`/admin/movies/${id}`, data),
};

export default api;
