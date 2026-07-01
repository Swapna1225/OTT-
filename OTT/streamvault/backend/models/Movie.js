const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  releaseYear: {
    type: Number,
  },
  genres: [{
    type: String,
    trim: true,
  }],
  duration: {
    type: Number,
  },
  posterUrl: {
    type: String,
    default: '',
  },
  backdropUrl: {
    type: String,
    default: '',
  },
  trailerUrl: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  maturityRating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'],
    default: 'TV-MA',
  },
  isMovie: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genres: 1 });
movieSchema.index({ isMovie: 1, featured: 1 });

module.exports = mongoose.model('Movie', movieSchema);
