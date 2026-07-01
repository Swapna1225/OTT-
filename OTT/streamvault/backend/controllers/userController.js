const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');
const User = require('../models/User');

exports.getWatchlist = async (req, res, next) => {
  try {
    const items = await Watchlist.find({ user: req.user._id })
      .populate('movie')
      .sort('-addedAt');
    res.json({ watchlist: items.map(i => i.movie).filter(Boolean) });
  } catch (error) {
    next(error);
  }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const existing = await Watchlist.findOne({ user: req.user._id, movie: movieId });
    if (existing) {
      return res.status(400).json({ message: 'Already in watchlist' });
    }

    await Watchlist.create({ user: req.user._id, movie: movieId });
    res.status(201).json({ message: 'Added to watchlist' });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const result = await Watchlist.findOneAndDelete({
      user: req.user._id,
      movie: req.params.movieId,
    });
    if (!result) {
      return res.status(404).json({ message: 'Not in watchlist' });
    }
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    next(error);
  }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const { movieId, progress } = req.body;
    const user = await User.findById(req.user._id);

    const existingIndex = user.watchHistory.findIndex(
      w => w.movie.toString() === movieId
    );

    if (existingIndex > -1) {
      user.watchHistory[existingIndex].progress = progress;
      user.watchHistory[existingIndex].watchedAt = new Date();
    } else {
      user.watchHistory.push({ movie: movieId, progress });
    }

    await user.save();
    res.json({ message: 'Progress updated' });
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('watchHistory.movie')
      .sort({ 'watchHistory.watchedAt': -1 });
    res.json({ history: user.watchHistory.filter(w => w.movie).slice(0, 50) });
  } catch (error) {
    next(error);
  }
};
