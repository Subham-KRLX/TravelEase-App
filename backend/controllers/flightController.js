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

        console.log('🔍 Flight Search Params:', { origin, destination, departureDate, passengers });

        // Build query
        let query = {};

        // More flexible origin matching
        if (origin && origin.trim()) {
            const originTrim = origin.trim();
            // Match either city name or airport code
            query.$or = [
                { 'origin.city': new RegExp(originTrim, 'i') },
                { 'origin.airportCode': new RegExp(originTrim, 'i') }
            ];
        }

        // More flexible destination matching
        if (destination && destination.trim()) {
            const destTrim = destination.trim();
            const destQuery = {
                $or: [
                    { 'destination.city': new RegExp(destTrim, 'i') },
                    { 'destination.airportCode': new RegExp(destTrim, 'i') }
                ]
            };
            
            // Combine with existing OR condition or create new one
            if (query.$or) {
                query.$and = [
                    { $or: query.$or },
                    destQuery
                ];
                delete query.$or;
            } else {
                query.$or = destQuery.$or;
            }
        }

        if (departureDate && departureDate.trim()) {
            try {
                const date = new Date(departureDate.trim());
                const nextDay = new Date(date);
                nextDay.setDate(date.getDate() + 1);
                query['departure.date'] = { $gte: date, $lt: nextDay };
            } catch (e) {
                console.warn('Invalid departure date format:', departureDate);
            }
        }

        if (airline && airline.trim()) {
            query['airline.name'] = new RegExp(airline.trim(), 'i');
        }

        if (stops !== undefined && stops !== null && stops !== '') {
            query.stops = parseInt(stops);
        }

        if (maxPrice && !isNaN(parseFloat(maxPrice))) {
            query[`price.${travelClass}`] = { $lte: parseFloat(maxPrice) };
        }

        // Ensure enough seats available (more lenient)
        const passengersInt = parseInt(passengers) || 1;
        query[`availableSeats.${travelClass}`] = { $gte: passengersInt };

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

        console.log('📋 Query object:', JSON.stringify(query, null, 2));
        
        const flights = await Flight.find(query).sort(sortOption).limit(50);
        
        console.log(`✅ Found ${flights.length} flights`);

        res.status(200).json({
            status: 'success',
            results: flights.length,
            message: flights.length === 0 ? 'No flights found for your search criteria' : `Found ${flights.length} flights`,
            data: {
                flights
            }
        });
    } catch (error) {
        console.error('❌ Flight search error:', error);
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

// @desc    Get all flights (debug endpoint)
// @route   GET /api/flights/debug/all
// @access  Public
exports.getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.find().limit(10);
        
        res.status(200).json({
            status: 'success',
            count: flights.length,
            data: {
                flights: flights.map(f => ({
                    id: f._id,
                    origin: f.origin?.city,
                    destination: f.destination?.city,
                    airline: f.airline?.name,
                    price: f.price?.economy,
                    departure: f.departure?.date
                }))
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
