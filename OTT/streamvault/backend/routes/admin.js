const { Router } = require('express');
const { getUsers, deleteMovie, updateMovie } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = Router();

router.get('/users', protect, admin, getUsers);
router.delete('/movies/:id', protect, admin, deleteMovie);
router.put('/movies/:id', protect, admin, updateMovie);

module.exports = router;
