import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
    CreditCard,
    Lock,
    ShieldCheck,
    CheckCircle2,
    ArrowLeft,
    Smartphone,
    Info,
    ChevronRight,
    Landmark,
    AlertCircle
} from 'lucide-react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import api from '../config/api';

export default function PaymentScreen() {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const { getCartTotal, clearCart, cartItems } = useCart();
    const { theme } = useTheme();
    const [method, setMethod] = useState('card');
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');

    const total = getCartTotal() * 1.12;

    useEffect(() => {
        // Create Payment Intent as soon as the page loads
        if (total > 0) {
            createPaymentIntent();
        }
    }, [total]);

    const createPaymentIntent = async () => {
        try {
            const response = await api.post('/payments/create-intent', {
                amount: total,
                // Pass booking related info if needed
            });
            setClientSecret(response.data.data.clientSecret);
        } catch (err) {
            console.error('Error creating payment intent:', err);
            setError('Failed to initialize payment. Please try again.');
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setStatus('processing');
        setError(null);

        try {
            const cardElement = elements.getElement(CardElement);

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'Guest User', // Ideally get from AuthContext
                    },
                },
            });

            if (error) {
                setError(error.message);
                setStatus('error');
            } else if (paymentIntent.status === 'succeeded') {
                setStatus('success');
                // Notify backend of success if necessary
                await api.post('/payments/confirm', {
                    paymentIntentId: paymentIntent.id
                });

                setTimeout(() => {
                    clearCart();
                    navigate('/dashboard');
                }, 3000);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <SuccessState>
                <div className="icon"><CheckCircle2 size={80} /></div>
                <h2>Payment Successful!</h2>
                <p>Your booking has been confirmed. You will receive an email shortly with your itinerary and tickets.</p>
                <div className="redirect">Redirecting to your dashboard...</div>
            </SuccessState>
        );
    }

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: theme.text,
                fontFamily: 'Inter, sans-serif',
                '::placeholder': {
                    color: theme.textSecondary,
                },
            },
            invalid: {
                color: theme.danger || '#ef4444',
            },
        },
    };

    return (
        <Container>
            <ProgressSteps>
                <Step $completed><span><CheckCircle2 size={16} /></span> Bag</Step>
                <div className="line active" />
                <Step $completed><span><CheckCircle2 size={16} /></span> Details</Step>
                <div className="line active" />
                <Step $active><span>3</span> Payment</Step>
            </ProgressSteps>

            <Content>
                <div className="payment-methods">
                    <header>
                        <h1>Choose payment method</h1>
                        <p>All transactions are secure and encrypted.</p>
                    </header>

                    {error && (
                        <ErrorBanner>
                            <AlertCircle size={20} />
                            {error}
                        </ErrorBanner>
                    )}

                    <MethodGrid>
                        <MethodCard $active={method === 'card'} onClick={() => setMethod('card')}>
                            <CreditCard size={24} />
                            <div className="text">
                                <h4>Credit / Debit Card</h4>
                                <span>Visa, Mastercard, Amex</span>
                            </div>
                            <div className="radio" />
                        </MethodCard>

                        <MethodCard $active={method === 'upi'} onClick={() => setMethod('upi')}>
                            <Smartphone size={24} />
                            <div className="text">
                                <h4>UPI Payment</h4>
                                <span>Google Pay, PhonePe, Paytm</span>
                            </div>
                            <div className="radio" />
                        </MethodCard>

                        <MethodCard $active={method === 'netbanking'} onClick={() => setMethod('netbanking')}>
                            <Landmark size={24} />
                            <div className="text">
                                <h4>Net Banking</h4>
                                <span>All major Indian banks</span>
                            </div>
                            <div className="radio" />
                        </MethodCard>
                    </MethodGrid>

                    {method === 'card' && (
                        <CardForm>
                            <div className="field">
                                <label>Secure Card Payment</label>
                                <div className="stripe-input-wrapper">
                                    <CardElement options={cardElementOptions} />
                                </div>
                            </div>
                            <div className="field">
                                <label>Cardholder Name</label>
                                <input type="text" placeholder="John Doe" />
                            </div>
                            <div className="save-card">
                                <input type="checkbox" id="save" />
                                <label htmlFor="save">Securely save card for future bookings</label>
                            </div>
                        </CardForm>
                    )}
                </div>

                <div className="sidebar">
                    <OrderSummary>
                        <h3>Order Summary</h3>
                        <div className="total-box">
                            <span>Final Amount</span>
                            <div className="amt">₹{total.toLocaleString()}</div>
                        </div>

                        <button
                            className="pay-btn"
                            onClick={handlePayment}
                            disabled={status === 'processing' || !stripe || !clientSecret}
                        >
                            {status === 'processing' ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
                        </button>

                        <div className="secure-badges">
                            <span><Lock size={12} /> SSL Secure</span>
                            <span><ShieldCheck size={12} /> PCI Compliant</span>
                        </div>
                    </OrderSummary>

                    <HelpCard>
                        <Info size={20} />
                        <div>
                            <h4>Safe & Secure</h4>
                            <p>Your payment details are never stored on our servers.</p>
                        </div>
                    </HelpCard>
                </div>
            </Content>
        </Container>
    );
}

