const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, bookingId } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid amount'
            });
        }

        // Create payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'inr',
            metadata: {
                bookingId: bookingId || '',
                userId: req.user.id
            }
        });

        res.status(200).json({
            status: 'success',
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
exports.confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId, bookingId } = req.body;

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Update booking payment status
            const booking = await Booking.findByIdAndUpdate(
                bookingId,
                {
                    paymentStatus: 'completed',
                    paymentId: paymentIntentId
                },
                { new: true }
            );

            res.status(200).json({
                status: 'success',
                message: 'Payment confirmed successfully',
                data: {
                    booking
                }
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Payment not completed'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get payment status
// @route   GET /api/payments/:id/status
// @access  Private
exports.getPaymentStatus = async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                status: paymentIntent.status,
                amount: paymentIntent.amount / 100
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
