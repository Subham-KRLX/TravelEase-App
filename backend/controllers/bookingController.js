const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const User = require('../models/User');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        const { bookingType, itemId, details, totalPrice } = req.body;

        // Validate booking type
        if (!['flight', 'hotel'].includes(bookingType)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid booking type'
            });
        }

        // Check if item exists and has availability
        let bookingData = {
            user: req.user.id,
            bookingType,
            totalPrice
        };

        if (bookingType === 'flight') {
            const flight = await Flight.findById(itemId);
            if (!flight) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Flight not found'
                });
            }

            // Check seat availability
            const travelClass = details.class || 'economy';
            if (flight.availableSeats[travelClass] < details.passengers.length) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Not enough seats available'
                });
            }

            bookingData.flight = itemId;
            bookingData.flightDetails = details;

            // Update available seats
            flight.availableSeats[travelClass] -= details.passengers.length;
            await flight.save();
        } else {
            const hotel = await Hotel.findById(itemId);
            if (!hotel) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Hotel not found'
                });
            }

            bookingData.hotel = itemId;
            bookingData.hotelDetails = details;
        }

        // Create booking
        const booking = await Booking.create(bookingData);

        // Add booking to user's bookings
        await User.findByIdAndUpdate(req.user.id, {
            $push: { bookings: booking._id }
        });

        // Populate the booking details
        await booking.populate(bookingType);

        res.status(201).json({
            status: 'success',
            message: 'Booking created successfully',
            data: {
                booking
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get all user bookings
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('flight')
            .populate('hotel')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: {
                bookings
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('flight')
            .populate('hotel')
            .populate('user', 'name email phone');

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }

        // Check if booking belongs to user
        if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to view this booking'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                booking
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found'
            });
        }

        // Check if booking belongs to user
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to cancel this booking'
            });
        }

        // Check if booking is already cancelled
        if (booking.bookingStatus === 'cancelled') {
            return res.status(400).json({
                status: 'error',
                message: 'Booking is already cancelled'
            });
        }

        // Update booking status
        booking.bookingStatus = 'cancelled';
        booking.cancellationReason = req.body.reason || 'User cancelled';
        booking.cancelledAt = new Date();
        booking.paymentStatus = 'refunded';

        await booking.save();

        // Restore seat availability for flights
        if (booking.bookingType === 'flight') {
            const flight = await Flight.findById(booking.flight);
            if (flight) {
                const travelClass = booking.flightDetails.class;
                flight.availableSeats[travelClass] += booking.flightDetails.passengers.length;
                await flight.save();
            }
        }

        res.status(200).json({
            status: 'success',
            message: 'Booking cancelled successfully',
            data: {
                booking
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
