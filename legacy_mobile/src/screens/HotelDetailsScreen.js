import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

export default function HotelDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { addToCart } = useCart();
  const hotelId = route.params?.id;

  const hotel = {
    id: hotelId,
    type: 'hotel',
    name: 'The Taj Mahal Palace',
    location: 'Mumbai, India',
    rating: 4.8,
    reviews: 1245,
    price: 15999,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Luxury heritage hotel in the heart of Mumbai with stunning sea views and world-class amenities.',
    amenities: [
      'Free WiFi',
      'Swimming Pool',
      'Gym',
      'Restaurant',
      'Room Service',
      'Spa',
      'Concierge',
      'Parking'
    ],
    roomType: 'Deluxe Room',
    checkIn: '2:00 PM',
    checkOut: '11:00 AM'
  };

  const handleAddToCart = () => {
    addToCart(hotel);
    Alert.alert('Success', 'Hotel added to cart', [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => navigation.navigate('Checkout') }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: hotel.image }} style={styles.heroImage} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <View style={styles.location}>
              <Ionicons name="location" size={16} color="#64748b" />
              <Text style={styles.locationText}>{hotel.location}</Text>
            </View>
          </View>
          
          <View style={styles.rating}>
            <Ionicons name="star" size={20} color="#fbbf24" />
            <Text style={styles.ratingText}>{hotel.rating}</Text>
          </View>
        </View>

        <View style={styles.reviews}>
          <Text style={styles.reviewsText}>{hotel.reviews} reviews</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{hotel.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Room Details</Text>
          <View style={styles.roomInfo}>
            <View style={styles.roomItem}>
              <Ionicons name="bed" size={24} color="#1e40af" />
              <View>
                <Text style={styles.roomLabel}>Room Type</Text>
                <Text style={styles.roomValue}>{hotel.roomType}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Check-in / Check-out</Text>
          <View style={styles.timeInfo}>
            <View style={styles.timeItem}>
              <Ionicons name="log-in-outline" size={24} color="#16a34a" />
              <View>
                <Text style={styles.timeLabel}>Check-in</Text>
                <Text style={styles.timeValue}>{hotel.checkIn}</Text>
              </View>
            </View>
            <View style={styles.timeItem}>
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
              <View>
                <Text style={styles.timeLabel}>Check-out</Text>
                <Text style={styles.timeValue}>{hotel.checkOut}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenities}>
            {hotel.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Per Night</Text>
            <Text style={styles.priceValue}>₹{hotel.price.toLocaleString()}</Text>
          </View>
          <TouchableOpacity style={styles.bookButton} onPress={handleAddToCart}>
            <Text style={styles.bookButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#64748b',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  reviews: {
    marginBottom: 16,
  },
  reviewsText: {
    fontSize: 14,
    color: '#64748b',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
  },
  roomInfo: {
    gap: 16,
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  roomLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  roomValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  timeInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  timeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  timeLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
  },
  amenityText: {
    fontSize: 14,
    color: '#1e293b',
  },
  priceCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  bookButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
