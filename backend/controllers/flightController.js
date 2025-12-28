const Flight = require('../models/Flight');

// @desc    Search flights with filters
// @route   GET /api/flights/search
// @access  Public
exports.searchFlights = async (req, res) => {
    try {
        const {
            origin,
            destination,
            departureDate,
            returnDate,
            passengers = 1,
            class: travelClass = 'economy',
            maxPrice,
            airline,
            stops,
            sortBy = 'price'
        } = req.query;

        // Build query
        let query = {};

        if (origin) {
            query['origin.city'] = new RegExp(origin, 'i');
        }

        if (destination) {
            query['destination.city'] = new RegExp(destination, 'i');
        }

        if (departureDate) {
            const date = new Date(departureDate);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            query['departure.date'] = { $gte: date, $lt: nextDay };
        }

        if (airline) {
            query['airline.name'] = new RegExp(airline, 'i');
        }

        if (stops !== undefined) {
            query.stops = parseInt(stops);
        }

        if (maxPrice) {
            query[`price.${travelClass}`] = { $lte: parseFloat(maxPrice) };
        }

        // Ensure enough seats available
        query[`availableSeats.${travelClass}`] = { $gte: parseInt(passengers) };

        // Execute query with sorting
        let sortOption = {};
        switch (sortBy) {
            case 'price':
                sortOption[`price.${travelClass}`] = 1;
                break;
            case 'duration':
                sortOption.duration = 1;
                break;
            case 'departure':
                sortOption['departure.date'] = 1;
                break;
            case 'rating':
                sortOption.rating = -1;
                break;
            default:
                sortOption[`price.${travelClass}`] = 1;
        }

        const flights = await Flight.find(query).sort(sortOption);

        res.status(200).json({
            status: 'success',
            results: flights.length,
            data: {
                flights
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get flight by ID
// @route   GET /api/flights/:id
// @access  Public
exports.getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);

        if (!flight) {
            return res.status(404).json({
                status: 'error',
                message: 'Flight not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                flight
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get popular routes
// @route   GET /api/flights/popular-routes
// @access  Public
exports.getPopularRoutes = async (req, res) => {
    try {
        const popularRoutes = await Flight.aggregate([
            {
                $group: {
                    _id: {
                        origin: '$origin.city',
                        destination: '$destination.city'
                    },
                    count: { $sum: 1 },
                    minPrice: { $min: '$price.economy' },
                    airlines: { $addToSet: '$airline.name' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                routes: popularRoutes
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
