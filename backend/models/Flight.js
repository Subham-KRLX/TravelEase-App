const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    airline: {
        name: {
            type: String,
            required: true
        },
        logo: String,
        code: String // e.g., 'AI' for Air India, '6E' for IndiGo
    },
    aircraft: {
        type: String,
        default: 'Boeing 737'
    },
    origin: {
        city: {
            type: String,
            required: true
        },
        airport: {
            type: String,
            required: true
        },
        airportCode: {
            type: String,
            required: true,
            uppercase: true
        },
        terminal: String
    },
    destination: {
        city: {
            type: String,
            required: true
        },
        airport: {
            type: String,
            required: true
        },
        airportCode: {
            type: String,
            required: true,
            uppercase: true
        },
        terminal: String
    },
    departure: {
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required: true
        }
    },
    arrival: {
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required: true
        }
    },
    duration: {
        type: String,
        required: true // e.g., "2h 30m"
    },
    price: {
        economy: {
            type: Number,
            required: true
        },
        business: {
            type: Number,
            default: function () { return this.price.economy * 3; }
        },
        firstClass: {
            type: Number,
            default: function () { return this.price.economy * 5; }
        }
    },
    availableSeats: {
        economy: {
            type: Number,
            required: true,
            default: 150
        },
        business: {
            type: Number,
            default: 30
        },
        firstClass: {
            type: Number,
            default: 10
        }
    },
    stops: {
        type: Number,
        default: 0,
        min: 0
    },
    amenities: [{
        type: String,
        enum: ['WiFi', 'Meals', 'Entertainment', 'Power Outlets', 'Extra Legroom']
    }],
    rating: {
        type: Number,
        default: 4.0,
        min: 1,
        max: 5
    },
    status: {
        type: String,
        enum: ['scheduled', 'boarding', 'departed', 'arrived', 'cancelled', 'delayed'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});

// Index for efficient searching
flightSchema.index({ 'origin.city': 1, 'destination.city': 1, 'departure.date': 1 });
flightSchema.index({ 'airline.name': 1 });
flightSchema.index({ 'price.economy': 1 });

module.exports = mongoose.model('Flight', flightSchema);
