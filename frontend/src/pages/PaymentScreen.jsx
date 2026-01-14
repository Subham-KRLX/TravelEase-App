import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { IoLockClosedOutline, IoArrowBack, IoCardOutline } from 'react-icons/io5';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import api from '../config/api';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51OqP8hSJbYfX9Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y');

const CheckoutForm = ({ amount, items }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { clearCart } = useCart();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState({
        line1: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'IN'
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // 1. Create bookings first (in pending state)
            const bookingPromises = items.map(async (item) => {
                const bookingData = {
                    bookingType: item.type,
                    itemId: item.id || item._id,
                    totalPrice: typeof item.price === 'number' ? item.price :
                        (item.price?.economy || item.price?.pricePerNight || item.pricePerNight || 0),
                    details: item.type === 'flight' ? {
                        class: item.travelClass || 'economy',
                        passengers: item.passengers || [{ firstName: name.split(' ')[0], lastName: name.split(' ')[1] || '', age: 25, gender: 'M' }]
                    } : {
                        checkInDate: new Date(),
                        checkOutDate: new Date(Date.now() + 86400000),
                        numberOfNights: 1,
                        roomType: item.roomType || 'Standard',
                        guests: [{ firstName: name.split(' ')[0], lastName: name.split(' ')[1] || '', age: 25 }]
                    }
                };
                const response = await api.post('/bookings', bookingData);
                return response.data.data.booking._id;
            });

            const bookingIds = await Promise.all(bookingPromises);

            // 2. Create Payment Intent on backend
            const { data } = await api.post('/payments/create-intent', {
                amount: amount,
                bookingIds: bookingIds // We'll update backend to handle array
            });

            const clientSecret = data.data.clientSecret;

            // 3. Confirm payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: name,
                        email: email,
                        address: {
                            line1: address.line1,
                            city: address.city,
                            state: address.state,
                            postal_code: address.postal_code,
                            country: address.country,
                        }
                    },
                }
            });

            if (result.error) {
                setError(result.error.message);
                setProcessing(false);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    // 4. Confirm completion on backend for all bookings
                    await Promise.all(bookingIds.map(id =>
                        api.post('/payments/confirm', {
                            paymentIntentId: result.paymentIntent.id,
                            bookingId: id
                        })
                    ));

                    setSucceeded(true);
                    clearCart();

                    // Clear the pending payment from localStorage
                    localStorage.removeItem('pending_payment');

                    setTimeout(() => {
                        navigate('/dashboard', {
                            state: { paymentSuccess: true, amount: amount }
                        });
                    }, 1500);
                }
            }
        } catch (err) {
            setError(`Payment failed: ${err.response?.data?.message || err.message}`);
            setProcessing(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: theme.text || '#1e293b',
                '::placeholder': {
                    color: theme.textTertiary || '#94a3b8',
                },
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            invalid: {
                color: '#ef4444',
            },
        },
    };

    return (
        <Form onSubmit={handleSubmit}>
            {/* Email Section */}
            <FormSection>
                <SectionLabel theme={theme}>Email</SectionLabel>
                <Input
                    theme={theme}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </FormSection>

            {/* Shipping Section */}
            <FormSection>
                <SectionLabel theme={theme}>Shipping</SectionLabel>
                <Input
                    theme={theme}
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    theme={theme}
                    type="text"
                    placeholder="Address line 1"
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    required
                />
                <TwoColumnGrid>
                    <Input
                        theme={theme}
                        type="text"
                        placeholder="City"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        required
                    />
                    <Input
                        theme={theme}
                        type="text"
                        placeholder="State"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        required
                    />
                </TwoColumnGrid>
                <Input
                    theme={theme}
                    type="text"
                    placeholder="PIN Code"
                    value={address.postal_code}
                    onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                    required
                />
            </FormSection>

            {/* Payment Section */}
            <FormSection>
                <SectionLabel theme={theme}>Payment</SectionLabel>
                <CardElementWrapper theme={theme}>
                    <CardElement options={cardElementOptions} />
                </CardElementWrapper>
            </FormSection>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {succeeded && <SuccessMessage>Payment successful! Redirecting...</SuccessMessage>}

            <PayButton
                theme={theme}
                type="submit"
                disabled={processing || !stripe || succeeded}
            >
                <IoLockClosedOutline size={20} />
                {processing ? 'Processing...' : succeeded ? 'Payment Complete!' : `Pay ₹${amount.toLocaleString()}`}
            </PayButton>

            <SecurityNote theme={theme}>
                <IoLockClosedOutline size={14} />
                Your payment information is encrypted and secure
            </SecurityNote>
        </Form>
    );
};

const PaymentScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();

    // Try to get payment data from route state or localStorage
    let paymentData = location.state;

    if (!paymentData || !paymentData.amount) {
        // Try localStorage fallback
        const savedPaymentData = localStorage.getItem('pending_payment');
        if (savedPaymentData) {
            try {
                paymentData = JSON.parse(savedPaymentData);
            } catch (e) {
                console.error('Error parsing payment data:', e);
            }
        }
    }

    const { amount, items } = paymentData || { amount: 0, items: [] };

    // Automatically redirect if no valid payment data - PERMANENT FIX
    useEffect(() => {
        if (!amount || amount === 0 || !items || items.length === 0) {
            console.log('No valid payment data, redirecting to checkout...');
            setTimeout(() => {
                navigate('/checkout', { replace: true });
            }, 100);
        }
    }, [amount, items, navigate]);

    if (!amount || amount === 0) {
        return (
            <Container theme={theme}>
                <ContentWrapper>
                    <p style={{ textAlign: 'center', padding: '40px' }}>Redirecting to checkout...</p>
                </ContentWrapper>
            </Container>
        );
    }

    return (
        <Container theme={theme}>
            <ContentWrapper>
                <Header>
                    <BackButton theme={theme} onClick={() => navigate(-1)}>
                        <IoArrowBack size={24} />
                        Back
                    </BackButton>
                </Header>

                <Grid>
                    <PaymentCard theme={theme}>
                        <CardHeader>
                            <CardIcon>
                                <IoCardOutline size={32} color={theme.primary} />
                            </CardIcon>
                            <Title theme={theme}>Complete Your Payment</Title>
                            <Subtitle theme={theme}>Enter your card details below</Subtitle>
                        </CardHeader>

                        <Elements stripe={stripePromise}>
                            <CheckoutForm amount={amount} items={items} />
                        </Elements>

                        <TestCardInfo theme={theme}>
                            <InfoTitle>Test Card Numbers</InfoTitle>
                            <InfoText>Use these for testing:</InfoText>
                            <CodeBlock>4242 4242 4242 4242</CodeBlock>
                            <InfoText>Any future date, any CVC, any ZIP</InfoText>
                        </TestCardInfo>
                    </PaymentCard>

                    <SummaryCard theme={theme}>
                        <SummaryTitle theme={theme}>Order Summary</SummaryTitle>
                        <OrderItems>
                            {items.map((item, idx) => (
                                <OrderItem key={idx} theme={theme}>
                                    <ItemName>{item.name || item.airline || 'Item'}</ItemName>
                                    <ItemQuantity>×{item.quantity}</ItemQuantity>
                                </OrderItem>
                            ))}
                        </OrderItems>
                        <Divider theme={theme} />
                        <TotalRow>
                            <TotalLabel theme={theme}>Total Amount</TotalLabel>
                            <TotalValue theme={theme}>₹{amount.toLocaleString()}</TotalValue>
                        </TotalRow>
                    </SummaryCard>
                </Grid>
            </ContentWrapper>
        </Container>
    );
};

// Styled Components
const Container = styled.div`
    min-height: 100vh;
    background-color: ${props => props.theme.backgroundSecondary || '#f8fafc'};
    padding: 24px;
`;

const ContentWrapper = styled.div`
    max-width: 1000px;
    margin: 0 auto;
`;

