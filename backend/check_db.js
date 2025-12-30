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
                'destination.city': 'Delhi'
            });

            if (oneFlight) {
                console.log('Found Pune->Delhi Flight:');
                console.log(JSON.stringify(oneFlight, null, 2));
                console.log('Departure Date Value:', oneFlight.departure.date);

                // Check specifically for today's date (ignoring time)
                const searchDate = new Date('2025-12-29');
                const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
                const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

                const todayFlights = await Flight.countDocuments({
                    'origin.city': 'Pune',
                    'destination.city': 'Delhi',
                    'departure.date': { $gte: startOfDay, $lte: endOfDay }
                });
                console.log(`Flights for 2025-12-29: ${todayFlights}`);

            } else {
                console.log('No Pune->Delhi flights found.');
            }
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkFlights();
