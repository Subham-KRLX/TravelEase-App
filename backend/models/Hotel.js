const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        city: {
            type: String,
            required: true,
            index: true
        },
        address: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: 'India'
        },
        coordinates: {
            latitude: Number,
            longitude: Number
        },
        nearbyAttractions: [{
            name: String,
            distance: String
        }]
    },
    images: [{
        url: String,
        caption: String
    }],
    rating: {
        average: {
            type: Number,
            default: 4.0,
            min: 1,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    starRating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    amenities: [{
        type: String,
        enum: [
            'Free WiFi',
            'Swimming Pool',
            'Gym',
            'Spa',
            'Restaurant',
            'Bar',
            'Room Service',
            'Free Parking',
            'Airport Shuttle',
            'Pet Friendly',
            'Air Conditioning',
            'Business Center',
            'Laundry Service',
            'Concierge',
            '24/7 Front Desk'
        ]
    }],
    roomTypes: [{
        type: {
            type: String,
            required: true
        },
        description: String,
        capacity: Number,
        price: Number,
        available: {
            type: Number,
            default: 10
        },
        amenities: [String]
    }],
    policies: {
        checkIn: {
            type: String,
            default: '2:00 PM'
        },
        checkOut: {
            type: String,
            default: '11:00 AM'
        },
        cancellation: {
            type: String,
            default: 'Free cancellation up to 24 hours before check-in'
        }
    },
    contactInfo: {
        phone: String,
        email: String,
        website: String
    }
}, {
    timestamps: true
});

// Indexes for efficient searching
hotelSchema.index({ 'location.city': 1 });
hotelSchema.index({ pricePerNight: 1 });
hotelSchema.index({ 'rating.average': -1 });
hotelSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });

module.exports = mongoose.model('Hotel', hotelSchema);
