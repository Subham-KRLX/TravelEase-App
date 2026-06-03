export const demoFlights = [
  {
    id: 'demo-flight-mumbai-delhi',
    type: 'flight',
    airline: 'IndiGo SmartFare',
    flightNumber: '6E 204',
    from: 'Mumbai (BOM)',
    to: 'Delhi (DEL)',
    origin: 'Mumbai',
    destination: 'Delhi',
    departTime: '08:20',
    arriveTime: '10:35',
    departure: { time: '08:20', date: new Date().toISOString(), city: 'Mumbai' },
    arrival: { time: '10:35', date: new Date().toISOString(), city: 'Delhi' },
    duration: '2h 15m',
    price: 6499,
    stops: 'Non-stop',
    availableSeats: 28,
    aircraft: 'Airbus A320',
    baggage: '15 KG',
    cabinBaggage: '7 KG',
    amenities: ['Priority boarding', 'Meals available', 'Flexible reschedule']
  },
  {
    id: 'demo-flight-bengaluru-goa',
    type: 'flight',
    airline: 'Vistara Select',
    flightNumber: 'UK 845',
    from: 'Bengaluru (BLR)',
    to: 'Goa (GOI)',
    origin: 'Bengaluru',
    destination: 'Goa',
    departTime: '13:45',
    arriveTime: '15:05',
    departure: { time: '13:45', date: new Date().toISOString(), city: 'Bengaluru' },
    arrival: { time: '15:05', date: new Date().toISOString(), city: 'Goa' },
    duration: '1h 20m',
    price: 5299,
    stops: 'Non-stop',
    availableSeats: 18,
    aircraft: 'Airbus A321',
    baggage: '15 KG',
    cabinBaggage: '7 KG',
    amenities: ['Cabin meal', 'Window-seat picks', 'Fast check-in']
  }
];

export const demoHotels = [
  {
    id: 'demo-hotel-goa',
    type: 'hotel',
    name: 'Azura Bay Resort',
    location: 'North Goa, India',
    rating: 4.7,
    reviews: 1284,
    price: 8999,
    pricePerNight: 8999,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [{ url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200' }],
    description: 'A breezy coastal stay with poolside dining, beach transfers, and spacious rooms close to Goa nightlife.',
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Airport transfer'],
    rooms: [{ type: 'Sea View Room', price: 8999 }, { type: 'Premium Suite', price: 12999 }]
  },
  {
    id: 'demo-hotel-kerala',
    type: 'hotel',
    name: 'Backwater Grove Retreat',
    location: 'Alleppey, Kerala',
    rating: 4.8,
    reviews: 932,
    price: 10499,
    pricePerNight: 10499,
    image: 'https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [{ url: 'https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=1200' }],
    description: 'A calm backwater escape with houseboat experiences, local cuisine, and lush green views.',
    amenities: ['WiFi', 'Breakfast', 'Spa', 'Boat ride'],
    rooms: [{ type: 'Garden Villa', price: 10499 }, { type: 'Waterfront Cottage', price: 14999 }]
  }
];

export const demoPackages = [
  {
    id: 'demo-package-goa',
    type: 'package',
    name: 'Goa Beach Escape',
    destination: 'Goa, India',
    duration: '4 days / 3 nights',
    includes: ['Flights', 'Hotel', 'Breakfast', 'Beach tour'],
    price: 18999,
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200',
    description: 'A sun-filled Goa getaway with flights, a boutique beach stay, guided beach hopping, and flexible free time.',
    rating: 4.8,
    itinerary: [
      { day: 1, title: 'Arrival in Goa', desc: 'Airport pickup, check-in, and sunset at Candolim.' },
      { day: 2, title: 'Beach Circuit', desc: 'Explore Baga, Anjuna, and a curated local cafe trail.' },
      { day: 3, title: 'Leisure Day', desc: 'Choose water sports, spice plantation, or a relaxed resort day.' },
      { day: 4, title: 'Departure', desc: 'Breakfast and transfer to the airport.' }
    ]
  },
  {
    id: 'demo-package-kashmir',
    type: 'package',
    name: 'Kashmir Valley Luxe',
    destination: 'Srinagar, Kashmir',
    duration: '5 days / 4 nights',
    includes: ['Flights', 'Hotel', 'Transfers', 'Gulmarg day trip'],
    price: 32999,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
    description: 'A scenic Kashmir itinerary with houseboat charm, mountain drives, and guided valley experiences.',
    rating: 4.9,
    itinerary: [
      { day: 1, title: 'Srinagar Arrival', desc: 'Check in and enjoy a relaxed Dal Lake evening.' },
      { day: 2, title: 'Mughal Gardens', desc: 'Visit Nishat, Shalimar, and local craft markets.' },
      { day: 3, title: 'Gulmarg', desc: 'Full-day mountain excursion with optional gondola ride.' },
      { day: 4, title: 'Pahalgam Drive', desc: 'River valley views and guided sightseeing.' },
      { day: 5, title: 'Departure', desc: 'Transfer to the airport after breakfast.' }
    ]
  }
];

export const getDemoResults = (type) => {
  if (type === 'hotels') return demoHotels;
  if (type === 'packages') return demoPackages;
  return demoFlights;
};

export const getDemoItemById = (type, id) => {
  const allItems = [...demoFlights, ...demoHotels, ...demoPackages];
  return allItems.find((item) => item.id === id && (!type || item.type === type));
};
