const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getBookingById,
    cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', createBooking);
router.get('/', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
