import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

export default function FlightDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { addToCart } = useCart();
  const flightId = route.params?.id;

  const flight = {
    id: flightId,
    type: 'flight',
    airline: 'IndiGo',
    from: 'Mumbai (BOM)',
    to: 'Delhi (DEL)',
    departTime: '14:30',
    arriveTime: '16:45',
    duration: '2h 15m',
    price: 8999,
    stops: 'Non-stop',
    aircraft: 'Airbus A320',
    flightNumber: '6E-123',
    baggage: '15 KG',
    cabinBaggage: '7 KG',
    amenities: ['WiFi', 'Meals', 'Entertainment']
  };

  const handleAddToCart = () => {
    addToCart(flight);
    Alert.alert('Success', 'Flight added to cart', [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => navigation.navigate('Checkout') }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.airline}>{flight.airline}</Text>
          <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
        </View>

        <View style={styles.flightRoute}>
          <View style={styles.location}>
            <Text style={styles.time}>{flight.departTime}</Text>
            <Text style={styles.city}>{flight.from}</Text>
          </View>
          
          <View style={styles.flightPath}>
            <Ionicons name="airplane" size={24} color="#1e40af" />
            <Text style={styles.duration}>{flight.duration}</Text>
          </View>
          
          <View style={styles.location}>
            <Text style={styles.time}>{flight.arriveTime}</Text>
            <Text style={styles.city}>{flight.to}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
            <Text style={styles.infoText}>{flight.stops}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="airplane" size={20} color="#64748b" />
            <Text style={styles.infoText}>{flight.aircraft}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Baggage Information</Text>
        <View style={styles.baggageInfo}>
          <View style={styles.baggageItem}>
            <Ionicons name="briefcase-outline" size={24} color="#1e40af" />
            <View>
              <Text style={styles.baggageLabel}>Check-in Baggage</Text>
              <Text style={styles.baggageValue}>{flight.baggage}</Text>
            </View>
          </View>
          <View style={styles.baggageItem}>
            <Ionicons name="bag-handle-outline" size={24} color="#1e40af" />
            <View>
              <Text style={styles.baggageLabel}>Cabin Baggage</Text>
              <Text style={styles.baggageValue}>{flight.cabinBaggage}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenities}>
          {flight.amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.priceCard}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.priceValue}>₹{flight.price.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleAddToCart}>
          <Text style={styles.bookButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  airline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  flightNumber: {
    fontSize: 14,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  flightRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  location: {
    alignItems: 'center',
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  city: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  flightPath: {
    alignItems: 'center',
    flex: 1,
  },
  duration: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1e293b',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  baggageInfo: {
    gap: 16,
  },
  baggageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  baggageLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  baggageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  amenities: {
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amenityText: {
    fontSize: 14,
    color: '#1e293b',
  },
  priceCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
