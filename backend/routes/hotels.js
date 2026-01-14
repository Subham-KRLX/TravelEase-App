const express = require('express');
const router = express.Router();
const {
    searchHotels,
    getHotelById,
    getNearbyHotels,
    getPopularDestinations,
    getAllHotels
} = require('../controllers/hotelController');

router.get('/search', searchHotels);
router.get('/nearby', getNearbyHotels);
router.get('/popular-destinations', getPopularDestinations);
router.get('/debug/all', getAllHotels);
router.get('/:id', getHotelById);

module.exports = router;
