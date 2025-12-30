const Package = require('../models/Package');

// @desc    Search packages with filters
// @route   GET /api/packages/search
// @access  Public
exports.searchPackages = async (req, res) => {
    try {
        const {
            destination,
            minPrice,
            maxPrice,
            duration,
            sortBy = 'price'
        } = req.query;

        let query = {};

        if (destination) {
            query.destination = new RegExp(destination, 'i');
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (duration) {
            query.duration = new RegExp(duration, 'i');
        }

        // Execute query with sorting
        let sortOption = {};
        switch (sortBy) {
            case 'price_low':
                sortOption.price = 1;
                break;
            case 'price_high':
                sortOption.price = -1;
                break;
            case 'rating':
                sortOption.rating = -1;
                break;
            default:
                sortOption.price = 1;
        }

        const packages = await Package.find(query).sort(sortOption);

        res.status(200).json({
            status: 'success',
            results: packages.length,
            data: {
                packages
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get package by ID
// @route   GET /api/packages/:id
// @access  Public
exports.getPackageById = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);

        if (!package) {
            return res.status(404).json({
                status: 'error',
                message: 'Package not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                package
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// @desc    Get popular packages
// @route   GET /api/packages/popular
// @access  Public
exports.getPopularPackages = async (req, res) => {
    try {
        const packages = await Package.find({ isPopular: true }).limit(6);

        res.status(200).json({
            status: 'success',
            data: {
                packages
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
