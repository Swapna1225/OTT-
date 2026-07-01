const Rating = require('../models/Rating');
const Movie = require('../models/Movie');

exports.rateMovie = async (req, res, next) => {
  try {
    const { movieId, score } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const rating = await Rating.findOneAndUpdate(
      { user: req.user._id, movie: movieId },
      { score },
      { upsert: true, new: true, runValidators: true }
    );

    const stats = await Rating.aggregate([
      { $match: { movie: movie._id } },
      { $group: { _id: null, average: { $avg: '$score' }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      movie.rating = Math.round(stats[0].average * 10) / 10;
      await movie.save();
    }

    res.json({ rating, average: stats[0]?.average || score, count: stats[0]?.count || 1 });
  } catch (error) {
    next(error);
  }
};

exports.getUserRating = async (req, res, next) => {
  try {
    const rating = await Rating.findOne({ user: req.user._id, movie: req.params.movieId });
    res.json({ rating: rating?.score || 0 });
  } catch (error) {
    next(error);
  }
};

exports.getMovieRatings = async (req, res, next) => {
  try {
    const stats = await Rating.aggregate([
      { $match: { movie: new (require('mongoose').Types.ObjectId)(req.params.movieId) } },
      { $group: { _id: null, average: { $avg: '$score' }, count: { $sum: 1 } } },
    ]);
    res.json({ average: stats[0]?.average || 0, count: stats[0]?.count || 0 });
  } catch (error) {
    next(error);
  }
};
