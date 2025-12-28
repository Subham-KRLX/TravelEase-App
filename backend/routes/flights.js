const express = require('express');
const router = express.Router();
const {
    searchFlights,
    getFlightById,
    getPopularRoutes
} = require('../controllers/flightController');

router.get('/search', searchFlights);
router.get('/popular-routes', getPopularRoutes);
router.get('/:id', getFlightById);

module.exports = router;
