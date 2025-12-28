import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import bookingService from '../services/bookingService';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { cartItems, getTotalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const { theme } = useTheme();


  const handleCheckout = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to complete your booking', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to cart before checkout');
      return;
    }

    try {
      // Process each item in cart as a booking
      // In a real payment flow, we would first create a payment intent here

      const bookingPromises = cartItems.map(item => {
        const bookingData = {
          type: item.type,
          itemId: item.id,
          details: {
            ...item,
            passengers: 1, // Default, should come from cart item customization
            guests: 1      // Default
          },
          totalPrice: item.price * item.quantity
        };
        return bookingService.createBooking(bookingData);
      });

      const results = await Promise.all(bookingPromises);
      const successfulBookings = results.filter(r => r.success);

      if (successfulBookings.length === results.length) {
        Alert.alert(
          'Booking Confirmed!',
          'Your booking has been confirmed. You will receive a confirmation email shortly.',
          [
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                navigation.navigate('Dashboard');
              }
            }
          ]
        );
      } else {
        Alert.alert('Booking Issue', 'Some items could not be booked. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'Failed to process booking. Please try again.');
    }
  };

  const renderCartItem = (item) => (
    <View key={`${item.type}-${item.id}`} style={[styles.cartItem, { backgroundColor: theme.card, shadowColor: theme.cardShadow, borderColor: theme.border, borderWidth: 1 }]}>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.text }]}>
          {item.type === 'flight' ? `${item.airline} - ${item.from} to ${item.to}` : item.name}
        </Text>
        {item.type === 'flight' && (
          <Text style={[styles.itemDetails, { color: theme.textSecondary }]}>
            {item.departTime} - {item.arriveTime} • {item.duration}
          </Text>
        )}
        {item.type === 'hotel' && (
          <Text style={[styles.itemDetails, { color: theme.textSecondary }]}>{item.location}</Text>
        )}
        <Text style={[styles.itemPrice, { color: theme.primary }]}>₹{item.price.toLocaleString()} × {item.quantity}</Text>
      </View>

      <View style={styles.itemActions}>
        <View style={[styles.quantityControls, { backgroundColor: theme.backgroundSecondary }]}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.card }]}
            onPress={() => updateQuantity(item.id, item.type, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.quantity, { color: theme.text }]}>{item.quantity}</Text>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.card }]}
            onPress={() => updateQuantity(item.id, item.type, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id, item.type)}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="cart-outline" size={80} color={theme.textTertiary} />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>Your cart is empty</Text>
        <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>Add some items to get started</Text>
        <TouchableOpacity
          style={[styles.browseButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.browseButtonText}>Browse Deals</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.cartItems}>
          {cartItems.map(renderCartItem)}
        </View>
      </ScrollView>

      <View style={[styles.summary, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Subtotal</Text>
          <Text style={[styles.summaryValue, { color: theme.text }]}>₹{getTotalPrice().toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Taxes & Fees</Text>
          <Text style={[styles.summaryValue, { color: theme.text }]}>₹{Math.round(getTotalPrice() * 0.18).toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: theme.primary }]}>₹{Math.round(getTotalPrice() * 1.18).toLocaleString()}</Text>
        </View>

        <TouchableOpacity style={[styles.checkoutButton, { backgroundColor: theme.primary }]} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Payment</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
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
  cartItems: {
    padding: 16,
  },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemInfo: {
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  summary: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1e293b',
  },
  totalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  checkoutButton: {
    backgroundColor: '#1e40af',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
