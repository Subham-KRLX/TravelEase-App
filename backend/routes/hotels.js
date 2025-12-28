const express = require('express');
const router = express.Router();
const {
    searchHotels,
    getHotelById,
    getNearbyHotels,
    getPopularDestinations
} = require('../controllers/hotelController');

router.get('/search', searchHotels);
router.get('/nearby', getNearbyHotels);
router.get('/popular-destinations', getPopularDestinations);
router.get('/:id', getHotelById);

module.exports = router;
