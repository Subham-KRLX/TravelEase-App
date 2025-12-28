const Flight = require('../models/Flight');

const airlines = [
    { name: 'Air India', code: 'AI', logo: 'https://via.placeholder.com/100x50?text=Air+India' },
    { name: 'IndiGo', code: '6E', logo: 'https://via.placeholder.com/100x50?text=IndiGo' },
    { name: 'SpiceJet', code: 'SG', logo: 'https://via.placeholder.com/100x50?text=SpiceJet' },
    { name: 'Vistara', code: 'UK', logo: 'https://via.placeholder.com/100x50?text=Vistara' },
    { name: 'Emirates', code: 'EK', logo: 'https://via.placeholder.com/100x50?text=Emirates' },
    { name: 'Singapore Airlines', code: 'SQ', logo: 'https://via.placeholder.com/100x50?text=Singapore' },
    { name: 'Qatar Airways', code: 'QR', logo: 'https://via.placeholder.com/100x50?text=Qatar' }
];

const indianCities = [
    { city: 'Mumbai', airport: 'Chhatrapati Shivaji Maharaj International Airport', airportCode: 'BOM', terminal: 'T2' },
    { city: 'Delhi', airport: 'Indira Gandhi International Airport', airportCode: 'DEL', terminal: 'T3' },
    { city: 'Bangalore', airport: 'Kempegowda International Airport', airportCode: 'BLR', terminal: 'T1' },
    { city: 'Hyderabad', airport: 'Rajiv Gandhi International Airport', airportCode: 'HYD', terminal: 'T1' },
    { city: 'Chennai', airport: 'Chennai International Airport', airportCode: 'MAA', terminal: 'T1' },
    { city: 'Kolkata', airport: 'Netaji Subhas Chandra Bose International Airport', airportCode: 'CCU', terminal: 'T2' },
    { city: 'Pune', airport: 'Pune Airport', airportCode: 'PNQ', terminal: 'T1' },
    { city: 'Ahmedabad', airport: 'Sardar Vallabhbhai Patel International Airport', airportCode: 'AMD', terminal: 'T1' },
    { city: 'Goa', airport: 'Dabolim Airport', airportCode: 'GOI', terminal: 'T1' },
    { city: 'Jaipur', airport: 'Jaipur International Airport', airportCode: 'JAI', terminal: 'T1' },
    { city: 'Jodhpur', airport: 'Jodhpur Airport', airportCode: 'JDH', terminal: 'T1' },
    { city: 'Ajmer', airport: 'Kishangarh Airport', airportCode: 'KGB', terminal: 'T1' },
    { city: 'Indore', airport: 'Devi Ahilya Bai Holkar Airport', airportCode: 'IDR', terminal: 'T1' },
    { city: 'Lucknow', airport: 'Amausi Airport', airportCode: 'LKO', terminal: 'T1' },
    { city: 'Kochi', airport: 'Kochi International Airport', airportCode: 'COK', terminal: 'T1' },
    { city: 'Visakhapatnam', airport: 'Visakhapatnam Airport', airportCode: 'VTZ', terminal: 'T1' },
    { city: 'Vijayawada', airport: 'Vijayawada Airport', airportCode: 'VGA', terminal: 'T1' },
    { city: 'Srinagar', airport: 'Srinagar International Airport', airportCode: 'SXR', terminal: 'T1' },
    { city: 'Bhopal', airport: 'Raja Bhoj Airport', airportCode: 'BHO', terminal: 'T1' },
    { city: 'Nagpur', airport: 'Dr. Babasaheb Ambedkar International Airport', airportCode: 'NAG', terminal: 'T1' },
    { city: 'Chandigarh', airport: 'Chandigarh International Airport', airportCode: 'IXC', terminal: 'T1' },
    { city: 'Ludhiana', airport: 'Ludhiana Airport', airportCode: 'LDH', terminal: 'T1' },
    { city: 'Udaipur', airport: 'Udaipur Airport', airportCode: 'UDR', terminal: 'T1' },
    { city: 'Shimla', airport: 'Shimla Airport', airportCode: 'SLV', terminal: 'T1' },
    { city: 'Thiruvananthapuram', airport: 'Trivandrum International Airport', airportCode: 'TRV', terminal: 'T1' },
    { city: 'Coimbatore', airport: 'Coimbatore International Airport', airportCode: 'CJB', terminal: 'T1' },
    { city: 'Vadodara', airport: 'Vadodara Airport', airportCode: 'BDQ', terminal: 'T1' },
    { city: 'Surat', airport: 'Surat Airport', airportCode: 'STV', terminal: 'T1' },
    { city: 'Mangalore', airport: 'Mangaluru International Airport', airportCode: 'BLR', terminal: 'T1' },
    { city: 'Amritsar', airport: 'Sri Guru Ramdas Ji International Airport', airportCode: 'ATQ', terminal: 'T1' }
];

const internationalCities = [
    { city: 'Dubai', airport: 'Dubai International Airport', airportCode: 'DXB', terminal: 'T3' },
    { city: 'Singapore', airport: 'Changi Airport', airportCode: 'SIN', terminal: 'T3' },
    { city: 'London', airport: 'Heathrow Airport', airportCode: 'LHR', terminal: 'T5' },
    { city: 'New York', airport: 'John F. Kennedy International Airport', airportCode: 'JFK', terminal: 'T4' },
    { city: 'Bangkok', airport: 'Suvarnabhumi Airport', airportCode: 'BKK', terminal: 'T1' }
];

