const { Router } = require('express');
const { body } = require('express-validator');
const {
  getWatchlist, addToWatchlist, removeFromWatchlist,
  updateProgress, getHistory,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();

router.get('/watchlist', protect, getWatchlist);
router.post('/watchlist', protect, [
  body('movieId').isMongoId().withMessage('Valid movie ID required'),
  validate,
], addToWatchlist);
router.delete('/watchlist/:movieId', protect, removeFromWatchlist);

router.post('/progress', protect, [
  body('movieId').isMongoId().withMessage('Valid movie ID required'),
  body('progress').isFloat({ min: 0, max: 100 }).withMessage('Progress must be 0-100'),
  validate,
], updateProgress);

router.get('/history', protect, getHistory);

module.exports = router;
