import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import paymentService from '../services/paymentService';
import bookingService from '../services/bookingService';

export default function PaymentScreen() {
    console.log('PaymentScreen entered');
    const navigation = useNavigation();
    const route = useRoute();
    console.log('PaymentScreen params:', route.params);
    const { theme } = useTheme();
    const { clearCart } = useCart();

    const { amount, items } = route.params || {};
    console.log('Payment amount:', amount);

    const [loading, setLoading] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [error, setError] = useState(null);

    // Stripe Test Card Formatting
    const formatCardNumber = (text) => {
        const cleaned = text.replace(/\D/g, '');
        const groups = cleaned.match(/.{1,4}/g);
        return groups ? groups.join(' ') : cleaned;
    };

    const formatExpiry = (text) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length > 2) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        }
        return cleaned;
    };

    const handlePayment = async () => {
        setError(null);
        if (!cardNumber || !expiry || !cvv || !nameOnCard) {
            setError('Please fill in all card details');
            return;
        }

        if (cardNumber.replace(/\s/g, '').length < 16) {
            setError('Invalid Card Number');
            return;
        }

        if (cvv.length < 3) {
            setError('Invalid CVV');
            return;
        }

        setLoading(true);
        try {
            // 1. Create bookings first (or we could wait for payment confirmation)
            // For this demo, we'll create the bookings and then simulate the Stripe confirmation

            const bookingPromises = items.map(item => {
                const bookingData = {
                    type: item.type,
                    itemId: item.id,
                    details: item,
                    totalPrice: item.price * item.quantity
                };
                return bookingService.createBooking(bookingData);
            });

            const bookingResults = await Promise.all(bookingPromises);
            const successfulBookings = bookingResults.filter(r => r.success);

            if (successfulBookings.length === 0) {
                throw new Error('Failed to initiate bookings');
            }

            // 2. Create Payment Intent
            const firstBookingId = successfulBookings[0].booking?._id;
            const intentResult = await paymentService.createPaymentIntent(amount, firstBookingId);

            if (!intentResult.success) {
                throw new Error(intentResult.error || 'Payment initialization failed');
            }

            // 3. Simulate Stripe Card Processing (In a real app, you'd use Stripe SDK here)
            // Since we don't have the Native Stripe SDK setup for web/expo easily in this environment,
            // we simulate the client-side success if the backend intent was created.

            const confirmResult = await paymentService.confirmPayment(intentResult.paymentIntentId, firstBookingId);

            if (confirmResult.success) {
                Alert.alert(
                    'Payment Successful!',
                    'Your travel bookings have been confirmed.',
                    [
                        {
                            text: 'Go to Dashboard',
                            onPress: () => {
                                clearCart();
                                navigation.navigate('Dashboard');
                            }
                        }
                    ]
                );
            } else {
                throw new Error(confirmResult.error || 'Payment confirmation failed');
            }

        } catch (error) {
            console.error('Payment flow error:', error);
            setError(error.message || 'An error occurred during payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>Total Amount</Text>
                    <Text style={[styles.amount, { color: theme.primary }]}>₹{amount ? amount.toLocaleString() : '0'}</Text>
                </View>

                {error && (
                    <View style={[styles.errorContainer, { backgroundColor: '#fee2e2', borderColor: '#ef4444' }]}>
                        <Ionicons name="alert-circle" size={20} color="#ef4444" />
                        <Text style={[styles.errorText, { color: '#b91c1c' }]}>{error}</Text>
                    </View>
                )}

                <View style={[styles.cardContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Credit / Debit Card</Text>
                        <Ionicons name="card" size={24} color={theme.primary} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Card Number</Text>
                        <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
                            <Ionicons name="card-outline" size={20} color={theme.textTertiary} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="4242 4242 4242 4242"
                                placeholderTextColor={theme.textTertiary}
                                value={cardNumber}
                                onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                                keyboardType="numeric"
                                maxLength={19}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>Expiry Date</Text>
                            <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="MM/YY"
                                    placeholderTextColor={theme.textTertiary}
                                    value={expiry}
                                    onChangeText={(t) => setExpiry(formatExpiry(t))}
                                    keyboardType="numeric"
                                    maxLength={5}
                                />
                            </View>
                        </View>

                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>CVV</Text>
                            <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="123"
                                    placeholderTextColor={theme.textTertiary}
                                    value={cvv}
                                    onChangeText={setCvv}
                                    keyboardType="numeric"
                                    maxLength={3}
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Cardholder Name</Text>
                        <View style={[styles.inputContainer, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
                            <Ionicons name="person-outline" size={20} color={theme.textTertiary} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="John Doe"
                                placeholderTextColor={theme.textTertiary}
                                value={nameOnCard}
                                onChangeText={setNameOnCard}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.securityInfo}>
                    <Ionicons name="shield-checkmark" size={16} color={theme.success} />
                    <Text style={[styles.securityText, { color: theme.textSecondary }]}>
                        Your payment is secured with 256-bit encryption
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.payButton, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
                    onPress={handlePayment}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.payButtonText}>Confirm Payment</Text>
                            <Ionicons name="lock-closed" size={18} color="#fff" />
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                >
                    <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        flexGrow: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 10,
    },
    amountLabel: {
        fontSize: 16,
        marginBottom: 8,
    },
    amount: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    cardContainer: {
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
    },
    securityInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        gap: 8,
    },
    securityText: {
        fontSize: 12,
    },
    payButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 12,
        marginTop: 32,
        gap: 10,
    },
    payButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
    },
    cancelButtonText: {
        fontSize: 16,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 20,
        gap: 8,
    },
    errorText: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
});
