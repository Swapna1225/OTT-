const Movie = require('../models/Movie');
const tmdbService = require('../services/tmdbService');

exports.getFeatured = async (req, res, next) => {
  try {
    const featured = await Movie.findOne({ featured: true }).sort('-createdAt');
    if (!featured) {
      const movies = await Movie.find().limit(1).sort('-createdAt');
      return res.json({ movie: movies[0] || null });
    }
    res.json({ movie: featured });
  } catch (error) {
    next(error);
  }
};

exports.getMovies = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, genre, sort = '-createdAt' } = req.query;
    const filter = { isMovie: true };
    if (genre) filter.genres = { $in: [genre] };

    const movies = await Movie.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Movie.countDocuments(filter);

    res.json({
      movies,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getSeries = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, genre } = req.query;
    const filter = { isMovie: false };
    if (genre) filter.genres = { $in: [genre] };

    const series = await Movie.find(filter)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Movie.countDocuments(filter);

    res.json({
      series,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ movie });
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const movies = await Movie.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Movie.countDocuments({ $text: { $search: q } });

    res.json({ movies, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

exports.getGenres = async (req, res, next) => {
  try {
    const movieGenres = await Movie.distinct('genres', { isMovie: true });
    const seriesGenres = await Movie.distinct('genres', { isMovie: false });
    res.json({ movieGenres, seriesGenres });
  } catch (error) {
    next(error);
  }
};

exports.syncFromTMDB = async (req, res, next) => {
  try {
    const { type = 'movie', count = 20 } = req.body;
    const movies = await tmdbService.fetchTrending(type, count);

    let synced = 0;
    for (const item of movies) {
      const exists = await Movie.findOne({ tmdbId: item.id });
      if (!exists) {
        await Movie.create({
          tmdbId: item.id,
          title: item.title || item.name,
          description: item.overview,
          releaseYear: new Date(item.release_date || item.first_air_date).getFullYear() || 0,
          genres: item.genre_ids || [],
          posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
          backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '',
          rating: item.vote_average || 0,
          isMovie: type === 'movie',
        });
        synced++;
      }
    }

    res.json({ message: `Synced ${synced} new titles from TMDB`, total: synced });
  } catch (error) {
    next(error);
  }
};
