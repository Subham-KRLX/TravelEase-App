require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User');
const seedFlights = require('./flightSeeder');
const seedHotels = require('./hotelSeeder');
const seedPackages = require('./packageSeeder');

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Connect to MongoDB
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await require('../models/Flight').deleteMany({});
        await require('../models/Hotel').deleteMany({});
        await require('../models/Package').deleteMany({}); // Added clearing for packages
        await require('../models/Booking').deleteMany({});
        await require('../models/Review').deleteMany({});
        console.log('✅ Existing data cleared\n');

        // ... existing user creation ...
        // Create admin user
        console.log('👤 Creating admin user...');
        const adminUser = await User.create({
            name: 'Admin User',
            email: process.env.ADMIN_EMAIL || 'admin@travelease.com',
            password: process.env.ADMIN_PASSWORD || 'admin123',
            phone: '+91-9876543210',
            role: 'admin'
        });
        console.log(`✅ Admin user created: ${adminUser.email}\n`);

        // Create demo user
        console.log('👤 Creating demo user...');
        const demoUser = await User.create({
            name: 'Demo User',
            email: 'demo@travelease.com',
            password: 'demo123',
            phone: '+91-9876543211',
            role: 'user'
        });
        console.log(`✅ Demo user created: ${demoUser.email}\n`);

        // Seed flights
        const flightsCount = await seedFlights();
        console.log(`\n✅ Total flights seeded: ${flightsCount}\n`);

        // Seed hotels
        const hotelsCount = await seedHotels();
        console.log(`\n✅ Total hotels seeded: ${hotelsCount}\n`);

        // Seed packages
        const packagesCount = await seedPackages();
        console.log(`\n✅ Total packages seeded: ${packagesCount}\n`);

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📝 Summary:');
        console.log(`   - Admin User: ${process.env.ADMIN_EMAIL || 'admin@travelease.com'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
        console.log(`   - Demo User: demo@travelease.com / demo123`);
        console.log(`   - Flights: ${flightsCount}`);
        console.log(`   - Hotels: ${hotelsCount}`);
        console.log(`   - Packages: ${packagesCount}`);
        console.log('\n✨ You can now start the server with: npm start\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
