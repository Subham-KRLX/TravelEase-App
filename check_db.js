const mongoose = require('mongoose');
const Flight = require('./backend/models/Flight');
require('dotenv').config({ path: './backend/.env' });

const checkFlights = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const count = await Flight.countDocuments();
        console.log(`Total Flights: ${count}`);

        const oneFlight = await Flight.findOne({
            'origin.city': 'Pune',
            'destination.city': 'Mumbai'
        });

        if (oneFlight) {
            console.log('Found Pune->Mumbai Flight:');
            console.log(JSON.stringify(oneFlight, null, 2));
            console.log('Departure Date Type:', typeof oneFlight.departure.date);
            console.log('Departure Date Value:', oneFlight.departure.date);
        } else {
            console.log('No Pune->Mumbai flights found.');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkFlights();