const allCities = [...indianCities, ...internationalCities];

const amenities = ['WiFi', 'Meals', 'Entertainment', 'Power Outlets', 'Extra Legroom'];

// Helper function to generate random time
const generateTime = () => {
    const hour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
    const minute = ['00', '15', '30', '45'][Math.floor(Math.random() * 4)];
    return `${hour}:${minute}`;
};

// Helper function to calculate duration
const calculateDuration = (hours, minutes = 0) => {
    return `${hours}h ${minutes}m`;
};

// Helper function to generate date
const generateDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
};

const generateFlights = () => {
    const flights = [];
    let flightCounter = 1;

    // Generate flights for next 30 days
    for (let day = 0; day < 30; day++) {
        // Domestic flights
        for (let i = 0; i < indianCities.length; i++) {
            for (let j = 0; j < indianCities.length; j++) {
                if (i !== j) {
                    // Generate 2-3 flights per route per day
                    const flightsPerRoute = Math.floor(Math.random() * 2) + 2;

                    for (let f = 0; f < flightsPerRoute; f++) {
                        const airline = airlines[Math.floor(Math.random() * 4)]; // Only Indian airlines for domestic
                        const departureTime = generateTime();
                        const durationHours = Math.floor(Math.random() * 3) + 1;
                        const durationMinutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];

                        const departureDate = generateDate(day);
                        const arrivalDate = new Date(departureDate);
                        arrivalDate.setHours(arrivalDate.getHours() + durationHours);
                        arrivalDate.setMinutes(arrivalDate.getMinutes() + durationMinutes);

                        const basePrice = Math.floor(Math.random() * 5000) + 3000; // 3000-8000 INR

                        flights.push({
                            flightNumber: `${airline.code}${flightCounter++}`,
                            airline: airline,
                            aircraft: ['Boeing 737', 'Airbus A320', 'Boeing 787'][Math.floor(Math.random() * 3)],
                            origin: indianCities[i],
                            destination: indianCities[j],
                            departure: {
                                date: departureDate,
                                time: departureTime
                            },
                            arrival: {
                                date: arrivalDate,
                                time: generateTime()
                            },
                            duration: calculateDuration(durationHours, durationMinutes),
                            price: {
                                economy: basePrice,
                                business: basePrice * 3,
                                firstClass: basePrice * 5
                            },
                            availableSeats: {
                                economy: Math.floor(Math.random() * 50) + 100,
                                business: Math.floor(Math.random() * 10) + 20,
                                firstClass: Math.floor(Math.random() * 5) + 5
                            },
                            stops: Math.random() > 0.7 ? 1 : 0,
                            amenities: amenities.filter(() => Math.random() > 0.5),
                            rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
                            status: 'scheduled'
                        });
                    }
                }
            }
        }

        // International flights (fewer)
        for (let i = 0; i < 3; i++) {
            const indianCity = indianCities[Math.floor(Math.random() * 3)]; // Major cities only
            const intlCity = internationalCities[Math.floor(Math.random() * internationalCities.length)];
            const airline = airlines[Math.floor(Math.random() * airlines.length)];

            const departureTime = generateTime();
            const durationHours = Math.floor(Math.random() * 8) + 4; // 4-12 hours

            const departureDate = generateDate(day);
            const arrivalDate = new Date(departureDate);
            arrivalDate.setHours(arrivalDate.getHours() + durationHours);

            const basePrice = Math.floor(Math.random() * 30000) + 20000; // 20000-50000 INR

            flights.push({
                flightNumber: `${airline.code}${flightCounter++}`,
                airline: airline,
                aircraft: ['Boeing 777', 'Airbus A380', 'Boeing 787'][Math.floor(Math.random() * 3)],
                origin: indianCity,
                destination: intlCity,
                departure: {
                    date: departureDate,
                    time: departureTime
                },
                arrival: {
                    date: arrivalDate,
                    time: generateTime()
                },
                duration: calculateDuration(durationHours, 0),
                price: {
                    economy: basePrice,
                    business: basePrice * 3,
                    firstClass: basePrice * 5
                },
                availableSeats: {
                    economy: Math.floor(Math.random() * 100) + 150,
                    business: Math.floor(Math.random() * 20) + 30,
                    firstClass: Math.floor(Math.random() * 8) + 10
                },
                stops: Math.random() > 0.6 ? 1 : 0,
                amenities: ['WiFi', 'Meals', 'Entertainment', 'Power Outlets'],
                rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5-5.0
                status: 'scheduled'
            });
        }
    }

    return flights.slice(0, 2000); // Increased from 500 to 2000 flights for better coverage
};

const seedFlights = async () => {
    try {
        console.log('🛫 Generating flight data...');
        const flightsData = generateFlights();

        console.log(`✅ Generated ${flightsData.length} flights`);
        console.log('💾 Inserting into database...');

        await Flight.insertMany(flightsData);

        console.log('✅ Flights seeded successfully!');
        return flightsData.length;
    } catch (error) {
        console.error('❌ Error seeding flights:', error);
        throw error;
    }
};

module.exports = seedFlights;
