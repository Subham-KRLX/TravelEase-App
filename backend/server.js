require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const seedDatabase = require('./seeders');

// Initialize Express app
const app = express();

// Connect to MongoDB and seed data if needed
connectDB().then(async () => {
    try {
        // Check if database has data
        const Flight = require('./models/Flight');
        const flightCount = await Flight.countDocuments();
        
        console.log(`\n📊 Database Status:
        - Connected: ✅
        - Flights in DB: ${flightCount}
        `);
        
        // If no flights exist, seed the database
        if (flightCount === 0) {
            console.log('📊 No data found in database. Auto-seeding...');
            await seedDatabase();
            console.log('✅ Database seeding completed!');
        } else {
            console.log(`✅ Database already contains ${flightCount} flights. Skipping seed.`);
        }
    } catch (error) {
        console.error('⚠️  Seeding error:', error.message);
    }
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Allow all origins, no credentials (cookies) needed for Bearer auth
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Request logging

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/flights', require('./routes/flights'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'TravelEase API is running!',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server Status:
    - Running on: http://localhost:${PORT}
    - Environment: ${process.env.NODE_ENV || 'development'}
    - API Base: http://localhost:${PORT}/api
    `);
});
