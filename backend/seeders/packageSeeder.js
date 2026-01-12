const Package = require('../models/Package');

const packages = [
    {
        name: 'Goa Beach Paradise',
        description: 'Experience the ultimate beach getaway in Goa. Relax on sun-kissed sands, explore vibrant markets, and enjoy thrilling water sports. This package covers North and South Goa highlights.',
        destination: 'Goa, India',
        duration: '5 Days, 4 Nights',
        price: 24999,
        image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.8,
        isPopular: true,
        includes: ['Flight', 'Hotel', 'Breakfast', 'Transfer', 'Sightseeing'],
        itinerary: [
            { day: 1, title: 'Arrival in North Goa', activities: ['Arrive at Dabolim Airport', 'Transfer to hotel', 'Evening at leisure on Baga beach'] },
            { day: 2, title: 'North Goa Sightseeing', activities: ['Visit Fort Aguada', 'Calangute beach', 'Anjuna beach market'] },
            { day: 3, title: 'South Goa Wonders', activities: ['Basilica of Bom Jesus', 'Mangueshi Temple', 'Miramar beach'] },
            { day: 4, title: 'Water Sports & Leisure', activities: ['Parasailing and Jet Ski at Calangute', 'Evening cruise on Mandovi river'] },
            { day: 5, title: 'Departure', activities: ['Breakfast at hotel', 'Shopping at Panjim market', 'Transfer to airport'] }
        ],
        images: [
            'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
    },
    {
        name: 'Heaven on Earth - Kashmir',
        description: 'Discover the breathtaking beauty of Kashmir. Shikara rides on Dal Lake, snow-capped mountains of Gulmarg, and lush valleys of Pahalgam.',
        destination: 'Kashmir, India',
        duration: '6 Days, 5 Nights',
        price: 34999,
        image: 'https://images.pexels.com/photos/1659437/pexels-photo-1659437.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.9,
        isPopular: true,
        includes: ['Flight', 'Houseboat Stay', 'Breakfast', 'Transfer', 'Sightseeing', 'Shikara Ride'],
        itinerary: [
            { day: 1, title: 'Arrival in Srinagar', activities: ['Pickup from airport', 'Check-in to Houseboat', 'Evening Shikara ride on Dal Lake'] },
            { day: 2, title: 'Srinagar Sightseeing', activities: ['Mughal Gardens (Nishat & Shalimar)', 'Shankaracharya Temple'] },
            { day: 3, title: 'Excursion to Gulmarg', activities: ['Drive to Gulmarg', 'Gondola ride', 'Snow activities'] },
            { day: 4, title: 'Pahalgam Valley', activities: ['Drive to Pahalgam', 'Visit Betaab Valley', 'Aru Valley'] },
            { day: 5, title: 'Back to Srinagar', activities: ['Shopping for pashminas and spices', 'Leisure evening'] },
            { day: 6, title: 'Departure', activities: ['Breakfast', 'Transfer to Srinagar Airport'] }
        ],
        images: [
            'https://images.pexels.com/photos/1659437/pexels-photo-1659437.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/6738593/pexels-photo-6738593.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
    },
    {
        name: 'Luxury Goa Escape',
        description: 'Indulge in a 5-star experience in South Goa. Private beach access, spa treatments, and gourmet dining.',
        destination: 'Goa, India',
        duration: '4 Days, 3 Nights',
        price: 49999,
        image: 'https://images.pexels.com/photos/261181/pexels-photo-261181.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 5.0,
        isPopular: true,
        includes: ['Flight', '5-Star Hotel', 'All Meals', 'Spa Credit', 'Transfer'],
        itinerary: [
            { day: 1, title: 'Welcome to Luxury', activities: ['Private transfer to resort', 'Welcome drink', 'Sunset dinner'] },
            { day: 2, title: 'Relaxation & Spa', activities: ['Morning yoga', 'Full body massage', 'Beach lounging'] },
            { day: 3, title: 'Cultural Tour', activities: ['Private tour of Old Goa', 'Fine dining experience'] },
            { day: 4, title: 'Departure', activities: ['Champagne breakfast', 'Transfer to airport'] }
        ],
        images: [
            'https://images.pexels.com/photos/261181/pexels-photo-261181.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]
    },
    {
        name: 'Kerala Backwaters Escape',
        description: 'Immerse yourself in the tranquility of Kerala\'s backwaters. Stay in a traditional houseboat and enjoy the serene beauty of the palm-fringed canals.',
        destination: 'Kerala, India',
        duration: '6 Days, 5 Nights',
        price: 32999,
        image: 'https://images.pexels.com/photos/247600/pexels-photo-247600.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.9,
        isPopular: true,
        includes: ['Flight', 'Hotel', 'Breakfast', 'Transfer', 'Sightseeing', 'Activities'],
        itinerary: [
            { day: 1, title: 'Arrive in Kochi', activities: ['Transfer to hotel', 'Fort Kochi sightseeing', 'Kathakali performance'] },
            { day: 2, title: 'Munnar Hill Station', activities: ['Drive to Munnar', 'Visit Tea Gardens', 'Check-in to resort'] },
            { day: 3, title: 'Munnar Exploration', activities: ['Eravikulam National Park', 'Mattupetty Dam', 'Echo Point'] },
            { day: 4, title: 'Alleppey Houseboat', activities: ['Drive to Alleppey', 'Check-in to Luxury Houseboat', 'Backwater cruise'] },
            { day: 5, title: 'Marari Beach Relaxation', activities: ['Transfer to Marari', 'Free time at beach', 'Spa treatment'] },
            { day: 6, title: 'End of Journey', activities: ['Breakfast', 'Transfer back to Kochi airport'] }
        ]
    },
    {
        name: 'Royal Rajasthan Tour',
        description: 'Step back in time to the era of kings and palaces. Explore the majestic forts and colorful cultures of Jaipur, Jodhpur, and Udaipur.',
        destination: 'Rajasthan, India',
        duration: '8 Days, 7 Nights',
        price: 45999,
        image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.7,
        isPopular: true,
        includes: ['Hotel', 'Breakfast', 'Transfer', 'Sightseeing', 'Guide'],
        itinerary: [
            { day: 1, title: 'Pink City Jaipur', activities: ['Arrival', 'Check-in', 'Evening at Chokhi Dhani'] },
            { day: 2, title: 'Jaipur Palaces', activities: ['Amer Fort', 'Hawa Mahal', 'City Palace'] },
            { day: 3, title: 'To the Blue City', activities: ['Drive to Jodhpur', 'Evening walking tour'] },
            { day: 4, title: 'Mehrangarh Majesty', activities: ['Visit Mehrangarh Fort', 'Jaswant Thada', 'Umaid Bhawan Palace'] },
            { day: 5, title: 'City of Lakes', activities: ['Drive to Udaipur', 'Visit Ranakpur temples enroute'] },
            { day: 6, title: 'Udaipur Sightseeing', activities: ['City Palace', 'Pichola Lake boat ride', 'Saheliyon-ki-Bari'] }
        ]
    },
    {
        name: 'Dubai Spectacular',
        description: 'Experience the glitz and glamour of Dubai. From the world\'s tallest building to desert safaris, Dubai offers endless excitement.',
        destination: 'Dubai, UAE',
        duration: '5 Days, 4 Nights',
        price: 65999,
        image: 'https://images.pexels.com/photos/325193/pexels-photo-325193.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.8,
        isPopular: true,
        includes: ['Flight', 'Hotel', 'Breakfast', 'Transfer', 'Sightseeing', 'Visa'],
        itinerary: [
            { day: 1, title: 'Arrive in Dubai', activities: ['Transfer to Downtown hotel', 'Evening Marina Dhow Cruise with dinner'] },
            { day: 2, title: 'City Wonders', activities: ['Dubai Frame', 'Jumeirah Beach', 'Burj Khalifa At The Top - 124th Floor'] },
            { day: 3, title: 'Desert Adventure', activities: ['Morning at leisure', 'Afternoon Desert Safari with BBQ Dinner & Belly Dance'] },
            { day: 4, title: 'Shopping Extravaganza', activities: ['Dubai Mall', 'Gold Souk', 'Evening Dubai Fountain show'] },
            { day: 5, title: 'Farewell Dubai', activities: ['Breakfast', 'Visit Miracle Garden', 'Transfer to DXB Airport'] }
        ]
    },
    {
        name: 'Singapore City Lights',
        description: 'Discover the garden city of Singapore. Modern architecture, lush parks, and diverse culinary experiences await you.',
        destination: 'Singapore',
        duration: '4 Days, 3 Nights',
        price: 54999,
        image: 'https://images.pexels.com/photos/3152124/pexels-photo-3152124.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.6,
        isPopular: false,
        includes: ['Flight', 'Hotel', 'Breakfast', 'Transfer', 'Sightseeing'],
        itinerary: [
            { day: 1, title: 'Welcome to Singapore', activities: ['Changi Jewel visit', 'Check-in', 'Evening Night Safari'] },
            { day: 2, title: 'Island Fun', activities: ['Full day Sentosa Island', 'Universal Studios Singapore'] },
            { day: 3, title: 'Gardens & Views', activities: ['Gardens by the Bay', 'Cloud Forest & Flower Dome', 'Marina Bay Sands observation deck'] },
            { day: 4, title: 'Departure', activities: ['Orchard Road shopping', 'Transfer to airport'] }
        ]
    },
    {
        name: 'Manali Snow Magic',
        description: 'Escape to the snow-capped mountains of Manali. Enjoy scenic views, adventure sports, and cozy stays in wooden cottages.',
        destination: 'Himachal Pradesh, India',
        duration: '5 Days, 4 Nights',
        price: 18999,
        image: 'https://images.pexels.com/photos/143507/pexels-photo-143507.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.5,
        isPopular: true,
        includes: ['Hotel', 'Breakfast', 'Dinner', 'Transfer', 'Sightseeing'],
        itinerary: [
            { day: 1, title: 'Arrive in Manali', activities: ['Transfer from Kullu', 'Check-in to mountain view room', 'Local market stroll'] },
            { day: 2, title: 'Solang Valley', activities: ['Adventure activities', 'Paragliding', 'Zorbing'] },
            { day: 3, title: 'Rohtang Pass', activities: ['Full day at snow point', 'Skiing and Sledging'] },
            { day: 4, title: 'Manali Local', activities: ['Hadimba Devi Temple', 'Vashisht Hot Springs', 'Old Manali cafes'] },
            { day: 5, title: 'Departure', activities: ['Breakfast', 'Transfer to Kullu airport/bus stand'] }
        ]
    },
    {
        name: 'Maldives Overwater Luxury',
        description: 'Stay in a stunning overwater villa in the Maldives. Crystal clear waters, vibrant marine life, and ultimate privacy.',
        destination: 'Maldives',
        duration: '4 Days, 3 Nights',
        price: 89999,
        image: 'https://images.pexels.com/photos/1287441/pexels-photo-1287441.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 5.0,
        isPopular: true,
        includes: ['Flight', 'Hotel', 'Breakfast', 'Dinner', 'Transfer', 'Activities'],
        itinerary: [
            { day: 1, title: 'Tropical Welcome', activities: ['Speedboat/Seaplane transfer to Resort', 'Check-in to Water Villa', 'Sunset cocktail'] },
            { day: 2, title: 'Marine Life', activities: ['Snorkeling safari', 'Scuba diving for beginners', 'Evening Spa session'] },
            { day: 3, title: 'Island Leisure', activities: ['Private beach breakfast', 'Kayak around the lagoon', 'Beachside movie night'] },
            { day: 4, title: 'End of Paradise', activities: ['Last swim', 'Gift shop check-out', 'Transfer to Male airport'] }
        ]
    },
    {
        name: 'Andaman Island Wonders',
        description: 'Explore the pristine beaches and historical sites of the Andaman Islands. Famous for Radhanagar beach and cellular jail.',
        destination: 'Andaman, India',
        duration: '6 Days, 5 Nights',
        price: 38999,
        image: 'https://images.pexels.com/photos/347143/pexels-photo-347143.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.7,
        isPopular: false,
        includes: ['Flight', 'Hotel', 'Breakfast', 'Transfer', 'Sightseeing'],
        itinerary: [
            { day: 1, title: 'Port Blair Arrival', activities: ['Transfer to hotel', 'Cellular Jail visit', 'Light and Sound show'] },
            { day: 2, title: 'To Havelock Island', activities: ['Cruise to Havelock', 'Afternoon at Radhanagar Beach (Asia’s Best Beach)'] },
            { day: 3, title: 'Elephant Beach', activities: ['Snorkeling and Sea Walk', 'Beach relaxation'] },
            { day: 4, title: 'Neil Island', activities: ['Transfer to Neil', 'Bharatpur beach', 'Natural Bridge formation'] },
            { day: 5, title: 'Back to Port Blair', activities: ['Shopping at Port Blair', 'Evening dinner at local restaurant'] }
        ]
    },
    {
        name: 'Leh Ladakh Adventure',
        description: 'Journey through the high-altitude desert of Ladakh. Visit ancient monasteries and the famous Pangong Lake.',
        destination: 'Ladakh, India',
        duration: '7 Days, 6 Nights',
        price: 42999,
        image: 'https://images.pexels.com/photos/158398/niagara-falls-waterfall-water-canada-158398.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.8,
        isPopular: true,
        includes: ['Hotel', 'Breakfast', 'Dinner', 'Transfer', 'Sightseeing'],
        itinerary: [
            { day: 1, title: 'Leh Arrival', activities: ['Arrive at Kushok Bakula Rimpochee Airport', 'Full day acclimatization', 'Evening Leh market'] },
            { day: 2, title: 'Monastery Tour', activities: ['Visit Hemis', 'Thiksey', 'Shey Palace'] },
            { day: 3, title: 'Nubra Valley', activities: ['Drive through Khardung La (Highest Motorable Road)', 'Hunder sand dunes camel ride'] },
            { day: 4, title: 'Turtuk Village', activities: ['Visit the last village of India', 'Cultural interaction'] },
            { day: 5, title: 'Pangong Lake', activities: ['Drive to Pangong', 'Evening at the blue lake (3-Idiots point)'] }
        ]
    },
    {
        name: 'Sikkim & Darjeeling Highlights',
        description: 'Experience the beauty of the Eastern Himalayas. Lush tea gardens and stunning views of Mount Kanchenjunga.',
        destination: 'Sikkim, India',
        duration: '6 Days, 5 Nights',
        price: 29999,
        image: 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.6,
        isPopular: false,
        includes: ['Hotel', 'Breakfast', 'Transfer', 'Sightseeing'],
        itinerary: [
            { day: 1, title: 'Arrive Bagdogra', activities: ['Transfer to Gangtok', 'Rest and evening walk at MG Road'] },
            { day: 2, title: 'Tsomgo Lake', activities: ['Visit Tsomgo Lake', 'Baba Mandir', 'Optional Nathula Pass'] },
            { day: 3, title: 'Gangtok Local', activities: ['Rumtek Monastery', 'Enchey Monastery', 'Ropeway ride'] },
            { day: 4, title: 'To Darjeeling', activities: ['Drive to Darjeeling', 'Evening at the Mall road'] },
            { day: 5, title: 'Darjeeling Sunrise', activities: ['Tiger Hill sunrise', 'Batasia Loop', 'Tea Garden visit'] }
        ]
    },
    {
        name: 'Bali Tropical Getaway',
        description: 'Discover the island of Gods. From ancient temples and lush rice terraces to stunning beaches and vibrant nightlife, Bali has it all.',
        destination: 'Bali, Indonesia',
        duration: '6 Days, 5 Nights',
        price: 49999,
        image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.9,
        isPopular: true,
        includes: ['Flight', 'Hotel', 'Breakfast', 'Transfer', 'Sightseeing', 'Guide'],
        itinerary: [
            { day: 1, title: 'Arrive in Bali', activities: ['Pick up from Ngurah Rai Airport', 'Check-in to Seminyak resort', 'Evening at Potato Head beach club'] },
            { day: 2, title: 'Ubud Culture', activities: ['Visit Sacred Monkey Forest', 'Tegalalang Rice Terraces', 'Ubud Royal Palace'] },
            { day: 3, title: 'Temple & Sunset', activities: ['Tirta Empul Water Temple', 'Mt. Batur viewpoint', 'Kanto Lampo Waterfall'] },
            { day: 4, title: 'Island Adventure', activities: ['Fast boat to Nusa Penida', 'Kelingking Beach', 'Broken Beach & Angel Billabong'] },
            { day: 5, title: 'Coastal Wonders', activities: ['Uluwatu Temple cliff view', 'Kecak Fire Dance performance', 'Jimbaran bay seafood dinner'] },
            { day: 6, title: 'Farewell Bali', activities: ['Breakfast with a view', 'Last minute shopping in Kuta', 'Transfer to airport'] }
        ]
    },
    {
        name: 'Switzerland Winter Wonderland',
        description: 'Experience the magic of the Swiss Alps. Snow-covered peaks, charming villages, and world-class ski resorts await you.',
        destination: 'Switzerland',
        duration: '7 Days, 6 Nights',
        price: 145999,
        image: 'https://images.pexels.com/photos/358447/pexels-photo-358447.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 5.0,
        isPopular: true,
        includes: ['Flight', 'Hotel', 'Breakfast', 'Transfer', 'Sightseeing', 'Activities'],
        itinerary: [
            { day: 1, title: 'Arrive in Zurich', activities: ['Check-in to hotel', 'Evening walking tour of Old Town', 'Dinner by the lake'] },
            { day: 2, title: 'Lucerne & Mount Pilatus', activities: ['Scenic train to Lucerne', 'Cable car to Pilatus Kulm', 'Chapel Bridge stroll'] },
            { day: 3, title: 'Interlaken Adventure', activities: ['Train to Interlaken', 'Paragliding over the city', 'Harder Kulm funicular'] },
            { day: 4, title: 'Jungfraujoch - Top of Europe', activities: ['Cogwheel train to highest station in Europe', 'Ice Palace & Sphinx Observatory'] },
            { day: 5, title: 'Zermatt & Matterhorn', activities: ['Glacier Express train journey', 'Electric taxi to Zermatt village'] },
            { day: 6, title: 'St. Moritz Luxury', activities: ['Visit the world\'s oldest ski resort', 'Ice skating on the lake', 'Apres-ski social'] },
            { day: 7, title: 'Depart Zurich', activities: ['Breakfast', 'Visit Swiss National Museum', 'Transfer to ZRH Airport'] }
        ]
    },
    {
        name: 'Classical Greece Journey',
        description: 'Walk through history in the birthplace of democracy. Explore ancient ruins, iconic islands, and savor delicious Mediterranean cuisine.',
        destination: 'Greece',
        duration: '8 Days, 7 Nights',
        price: 112999,
        image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.8,
        isPopular: false,
        includes: ['Flight', 'Hotel', 'Breakfast', 'Transfer', 'Sightseeing', 'Guide'],
        itinerary: [
            { day: 1, title: 'Athens Arrival', activities: ['Transfer to hotel near Plaka', 'Welcome dinner with Acropolis view'] },
            { day: 2, title: 'Acropolis Discovery', activities: ['Parthenon guided tour', 'New Acropolis Museum', 'Stroll through Anafiotika'] },
            { day: 3, title: 'To Santorini', activities: ['Ferry to Thira', 'Check-in to Oia cliffside villa'] },
            { day: 4, title: 'Santorini Caldera', activities: ['Volcano boat tour', 'Swimming in hot springs', 'Wine tasting at sunset'] },
            { day: 5, title: 'Mykonos vibes', activities: ['High-speed ferry to Mykonos', 'Visit Windmills & Little Venice'] },
            { day: 6, title: 'Historic Delos', activities: ['Morning trip to sacred island of Delos', 'Afternoon at Paradise Beach'] },
            { day: 7, title: 'Back to Athens', activities: ['Flight to Athens', 'Shopping at Monastiraki flea market'] },
            { day: 8, title: 'Departure', activities: ['Breakfast', 'Transfer to Eleftherios Venizelos Airport'] }
        ]
    }
];

const seedPackages = async () => {
    try {
        console.log('📦 Generating package data...');
        await Package.deleteMany({}); // Clear existing
        await Package.insertMany(packages);
        console.log(`✅ Seeded ${packages.length} packages successfully!`);
        return packages.length;
    } catch (error) {
        console.error('❌ Error seeding packages:', error);
        throw error;
    }
};

module.exports = seedPackages;