const Header = styled.div`
    margin-bottom: 24px;
`;

const BackButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: ${props => props.theme.text};
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 8px;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${props => props.theme.card};
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @media (min-width: 968px) {
        grid-template-columns: 1fr 350px;
        gap: 32px;
    }
`;

const PaymentCard = styled.div`
    background-color: ${props => props.theme.card};
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
    text-align: center;
    margin-bottom: 32px;
`;

const CardIcon = styled.div`
    margin-bottom: 16px;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.text};
    margin-bottom: 8px;
`;

const Subtitle = styled.p`
    color: ${props => props.theme.textSecondary};
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const FormSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const SectionLabel = styled.label`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.text};
    margin-bottom: 4px;
`;

const Input = styled.input`
    padding: 14px 16px;
    border: 1px solid ${props => props.theme.border || '#e2e8f0'};
    border-radius: 8px;
    font-size: 16px;
    color: ${props => props.theme.text};
    background-color: ${props => props.theme.card};
    transition: all 0.2s;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    
    &::placeholder {
        color: ${props => props.theme.textTertiary || '#94a3b8'};
    }
    
    &:focus {
        outline: none;
        border-color: ${props => props.theme.primary};
        box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
    }
    
    &:hover {
        border-color: ${props => props.theme.primary}80;
    }
`;

const TwoColumnGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    
    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`;

const CardElementWrapper = styled.div`
    padding: 16px;
    border: 1px solid ${props => props.theme.border || '#e2e8f0'};
    border-radius: 8px;
    background-color: ${props => props.theme.card};
    
    &:focus-within {
        border-color: ${props => props.theme.primary};
        box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
    }
`;

const PayButton = styled.button`
    background-color: ${props => props.theme.primary};
    color: white;
    padding: 16px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;

    &:hover:not(:disabled) {
        background-color: ${props => props.theme.secondary};
        transform: translateY(-1px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const SecurityNote = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: ${props => props.theme.textSecondary};
    font-size: 13px;
    text-align: center;
`;

const ErrorMessage = styled.div`
    background-color: #fee2e2;
    color: #dc2626;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
`;

const SuccessMessage = styled.div`
    background-color: #d1fae5;
    color: #10b981;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
`;

const TestCardInfo = styled.div`
    margin-top: 32px;
    padding: 16px;
    background-color: ${props => props.theme.backgroundSecondary};
    border-radius: 8px;
`;

const InfoTitle = styled.div`
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 14px;
`;

const InfoText = styled.div`
    font-size: 13px;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 8px;
`;

const CodeBlock = styled.div`
    background-color: ${props => props.theme.card};
    padding: 8px 12px;
    border-radius: 6px;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    margin: 8px 0;
    border: 1px solid ${props => props.theme.border};
`;

const SummaryCard = styled.div`
    background-color: ${props => props.theme.card};
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.05);
    height: fit-content;
    position: sticky;
    top: 100px;
`;

const SummaryTitle = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.text};
    margin-bottom: 20px;
`;

const OrderItems = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
`;

const OrderItem = styled.div`
    display: flex;
    justify-content: space-between;
    color: ${props => props.theme.textSecondary};
    font-size: 14px;
`;

const ItemName = styled.span``;
const ItemQuantity = styled.span``;

const Divider = styled.div`
    height: 1px;
    background-color: ${props => props.theme.border || '#e2e8f0'};
    margin: 20px 0;
`;

const TotalRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TotalLabel = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.text};
`;

const TotalValue = styled.span`
    font-size: 24px;
    font-weight: 800;
    color: ${props => props.theme.primary};
`;

const ErrorCard = styled.div`
    background-color: ${props => props.theme.card};
    border-radius: 16px;
    padding: 48px;
    text-align: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const ErrorTitle = styled.h1`
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.text};
    margin-bottom: 16px;
`;

const ErrorText = styled.p`
    color: ${props => props.theme.textSecondary};
    margin-bottom: 32px;
`;

export default PaymentScreen;
