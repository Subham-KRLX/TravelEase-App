require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb+srv://subhamsangwan_db_user:kouXxQOlptMDHJpz@cluster0.3mdmkal.mongodb.net/travelease?retryWrites=true&w=majority&appName=Cluster0';

async function verify() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const flights = await mongoose.connection.db.collection('flights').countDocuments();
        console.log('Flights count:', flights);

        const packages = await mongoose.connection.db.collection('packages').countDocuments();
        console.log('Packages count:', packages);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
