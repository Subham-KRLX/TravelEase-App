import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import flightService from '../services/flightService';
import hotelService from '../services/hotelService';

export default function SearchResultsScreen() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { addToCart } = useCart();
  const { theme } = useTheme();

  const searchType = route.params?.type || 'flights';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        if (searchType === 'flights') {
          const params = {
            origin: route.params?.from?.trim?.() || '',
            destination: route.params?.to?.trim?.() || '',
            departureDate: route.params?.departDate?.trim?.() || '',
            returnDate: route.params?.returnDate?.trim?.() || '',
            passengers: route.params?.passengers,
            class: 'economy' // Default for now
          };

          const response = await flightService.searchFlights(params);
          if (response.success) {
            setResults(processFlightResults(response.flights));
          } else {
            console.error('Flight search failed:', response.error);
            setError(response.error);
            setResults([]);
          }
        } else if (searchType === 'hotels') {
          const params = {
            city: route.params?.location?.trim?.() || '',
            checkIn: route.params?.checkIn?.trim?.() || '',
            checkOut: route.params?.checkOut?.trim?.() || '',
            guests: route.params?.guests || '1'
          };

          console.log('Hotel search params:', params);
          const response = await hotelService.searchHotels(params);
          console.log('Hotel search response:', response);

          if (response.success && response.hotels) {
            console.log('Hotels found:', response.hotels.length);
            setResults(processHotelResults(response.hotels));
          } else {
            console.error('Hotel search failed:', response.error || 'No hotels in response');
            setError(response.error || 'No hotels found');
            setResults([]);
          }
        } else {
          // Keep packages mock as no backend yet
          setResults(generateMockResults('packages'));
        }
      } catch (error) {
        console.error('Search error:', error);
        setError('Network error. If you are on Vercel, please use the local frontend (localhost:8081).');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchType, route.params]);

  const processFlightResults = (flights) => {
    if (!Array.isArray(flights)) {
      console.error('Flights is not an array:', flights);
      return [];
    }

    return flights.map(flight => {
      try {
        return {
          id: flight._id,
          type: 'flight',
          airline: flight.airline?.name || 'Unknown Airline',
          from: `${flight.origin?.city || 'Unknown'} (${flight.origin?.airportCode || 'N/A'})`,
          to: `${flight.destination?.city || 'Unknown'} (${flight.destination?.airportCode || 'N/A'})`,
          departTime: flight.departure?.time || 'N/A',
          arriveTime: flight.arrival?.time || 'N/A',
          duration: flight.duration || 'N/A',
          price: flight.price?.economy || 0,
          stops: flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop(s)`,
          availableSeats: flight.availableSeats?.economy || 0
        };
      } catch (error) {
        console.error('Error processing flight:', error, flight);
        return null;
      }
    }).filter(f => f !== null);
  };

  const processHotelResults = (hotels) => {
    if (!Array.isArray(hotels)) {
      console.error('Hotels is not an array:', hotels);
      return [];
    }

    return hotels.map(hotel => {
      try {
        return {
          id: hotel._id,
          type: 'hotel',
          name: hotel.name || 'Unknown Hotel',
          location: `${hotel.location?.city || 'Unknown'}, ${hotel.location?.country || 'Unknown'}`,
          rating: hotel.rating?.average || 0,
          reviews: hotel.rating?.count || 0,
          price: hotel.pricePerNight || 0,
          image: hotel.images?.length > 0 ? hotel.images[0].url : 'https://via.placeholder.com/800x600',
          description: hotel.description || 'No description available'
        };
      } catch (error) {
        console.error('Error processing hotel:', error, hotel);
        return null;
      }
    }).filter(h => h !== null);
  };

  const generateMockResults = (type) => {
    if (type === 'packages') {
      return [
        {
          id: 7,
          type: 'package',
          name: 'Goa Beach Paradise',
          destination: 'Goa, India',
          duration: '5 Days, 4 Nights',
          includes: ['Flight', 'Hotel', 'Breakfast', 'Beach Activities'],
          price: 24999,
          image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
          description: 'Complete beach vacation with water sports',
          rating: 4.7
        },
        // ... (rest of package mocks)
      ];
    }
    return [];
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const renderFlightCard = (flight) => (
    <TouchableOpacity
      key={flight.id}
      style={[styles.card, {
        backgroundColor: theme.card,
        shadowColor: theme.cardShadow,
        borderColor: theme.border,
        borderWidth: 1,
      }]}
      onPress={() => navigation.navigate('FlightDetails', { id: flight.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.airline, { color: theme.text }]}>{flight.airline}</Text>
        <Text style={[styles.price, { color: theme.primary }]}>₹{flight.price.toLocaleString()}</Text>
      </View>

      <View style={styles.flightInfo}>
        <View style={styles.flightRoute}>
          <View>
            <Text style={[styles.time, { color: theme.text }]}>{flight.departTime}</Text>
            <Text style={[styles.location, { color: theme.textSecondary }]}>{flight.from}</Text>
          </View>

          <View style={styles.flightDuration}>
            <Text style={[styles.duration, { color: theme.textSecondary }]}>{flight.duration}</Text>
            <View style={styles.flightLine}>
              <View style={[styles.line, { backgroundColor: theme.border }]} />
              <Ionicons name="airplane" size={16} color={theme.textSecondary} />
              <View style={[styles.line, { backgroundColor: theme.border }]} />
            </View>
            <Text style={[styles.stops, { color: theme.success }]}>{flight.stops}</Text>
          </View>

          <View>
            <Text style={[styles.time, { color: theme.text }]}>{flight.arriveTime}</Text>
            <Text style={[styles.location, { color: theme.textSecondary }]}>{flight.to}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.addButton, { borderColor: theme.primary }]}
          onPress={() => handleAddToCart(flight)}
        >
          <Ionicons name="add-circle" size={20} color={theme.primary} />
          <Text style={[styles.addButtonText, { color: theme.primary }]}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.detailsButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('FlightDetails', { id: flight.id })}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHotelCard = (hotel) => (
    <TouchableOpacity
      key={hotel.id}
      style={[styles.card, {
        backgroundColor: theme.card,
        shadowColor: theme.cardShadow,
        borderColor: theme.border,
        borderWidth: 1,
      }]}
      onPress={() => navigation.navigate('HotelDetails', { id: hotel.id })}
    >
      <Image source={{ uri: hotel.image }} style={styles.hotelImage} />

      <View style={styles.hotelContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.hotelName, { color: theme.text }]}>{hotel.name}</Text>
          <Text style={[styles.price, { color: theme.primary }]}>₹{hotel.price.toLocaleString()}</Text>
        </View>

        <View style={styles.hotelLocation}>
          <Ionicons name="location" size={14} color={theme.textSecondary} />
          <Text style={[styles.locationText, { color: theme.textSecondary }]}>{hotel.location}</Text>
        </View>

        <View style={styles.hotelRating}>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color={theme.gold} />
            <Text style={[styles.ratingText, { color: theme.text }]}>{hotel.rating}</Text>
          </View>
          <Text style={[styles.reviews, { color: theme.textSecondary }]}>({hotel.reviews} reviews)</Text>
        </View>

        <Text style={[styles.description, { color: theme.textSecondary }]}>{hotel.description}</Text>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.addButton, { borderColor: theme.primary }]}
            onPress={() => handleAddToCart(hotel)}
          >
            <Ionicons name="add-circle" size={20} color={theme.primary} />
            <Text style={[styles.addButtonText, { color: theme.primary }]}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.detailsButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('HotelDetails', { id: hotel.id })}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPackageCard = (pkg) => (
    <TouchableOpacity
      key={pkg.id}
      style={[styles.card, {
        backgroundColor: theme.card,
        shadowColor: theme.cardShadow,
        borderColor: theme.border,
        borderWidth: 1,
      }]}
      onPress={() => navigation.navigate('Home')}
    >
      <Image source={{ uri: pkg.image }} style={styles.hotelImage} />

      <View style={styles.hotelContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.hotelName, { color: theme.text }]}>{pkg.name}</Text>
          <Text style={[styles.price, { color: theme.primary }]}>₹{pkg.price.toLocaleString()}</Text>
        </View>

        <View style={styles.hotelLocation}>
          <Ionicons name="location" size={14} color={theme.textSecondary} />
          <Text style={[styles.locationText, { color: theme.textSecondary }]}>{pkg.destination}</Text>
        </View>

        <View style={styles.packageDuration}>
          <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
          <Text style={[styles.locationText, { color: theme.textSecondary, marginLeft: 4 }]}>{pkg.duration}</Text>
        </View>

        <View style={styles.includesContainer}>
          {pkg.includes.slice(0, 3).map((item, idx) => (
            <View key={idx} style={[styles.includeBadge, { backgroundColor: theme.backgroundSecondary }]}>
              <Text style={[styles.includeText, { color: theme.textSecondary }]}>{item}</Text>
            </View>
          ))}
          {pkg.includes.length > 3 && (
            <Text style={[styles.moreIncludes, { color: theme.textSecondary }]}>+{pkg.includes.length - 3} more</Text>
          )}
        </View>

        <View style={styles.hotelRating}>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color={theme.gold} />
            <Text style={[styles.ratingText, { color: theme.text }]}>{pkg.rating}</Text>
          </View>
        </View>

        <Text style={[styles.description, { color: theme.textSecondary }]}>{pkg.description}</Text>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.addButton, { borderColor: theme.primary }]}
            onPress={() => handleAddToCart(pkg)}
          >
            <Ionicons name="add-circle" size={20} color={theme.primary} />
            <Text style={[styles.addButtonText, { color: theme.primary }]}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.detailsButton, { backgroundColor: theme.primary }]}
            onPress={() => {
              console.log('Package details pressed for:', pkg.id);
              // Package details screen would be implemented similarly to hotels/flights
              Alert.alert('Package Details', 'Package details screen coming soon!');
            }}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Searching for best deals...</Text>
      </View>
    );
  }

  if (error || results.length === 0) {
    const isNetworkError = error && (error.toLowerCase().includes('network') || error.toLowerCase().includes('failed'));

    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.backgroundSecondary, borderBottomColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {error ? 'Search Error' : `No ${searchType} found`}
          </Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons
            name={isNetworkError ? "cloud-offline-outline" : "search"}
            size={64}
            color={isNetworkError ? theme.error : theme.textSecondary}
          />
          <Text style={[styles.emptyText, { color: theme.text }]}>
            {error || `No results found for your search`}
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            {isNetworkError
              ? "This usually happens when HTTPS (Vercel) cannot talk to HTTP (Localhost). Please run 'npm run web' and use http://localhost:8081."
              : "Try adjusting your filters or searching for different dates."}
          </Text>
          {isNetworkError && (
            <TouchableOpacity
              style={[styles.detailsButton, { backgroundColor: theme.primary, marginTop: 24, paddingHorizontal: 24 }]}
              onPress={() => fetchResults()}
            >
              <Text style={styles.detailsButtonText}>Retry Search</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.backgroundSecondary, borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          {results.length} {searchType} found
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.results}
        showsVerticalScrollIndicator={true}
      >
        {results.map(result => {
          if (result.type === 'flight') return renderFlightCard(result);
          if (result.type === 'hotel') return renderHotelCard(result);
          if (result.type === 'package') return renderPackageCard(result);
          return null;
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  results: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  airline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  flightInfo: {
    marginBottom: 16,
  },
  flightRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  location: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  flightDuration: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  duration: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  flightLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  stops: {
    fontSize: 12,
    color: '#16a34a',
    marginTop: 8,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e40af',
    gap: 6,
  },
  addButtonText: {
    color: '#1e40af',
    fontWeight: '600',
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1e40af',
    gap: 6,
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  hotelImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  hotelContent: {
    gap: 8,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  hotelLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#64748b',
  },
  hotelRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  reviews: {
    fontSize: 12,
    color: '#64748b',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  packageDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  includesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 8,
  },
  includeBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  includeText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  moreIncludes: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
});
