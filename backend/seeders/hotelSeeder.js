const Hotel = require('../models/Hotel');

const cities = [
    { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
    { city: 'Delhi', country: 'India', lat: 28.7041, lng: 77.1025 },
    { city: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946 },
    { city: 'Hyderabad', country: 'India', lat: 17.3850, lng: 78.4867 },
    { city: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707 },
    { city: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639 },
    { city: 'Pune', country: 'India', lat: 18.5204, lng: 73.8567 },
    { city: 'Goa', country: 'India', lat: 15.2993, lng: 74.1240 },
    { city: 'Jaipur', country: 'India', lat: 26.9124, lng: 75.7873 },
    { city: 'Jodhpur', country: 'India', lat: 26.2389, lng: 73.0243 },
    { city: 'Ajmer', country: 'India', lat: 26.4499, lng: 74.6399 },
    { city: 'Indore', country: 'India', lat: 22.7196, lng: 75.8577 },
    { city: 'Lucknow', country: 'India', lat: 26.8467, lng: 80.9462 },
    { city: 'Kochi', country: 'India', lat: 9.9312, lng: 76.2673 },
    { city: 'Visakhapatnam', country: 'India', lat: 17.6869, lng: 83.2185 },
    { city: 'Vijayawada', country: 'India', lat: 16.5062, lng: 80.6480 },
    { city: 'Srinagar', country: 'India', lat: 34.0837, lng: 74.7973 },
    { city: 'Bhopal', country: 'India', lat: 23.1815, lng: 79.9864 },
    { city: 'Nagpur', country: 'India', lat: 21.1458, lng: 79.0882 },
    { city: 'Chandigarh', country: 'India', lat: 30.7333, lng: 76.7794 },
    { city: 'Ludhiana', country: 'India', lat: 30.9010, lng: 75.8573 },
    { city: 'Udaipur', country: 'India', lat: 24.5854, lng: 73.7125 },
    { city: 'Shimla', country: 'India', lat: 31.7771, lng: 77.1025 },
    { city: 'Thiruvananthapuram', country: 'India', lat: 8.5241, lng: 76.9366 },
    { city: 'Coimbatore', country: 'India', lat: 11.0026, lng: 76.7153 },
    { city: 'Vadodara', country: 'India', lat: 22.3072, lng: 73.1812 },
    { city: 'Surat', country: 'India', lat: 21.1458, lng: 72.8479 },
    { city: 'Mangalore', country: 'India', lat: 12.9352, lng: 74.8597 },
    { city: 'Amritsar', country: 'India', lat: 31.6340, lng: 74.8711 },
    { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
    { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { city: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 }
];

const hotelNamePrefixes = ['Grand', 'Royal', 'Taj', 'Oberoi', 'ITC', 'Hyatt', 'Marriott', 'Radisson', 'Holiday Inn', 'Novotel', 'Ibis', 'Lemon Tree', 'The Leela', 'JW Marriott', 'Westin', 'Sheraton', 'Hilton', 'Crowne Plaza'];
const hotelNameSuffixes = ['Palace', 'Hotel', 'Suites', 'Residency', 'Resort', 'Inn', 'Plaza', 'Tower', 'Grand Hotel'];

const hotelAmenities = [
    'Free WiFi', 'Swimming Pool', 'Gym', 'Spa', 'Restaurant', 'Bar',
    'Room Service', 'Free Parking', 'Airport Shuttle', 'Pet Friendly',
    'Air Conditioning', 'Business Center', 'Laundry Service', 'Concierge',
    '24/7 Front Desk'
];

const roomTypes = [
    { type: 'Deluxe Room', capacity: 2, amenities: ['King Bed', 'WiFi', 'TV', 'Mini Bar'] },
    { type: 'Executive Suite', capacity: 3, amenities: ['King Bed', 'Living Room', 'WiFi', 'Work Desk'] },
    { type: 'Family Room', capacity: 4, amenities: ['Two Queen Beds', 'WiFi', 'TV', 'Coffee Maker'] },
    { type: 'Presidential Suite', capacity: 4, amenities: ['Master Bedroom', 'Living Room', 'Dining Area', 'Butler Service'] }
];

const attractions = {
    Mumbai: ['Gateway of India - 2km', 'Marine Drive - 3km', 'Juhu Beach - 5km'],
    Delhi: ['India Gate - 1.5km', 'Red Fort - 2km', 'Qutub Minar - 8km'],
    Bangalore: ['Lalbagh Botanical Garden - 3km', 'Cubbon Park - 2km', 'Bangalore Palace - 4km'],
    Hyderabad: ['Charminar - 1km', 'Golconda Fort - 5km', 'Hussain Sagar Lake - 3km'],
    Chennai: ['Marina Beach - 2km', 'Kapaleeshwarar Temple - 3km', 'Fort St. George - 1.5km'],
    Kolkata: ['Victoria Memorial - 2km', 'Howrah Bridge - 3km', 'Indian Museum - 1km'],
    Pune: ['Shaniwar Wada - 2km', 'Aga Khan Palace - 5km', 'Sinhagad Fort - 25km'],
    Goa: ['Baga Beach - 1km', 'Basilica of Bom Jesus - 3km', 'Fort Aguada - 4km'],
    Jaipur: ['Hawa Mahal - 1km', 'City Palace - 1.5km', 'Amber Fort - 10km'],
    Jodhpur: ['Mehrangarh Fort - 2km', 'Jaswant Thada - 3km', 'Clock Tower - 1km'],
    Ajmer: ['Ajmer Sharif Dargah - 1km', 'Ana Sagar Lake - 2km', 'Narayani Mata Temple - 3km'],
    Indore: ['Rajwada Palace - 1km', 'Lal Bagh Palace - 2km', 'Sardar Bazar - 1.5km'],
    Lucknow: ['Bara Imambara - 2km', 'Chota Imambara - 2.5km', 'Hazratgunj - 1km'],
    Kochi: ['Fort Kochi - 1km', 'Chinese Fishing Nets - 2km', 'Paradesi Synagogue - 1.5km'],
    Visakhapatnam: ['Visakha Museum - 2km', 'Kailasagiri - 5km', 'Ramakrishna Beach - 3km'],
    Vijayawada: ['Kanaka Durga Temple - 1km', 'Undavalli Caves - 4km', 'Sri Ranganathaswamy Temple - 2km'],
    Srinagar: ['Dal Lake - 1km', 'Mughal Gardens - 3km', 'Jama Masjid - 1.5km'],
    Bhopal: ['Bhoj Wetland - 5km', 'Sanchi Stupa - 40km', 'Van Vihar National Park - 5km'],
    Nagpur: ['Deekshabhoomi - 1km', 'Futala Lake - 2km', 'Ambazari Lake - 3km'],
    Chandigarh: ['Rock Garden - 3km', 'Rose Garden - 2km', 'Capitol Complex - 5km'],
    Ludhiana: ['Phillaur Fort - 5km', 'Gurudwara Sis Ganj - 2km', 'Lodhi Garden - 1km'],
    Udaipur: ['City Palace - 1km', 'Lake Palace - 2km', 'Jagdish Temple - 1.5km'],
    Shimla: ['Jakhoo Temple - 2km', 'Mall Road - 1km', 'Kali Bari Temple - 1.5km'],
    Thiruvananthapuram: ['Padmanabhaswamy Temple - 1km', 'Napier Museum - 1.5km', 'Kanyakumari - 90km'],
    Coimbatore: ['Nilgiris - 40km', 'Avinashi - 20km', 'Mahalingeshwara Temple - 2km'],
    Vadodara: ['Lakshmi Vilas Palace - 2km', 'Baroda Museum - 2.5km', 'Kirti Mandir - 3km'],
    Surat: ['Dumas Beach - 5km', 'Dutch Garden - 2km', 'Chintamani Jain Temple - 1km'],
    Mangalore: ['Panambur Beach - 3km', 'Basilica of Our Lady of Rosary - 2km', 'Mangala Devi Temple - 4km'],
    Amritsar: ['Golden Temple - 1km', 'Jallianwala Bagh - 2km', 'Partition Museum - 2.5km'],
    Dubai: ['Burj Khalifa - 2km', 'Dubai Mall - 1.5km', 'Palm Jumeirah - 5km'],
    Singapore: ['Marina Bay Sands - 1km', 'Gardens by the Bay - 2km', 'Sentosa - 5km'],
    Bangkok: ['Grand Palace - 2km', 'Wat Pho - 1.5km', 'Chatuchak Market - 10km']
};

const descriptions = [
    'Experience luxury and comfort in the heart of the city with world-class amenities and exceptional service.',
    'A perfect blend of traditional hospitality and modern conveniences for the discerning traveler.',
    'Elegant accommodation with stunning views and premium facilities for a memorable stay.',
    'Contemporary design meets classic elegance in this premier destination for business and leisure travelers.',
    'Enjoy unparalleled comfort with spacious rooms, fine dining, and state-of-the-art facilities.'
];

const generateHotels = () => {
    const hotels = [];

    cities.forEach(city => {
        // Generate 20-35 hotels per city (increased from 15-25)
        const hotelsInCity = Math.floor(Math.random() * 16) + 20;

        for (let i = 0; i < hotelsInCity; i++) {
            const prefix = hotelNamePrefixes[Math.floor(Math.random() * hotelNamePrefixes.length)];
            const suffix = hotelNameSuffixes[Math.floor(Math.random() * hotelNameSuffixes.length)];
            const name = `${prefix} ${city.city} ${suffix}`;

            const starRating = Math.floor(Math.random() * 3) + 3; // 3-5 stars
            const basePrice = starRating === 3 ? Math.floor(Math.random() * 3000) + 2000 :
                starRating === 4 ? Math.floor(Math.random() * 5000) + 4000 :
                    Math.floor(Math.random() * 10000) + 8000;

            // Select random amenities (more for higher star ratings)
            const amenityCount = starRating === 3 ? 6 : starRating === 4 ? 10 : 13;
            const selectedAmenities = [...hotelAmenities]
                .sort(() => Math.random() - 0.5)
                .slice(0, amenityCount);

            // Generate room types with pricing
            const hotelRoomTypes = roomTypes.map(rt => ({
                type: rt.type,
                description: `Spacious ${rt.type.toLowerCase()} with ${rt.capacity} guests capacity`,
                capacity: rt.capacity,
                price: basePrice + (rt.capacity * 500),
                available: Math.floor(Math.random() * 5) + 5,
                amenities: rt.amenities
            }));

            hotels.push({
                name: name,
                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                location: {
                    city: city.city,
                    address: `${Math.floor(Math.random() * 999) + 1}, Main Road, ${city.city}`,
                    country: city.country,
                    coordinates: {
                        latitude: city.lat + (Math.random() - 0.5) * 0.1,
                        longitude: city.lng + (Math.random() - 0.5) * 0.1
                    },
                    nearbyAttractions: (attractions[city.city] || []).map(attr => ({
                        name: attr.split(' - ')[0],
                        distance: attr.split(' - ')[1]
                    }))
                },
                images: [
                    { url: `https://via.placeholder.com/800x600?text=${name.replace(/ /g, '+')}+Exterior`, caption: 'Hotel Exterior' },
                    { url: `https://via.placeholder.com/800x600?text=Deluxe+Room`, caption: 'Deluxe Room' },
                    { url: `https://via.placeholder.com/800x600?text=Swimming+Pool`, caption: 'Swimming Pool' },
                    { url: `https://via.placeholder.com/800x600?text=Restaurant`, caption: 'Restaurant' },
                    { url: `https://via.placeholder.com/800x600?text=Lobby`, caption: 'Lobby' }
                ],
                rating: {
                    average: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
                    count: Math.floor(Math.random() * 500) + 100
                },
                starRating: starRating,
                pricePerNight: basePrice,
                amenities: selectedAmenities,
                roomTypes: hotelRoomTypes,
                policies: {
                    checkIn: ['12:00 PM', '1:00 PM', '2:00 PM'][Math.floor(Math.random() * 3)],
                    checkOut: ['10:00 AM', '11:00 AM', '12:00 PM'][Math.floor(Math.random() * 3)],
                    cancellation: ['Free cancellation up to 24 hours before check-in', 'Free cancellation up to 48 hours before check-in'][Math.floor(Math.random() * 2)]
                },
                contactInfo: {
                    phone: `+91-${Math.floor(Math.random() * 900000000) + 1000000000}`,
                    email: `info@${name.toLowerCase().replace(/ /g, '')}.com`,
                    website: `www.${name.toLowerCase().replace(/ /g, '')}.com`
                }
            });
        }
    });

    return hotels;
};

const seedHotels = async () => {
    try {
        console.log('🏨 Generating hotel data...');
        const hotelsData = generateHotels();

        console.log(`✅ Generated ${hotelsData.length} hotels`);
        console.log('💾 Inserting into database...');

        await Hotel.insertMany(hotelsData);

        console.log('✅ Hotels seeded successfully!');
        return hotelsData.length;
    } catch (error) {
        console.error('❌ Error seeding hotels:', error);
        throw error;
    }
};

module.exports = seedHotels;
