const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Admin: Get all flights
// @route   GET /api/admin/flights
// @access  Private/Admin
exports.getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: flights.length,
            data: { flights }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Admin: Create flight
// @route   POST /api/admin/flights
// @access  Private/Admin
exports.createFlight = async (req, res) => {
    try {
        const flight = await Flight.create(req.body);

        res.status(201).json({
            status: 'success',
            data: { flight }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Admin: Update flight
// @route   PUT /api/admin/flights/:id
// @access  Private/Admin
exports.updateFlight = async (req, res) => {
    try {
        const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!flight) {
            return res.status(404).json({
                status: 'error',
                message: 'Flight not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { flight }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Admin: Delete flight
// @route   DELETE /api/admin/flights/:id
// @access  Private/Admin
exports.deleteFlight = async (req, res) => {
    try {
        const flight = await Flight.findByIdAndDelete(req.params.id);

        if (!flight) {
            return res.status(404).json({
                status: 'error',
                message: 'Flight not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Flight deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Similar methods for hotels
exports.getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find().sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', results: hotels.length, data: { hotels } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.createHotel = async (req, res) => {
    try {
        const hotel = await Hotel.create(req.body);
        res.status(201).json({ status: 'success', data: { hotel } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!hotel) return res.status(404).json({ status: 'error', message: 'Hotel not found' });
        res.status(200).json({ status: 'success', data: { hotel } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) return res.status(404).json({ status: 'error', message: 'Hotel not found' });
        res.status(200).json({ status: 'success', message: 'Hotel deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('flight')
            .populate('hotel')
            .sort({ createdAt: -1 });

        res.status(200).json({ status: 'success', results: bookings.length, data: { bookings } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
