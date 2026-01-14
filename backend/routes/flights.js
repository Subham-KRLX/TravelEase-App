const express = require('express');
const router = express.Router();
const {
    searchFlights,
    getFlightById,
    getPopularRoutes,
    getAllFlights
} = require('../controllers/flightController');

router.get('/search', searchFlights);
router.get('/popular-routes', getPopularRoutes);
router.get('/debug/all', getAllFlights);
router.get('/:id', getFlightById);

module.exports = router;
