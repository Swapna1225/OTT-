const { Router } = require('express');
const { body } = require('express-validator');
const { rateMovie, getUserRating, getMovieRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();

router.post('/', protect, [
  body('movieId').isMongoId().withMessage('Valid movie ID required'),
  body('score').isInt({ min: 1, max: 10 }).withMessage('Score must be 1-10'),
  validate,
], rateMovie);

router.get('/:movieId/user', protect, getUserRating);
router.get('/:movieId', getMovieRatings);

module.exports = router;
