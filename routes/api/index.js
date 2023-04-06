const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

// Create api routes for users and thoughts

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;