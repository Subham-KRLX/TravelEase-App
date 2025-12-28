const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingType: {
        type: String,
        enum: ['flight', 'hotel'],
        required: true
    },
    // Reference to either Flight or Hotel
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight'
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel'
    },
    // Flight-specific details
    flightDetails: {
        passengers: [{
            firstName: String,
            lastName: String,
            age: Number,
            gender: String,
            seatNumber: String
        }],
        class: {
            type: String,
            enum: ['economy', 'business', 'firstClass']
        }
    },
    // Hotel-specific details
    hotelDetails: {
        checkInDate: Date,
        checkOutDate: Date,
        numberOfNights: Number,
        roomType: String,
        numberOfRooms: {
            type: Number,
            default: 1
        },
        guests: [{
            firstName: String,
            lastName: String,
            age: Number
        }]
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentId: String,
    bookingStatus: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'],
        default: 'confirmed'
    },
    bookingReference: {
        type: String,
        unique: true,
        required: true
    },
    cancellationReason: String,
    cancelledAt: Date
}, {
    timestamps: true
});

// Generate unique booking reference before saving
bookingSchema.pre('save', async function (next) {
    if (!this.bookingReference) {
        const prefix = this.bookingType === 'flight' ? 'FL' : 'HT';
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.bookingReference = `${prefix}${Date.now()}${randomString}`;
    }
    next();
});

// Index for efficient querying
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingReference: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
