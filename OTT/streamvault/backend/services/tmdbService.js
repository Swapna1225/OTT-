const axios = require('axios');
const { tmdbApiKey, tmdbBaseUrl } = require('../config/env');

const api = axios.create({
  baseURL: tmdbBaseUrl,
  params: { api_key: tmdbApiKey, language: 'en-US' },
});

exports.fetchTrending = async (type = 'movie', count = 20) => {
  try {
    const { data } = await api.get(`/trending/${type}/week`, {
      params: { page: Math.ceil(count / 20) },
    });
    return data.results.slice(0, count);
  } catch (error) {
    console.error('TMDB fetch error:', error.message);
    return [];
  }
};

exports.fetchPopular = async (type = 'movie', page = 1) => {
  try {
    const { data } = await api.get(`/${type}/popular`, { params: { page } });
    return data;
  } catch (error) {
    console.error('TMDB fetch error:', error.message);
    return { results: [], total_pages: 0 };
  }
};

exports.fetchByGenre = async (type = 'movie', genreId, page = 1) => {
  try {
    const { data } = await api.get(`/discover/${type}`, {
      params: { with_genres: genreId, page, sort_by: 'popularity.desc' },
    });
    return data;
  } catch (error) {
    console.error('TMDB fetch error:', error.message);
    return { results: [], total_pages: 0 };
  }
};

exports.fetchGenres = async (type = 'movie') => {
  try {
    const { data } = await api.get(`/genre/${type}/list`);
    return data.genres;
  } catch (error) {
    console.error('TMDB fetch error:', error.message);
    return [];
  }
};

exports.search = async (query, page = 1) => {
  try {
    const { data } = await api.get('/search/multi', {
      params: { query, page },
    });
    return data;
  } catch (error) {
    console.error('TMDB search error:', error.message);
    return { results: [], total_pages: 0 };
  }
};

exports.fetchDetails = async (type, id) => {
  try {
    const { data } = await api.get(`/${type}/${id}`, {
      params: { append_to_response: 'videos,credits,similar' },
    });
    return data;
  } catch (error) {
    console.error('TMDB details error:', error.message);
    return null;
  }
};
