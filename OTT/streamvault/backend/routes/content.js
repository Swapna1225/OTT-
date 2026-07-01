const { Router } = require('express');
const { body } = require('express-validator');
const {
  getFeatured, getMovies, getSeries, getMovieById,
  search, getGenres, syncFromTMDB,
} = require('../controllers/contentController');
const { protect, admin } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();

router.get('/featured', getFeatured);
router.get('/movies', getMovies);
router.get('/series', getSeries);
router.get('/genres', getGenres);
router.get('/search', search);
router.get('/:id', getMovieById);

router.post('/sync', protect, admin, [
  body('type').optional().isIn(['movie', 'tv']),
  validate,
], syncFromTMDB);

module.exports = router;
