const mongoose = require('mongoose');
const Flight = require('./models/Flight');
require('dotenv').config();

const checkFlights = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const count = await Flight.countDocuments();
        console.log(`Total Flights: ${count}`);

        if (count === 0) {
            console.log('Database is empty. You need to run: npm run seed');
        } else {
            const oneFlight = await Flight.findOne({
                'origin.city': 'Pune',
                'destination.city': 'Mumbai'
            });

            if (oneFlight) {
                console.log('Found Pune->Mumbai Flight:');
                console.log(JSON.stringify(oneFlight, null, 2));
                console.log('Departure Date Value:', oneFlight.departure.date);
            } else {
                console.log('No Pune->Mumbai flights found.');
            }
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkFlights();
