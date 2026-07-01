const Movie = require('../models/Movie');

exports.getRecommendations = async (userId, limit = 10) => {
  const User = require('../models/User');
  const user = await User.findById(userId).populate('watchHistory.movie');

  if (!user?.watchHistory?.length) {
    return Movie.find({ featured: true }).limit(limit).sort('-rating');
  }

  const genreSet = new Set();
  user.watchHistory.forEach(w => {
    if (w.movie?.genres) {
      w.movie.genres.forEach(g => genreSet.add(g));
    }
  });

  const watchedIds = user.watchHistory
    .filter(w => w.movie)
    .map(w => w.movie._id);

  const recommendations = await Movie.aggregate([
    { $match: { genres: { $in: [...genreSet] }, _id: { $nin: watchedIds } } },
    { $addFields: { matchScore: { $size: { $setIntersection: ['$genres', [...genreSet]] } } } },
    { $sort: { matchScore: -1, rating: -1 } },
    { $limit: limit },
  ]);

  return recommendations;
};

exports.getTrending = async (limit = 20) => {
  return Movie.find().sort('-rating').limit(limit);
};

exports.getContinueWatching = async (userId, limit = 10) => {
  const User = require('../models/User');
  const user = await User.findById(userId)
    .populate('watchHistory.movie')
    .sort({ 'watchHistory.watchedAt': -1 });

  if (!user?.watchHistory?.length) return [];

  return user.watchHistory
    .filter(w => w.movie && w.progress > 0 && w.progress < 100)
    .slice(0, limit)
    .map(w => ({ movie: w.movie, progress: w.progress }));
};