const ErrorBanner = styled.div`
    background: #FEF2F2;
    color: #991B1B;
    padding: 16px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    font-weight: 600;
`;

const Container = styled.div`
    max-width: 1280px;
    margin: 40px auto;
    padding: 0 24px;
`;

const ProgressSteps = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 60px;
    .line {
        width: 100px;
        height: 2px;
        background: ${props => props.theme.border};
        &.active { background: ${props => props.theme.primary}; }
    }
`;

const Step = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 700;
    color: ${props => props.$active || props.$completed ? props.theme.primary : props.theme.textTertiary};
    span {
        width: 32px;
        height: 32px;
        background: ${props => props.$active || props.$completed ? props.theme.primary : props.theme.backgroundTertiary};
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

const Content = styled.div`
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 60px;
    @media (max-width: 1024px) { grid-template-columns: 1fr; }

    .payment-methods {
       header {
          margin-bottom: 32px;
          h1 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
          p { color: ${props => props.theme.textSecondary}; font-weight: 500; }
       }
    }
`;

const MethodGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 40px;
`;

const MethodCard = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px;
    background: #fff;
    border: 2px solid ${props => props.$active ? props.theme.primary : props.theme.border};
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
    
    svg { color: ${props => props.$active ? props.theme.primary : props.theme.textSecondary}; }
    
    .text {
       flex: 1;
       h4 { font-weight: 800; margin-bottom: 4px; }
       span { font-size: 0.85rem; color: ${props => props.theme.textSecondary}; font-weight: 600; }
    }
    
    .radio {
       width: 24px;
       height: 24px;
       border: 2px solid ${props => props.$active ? props.theme.primary : props.theme.border};
       border-radius: 50%;
       position: relative;
       &::after {
          content: '';
          position: absolute;
          inset: 4px;
          background: ${props => props.theme.primary};
          border-radius: 50%;
          opacity: ${props => props.$active ? 1 : 0};
          transition: opacity 0.2s;
       }
    }
`;

const CardForm = styled.div`
    background: #fff;
    border: 1px solid ${props => props.theme.border};
    border-radius: 24px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    
    .field {
       label { display: block; font-size: 0.85rem; font-weight: 800; margin-bottom: 8px; color: ${props => props.theme.textSecondary}; }
       
       input, .stripe-input-wrapper {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid ${props => props.theme.border};
          font-weight: 600;
          font-size: 1rem;
          outline: none;
          background: #fff;
          transition: all 0.2s;
          &:focus, &.StripeElement--focus { 
            border-color: ${props => props.theme.primary};
            box-shadow: 0 0 0 4px ${props => props.theme.primary}10;
          }
       }

       .stripe-input-wrapper {
          padding: 18px 16px;
       }
    }
    
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    
    .save-card {
       display: flex;
       align-items: center;
       gap: 12px;
       font-weight: 600;
       font-size: 0.9rem;
       color: ${props => props.theme.textSecondary};
       input { width: 18px; height: 18px; }
    }
`;

const OrderSummary = styled.div`
    background: #fff;
    border: 1px solid ${props => props.theme.border};
    padding: 32px;
    border-radius: 24px;
    box-shadow: ${props => props.theme.shadows.sm};
    position: sticky;
    top: 100px;
    
    h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 24px; }
    
    .total-box {
       background: ${props => props.theme.backgroundTertiary};
       padding: 24px;
       border-radius: 16px;
       margin-bottom: 32px;
       text-align: center;
       span { font-weight: 700; color: ${props => props.theme.textSecondary}; font-size: 0.9rem; }
       .amt { font-size: 2rem; font-weight: 900; color: ${props => props.theme.primary}; margin-top: 4px; }
    }
    
    .pay-btn {
       width: 100%;
       background: #10B981;
       color: #fff;
       border: none;
       padding: 18px;
       border-radius: 16px;
       font-size: 1.1rem;
       font-weight: 800;
       cursor: pointer;
       box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
       &:disabled { background: ${props => props.theme.border}; box-shadow: none; cursor: not-allowed; }
    }
    
    .secure-badges {
       display: flex;
       justify-content: center;
       gap: 16px;
       margin-top: 24px;
       span { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: ${props => props.theme.textTertiary}; font-weight: 800; text-transform: uppercase; }
    }
`;

const HelpCard = styled.div`
    margin-top: 24px;
    padding: 24px;
    border-radius: 20px;
    border: 1px solid ${props => props.theme.border};
    display: flex;
    gap: 16px;
    align-items: center;
    h4 { font-weight: 800; font-size: 1rem; margin-bottom: 4px; }
    p { font-size: 0.8rem; color: ${props => props.theme.textSecondary}; line-height: 1.4; }
    svg { color: #10B981; }
`;

const SuccessState = styled.div`
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px;
    
    .icon { color: #10B981; margin-bottom: 32px; }
    h2 { font-size: 2.5rem; font-weight: 900; margin-bottom: 16px; }
    p { font-size: 1.1rem; color: ${props => props.theme.textSecondary}; max-width: 500px; line-height: 1.6; margin-bottom: 40px; }
    .redirect { font-weight: 700; color: ${props => props.theme.textTertiary}; }
`;
