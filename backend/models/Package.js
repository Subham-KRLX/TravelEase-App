const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true,
        index: true
    },
    duration: {
        type: String, // e.g., "5 Days, 4 Nights"
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 1,
        max: 5
    },
    includes: [{
        type: String,
        enum: ['Flight', 'Hotel', 'Breakfast', 'Lunch', 'Dinner', 'Transfer', 'Sightseeing', 'Guide', 'Activities', 'Visa']
    }],
    itinerary: [{
        day: Number,
        title: String,
        activities: [String]
    }],
    images: [String],
    isPopular: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

packageSchema.index({ destination: 1, price: 1 });

module.exports = mongoose.model('Package', packageSchema);
