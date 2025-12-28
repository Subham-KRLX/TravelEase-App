const Hotel = require('../models/Hotel');

// @desc    Search hotels with filters
// @route   GET /api/hotels/search
// @access  Public
exports.searchHotels = async (req, res) => {
    try {
        const {
            city,
            checkIn,
            checkOut,
            guests = 1,
            rooms = 1,
            minPrice,
            maxPrice,
            minRating,
            amenities,
            sortBy = 'rating'
        } = req.query;

        // Build query
        let query = {};

        if (city) {
            query['location.city'] = new RegExp(city, 'i');
        }

        // Price filter
        if (minPrice || maxPrice) {
            query.pricePerNight = {};
            if (minPrice) query.pricePerNight.$gte = parseFloat(minPrice);
            if (maxPrice) query.pricePerNight.$lte = parseFloat(maxPrice);
        }

        // Rating filter
        if (minRating) {
            query['rating.average'] = { $gte: parseFloat(minRating) };
        }

        // Amenities filter
        if (amenities) {
            const amenitiesList = amenities.split(',');
            query.amenities = { $all: amenitiesList };
        }

        // Execute query with sorting
        let sortOption = {};
        switch (sortBy) {
            case 'price_low':
                sortOption.pricePerNight = 1;
                break;
            case 'price_high':
                sortOption.pricePerNight = -1;
                break;
            case 'rating':
                sortOption['rating.average'] = -1;
                break;
            case 'name':
                sortOption.name = 1;
                break;
            default:
                sortOption['rating.average'] = -1;
        }

        const hotels = await Hotel.find(query).sort(sortOption);

        res.status(200).json({
            status: 'success',
            results: hotels.length,
            data: {
                hotels
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                status: 'error',
                message: 'Hotel not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                hotel
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get nearby hotels (geospatial search)
// @route   GET /api/hotels/nearby
// @access  Public
exports.getNearbyHotels = async (req, res) => {
    try {
        const { latitude, longitude, maxDistance = 10000 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide latitude and longitude'
            });
        }

        const hotels = await Hotel.find({
            'location.coordinates': {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        });

        res.status(200).json({
            status: 'success',
            results: hotels.length,
            data: {
                hotels
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get popular destinations
// @route   GET /api/hotels/popular-destinations
// @access  Public
exports.getPopularDestinations = async (req, res) => {
    try {
        const destinations = await Hotel.aggregate([
            {
                $group: {
                    _id: '$location.city',
                    hotelCount: { $sum: 1 },
                    avgPrice: { $avg: '$pricePerNight' },
                    avgRating: { $avg: '$rating.average' }
                }
            },
            { $sort: { hotelCount: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                destinations
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
