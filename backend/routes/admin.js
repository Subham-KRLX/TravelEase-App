const express = require('express');
const router = express.Router();
const {
    getAllFlights,
    createFlight,
    updateFlight,
    deleteFlight,
    getAllHotels,
    createHotel,
    updateHotel,
    deleteHotel,
    getAllBookings
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

// All routes are protected and restricted to admins
router.use(protect);
router.use(restrictTo('admin'));

// Flight management
router.route('/flights')
    .get(getAllFlights)
    .post(createFlight);

router.route('/flights/:id')
    .put(updateFlight)
    .delete(deleteFlight);

// Hotel management
router.route('/hotels')
    .get(getAllHotels)
    .post(createHotel);

router.route('/hotels/:id')
    .put(updateHotel)
    .delete(deleteHotel);

// Booking management
router.get('/bookings', getAllBookings);

module.exports = router;
