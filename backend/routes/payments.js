const express = require('express');
const router = express.Router();
const {
    createPaymentIntent,
    confirmPayment,
    getPaymentStatus
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/:id/status', getPaymentStatus);

module.exports = router;
