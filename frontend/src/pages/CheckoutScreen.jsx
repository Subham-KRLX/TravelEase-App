import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ShieldCheck,
    CreditCard,
    ChevronRight,
    Plane,
    Hotel,
    Package,
    Calendar,
    Ticket,
    Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function CheckoutScreen() {
    const navigate = useNavigate();
    const { cartItems: cart, removeFromCart, updateQuantity, clearCart, getTotalPrice: getCartTotal } = useCart();
    const { user } = useAuth();
    const { theme } = useTheme();
    const [promoCode, setPromoCode] = useState('');

    const total = getCartTotal();
    const taxes = total * 0.12;
    const finalTotal = total + taxes;

    const handleProceed = () => {
        if (!user) {
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }
        navigate('/payment');
    };

    if (cart.length === 0) {
        return (
            <EmptyCart>
                <ShoppingBag size={80} />
                <h2>Your travel bag is empty</h2>
                <p>Looks like you haven't added any adventures yet. Start exploring to find your next destination!</p>
                <button onClick={() => navigate('/')}>Explore Destinations</button>
            </EmptyCart>
        );
    }

    return (
        <Container>
            <ProgressSteps>
                <Step active><span>1</span> Bag</Step>
                <div className="line" />
                <Step><span>2</span> Details</Step>
                <div className="line" />
                <Step><span>3</span> Payment</Step>
            </ProgressSteps>

            <Content>
                <div className="cart-items">
                    <header>
                        <h1>Your Travel Bag</h1>
                        <span>{cart.length} items selected</span>
                    </header>

                    {cart.map((item) => (
                        <CartItem key={item.id || item._id} layout>
                            <div className="item-thumb">
                                {item.type === 'flight' ? <div className="icon-box"><Plane size={32} /></div> : <img src={item.image} alt={item.name} />}
                            </div>
                            <div className="item-info">
                                <div className="type-badge">
                                    {item.type === 'flight' ? <Plane size={12} /> : item.type === 'hotel' ? <Hotel size={12} /> : <Package size={12} />}
                                    {item.type}
                                </div>
                                <h3>{item.name || item.title || `${item.from} to ${item.to}`}</h3>
                                <div className="meta">
                                    <span><Calendar size={14} /> Sep 24 - Sep 30</span>
                                </div>
                                <div className="controls">
                                    <div className="qty">
                                        <button onClick={() => updateQuantity(item.id || item._id, item.type, Math.max(1, (item.quantity || 1) - 1))}><Minus size={14} /></button>
                                        <span>{item.quantity || 1}</span>
                                        <button onClick={() => updateQuantity(item.id || item._id, item.type, (item.quantity || 1) + 1)}><Plus size={14} /></button>
                                    </div>
                                    <button className="remove" onClick={() => removeFromCart(item.id || item._id, item.type)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="item-price">
                                ₹{item.price?.toLocaleString()}
                            </div>
                        </CartItem>
                    ))}
                </div>

                <div className="sidebar">
                    <SummaryCard>
                        <h3>Order Summary</h3>

                        <div className="promo-box">
                            <Ticket size={18} />
                            <input
                                type="text"
                                placeholder="Enter promo code"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <button>Apply</button>
                        </div>

                        <div className="details">
                            <div className="row">
                                <span>Subtotal</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>
                            <div className="row">
                                <span>Taxes & Fees (12%)</span>
                                <span>₹{taxes.toLocaleString()}</span>
                            </div>
                            <div className="row discount">
                                <span>Discount</span>
                                <span>-₹0</span>
                            </div>
                        </div>

                        <div className="total">
                            <span>Total</span>
                            <span>₹{finalTotal.toLocaleString()}</span>
                        </div>

                        <button className="checkout-btn" onClick={handleProceed}>
                            Proceed to Checkout <ArrowRight size={20} />
                        </button>

                        <div className="security">
                            <ShieldCheck size={16} /> 100% Secure Checkout
                        </div>
                    </SummaryCard>

                    <SupportCard onClick={() => navigate('/support')}>
                        <Info size={20} />
                        <div>
                            <h4>Need Help?</h4>
                            <p>Contact our 24/7 support for any booking queries.</p>
                        </div>
                        <ChevronRight size={18} />
                    </SupportCard>
                </div>
            </Content>
        </Container>
    );
}

const Container = styled.div`
    max-width: 1280px;
    margin: 40px auto;
    padding: 0 24px;
    min-height: 80vh;
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
    }
`;

const Step = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 700;
    color: ${props => props.active ? props.theme.primary : props.theme.textTertiary};
    
    span {
        width: 32px;
        height: 32px;
        background: ${props => props.active ? props.theme.primary : props.theme.backgroundTertiary};
        color: ${props => props.active ? '#fff' : props.theme.textSecondary};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
    }
`;

const Content = styled.div`
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 60px;
    
    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }

    .cart-items {
        header {
            margin-bottom: 32px;
            h1 { font-size: 2rem; font-weight: 800; margin-bottom: 4px; }
            span { color: ${props => props.theme.textSecondary}; font-weight: 600; }
        }
    }
`;

const CartItem = styled(motion.div)`
    display: flex;
    gap: 24px;
    padding: 24px;
    background: #fff;
    border-radius: 24px;
    border: 1px solid ${props => props.theme.border};
    margin-bottom: 16px;
    transition: all 0.2s;
    
    &:hover { border-color: ${props => props.theme.primary}; box-shadow: ${props => props.theme.shadows.sm}; }
    
    .item-thumb {
        width: 120px;
        height: 120px;
        border-radius: 16px;
        overflow: hidden;
        flex-shrink: 0;
        
        img { width: 100%; height: 100%; object-fit: cover; }
        
        .icon-box {
            width: 100%; height: 100%;
            background: ${props => props.theme.primary}10;
            color: ${props => props.theme.primary};
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    
    .item-info {
        flex: 1;
        
        .type-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: ${props => props.theme.backgroundTertiary};
            padding: 4px 12px;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            color: ${props => props.theme.textSecondary};
            margin-bottom: 8px;
        }
        
        h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 8px; }
        
        .meta {
            display: flex;
            gap: 16px;
            font-size: 0.9rem;
            color: ${props => props.theme.textSecondary};
            font-weight: 500;
            margin-bottom: 20px;
            span { display: flex; align-items: center; gap: 6px; }
        }
        
        .controls {
            display: flex;
            align-items: center;
            gap: 24px;
            
            .qty {
                display: flex;
                align-items: center;
                gap: 16px;
                background: ${props => props.theme.backgroundTertiary};
                padding: 4px;
                border-radius: 50px;
                
                button {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    border: none;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: ${props => props.theme.text};
                }
                
                span { font-weight: 800; font-size: 0.95rem; min-width: 20px; text-align: center; }
            }
            
            .remove {
                background: none;
                border: none;
                color: ${props => props.theme.danger};
                cursor: pointer;
                opacity: 0.6;
                transition: opacity 0.2s;
                &:hover { opacity: 1; }
            }
        }
    }
    
    .item-price {
        font-size: 1.25rem;
        font-weight: 800;
        color: ${props => props.theme.primary};
    }
`;

const SummaryCard = styled.div`
    background: #fff;
    border: 1px solid ${props => props.theme.border};
    border-radius: 24px;
    padding: 32px;
    box-shadow: ${props => props.theme.shadows.sm};
    position: sticky;
    top: 100px;
    
    h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 24px; }
    
    .promo-box {
        display: flex;
        align-items: center;
        gap: 12px;
        background: ${props => props.theme.backgroundTertiary};
        padding: 8px 16px;
        border-radius: 12px;
        margin-bottom: 24px;
        
        input {
            flex: 1;
            border: none;
            background: transparent;
            font-weight: 600;
            outline: none;
            &::placeholder { color: ${props => props.theme.textTertiary}; }
        }
        
        button {
            background: ${props => props.theme.text};
            color: #fff;
            border: none;
            padding: 6px 16px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 0.85rem;
        }
    }
    
    .details {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid ${props => props.theme.border};
        
        .row {
            display: flex;
            justify-content: space-between;
            font-weight: 600;
            color: ${props => props.theme.textSecondary};
            
            &.discount { color: #10B981; }
        }
    }
    
    .total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
        span:first-child { font-size: 1.25rem; font-weight: 800; }
        span:last-child { font-size: 1.75rem; font-weight: 900; color: ${props => props.theme.primary}; }
    }
    
    .checkout-btn {
        width: 100%;
        background: ${props => props.theme.primary};
        color: #fff;
        border: none;
        padding: 18px;
        border-radius: 16px;
        font-size: 1.1rem;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 106, 255, 0.3);
    }
    
    .security {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        margin-top: 20px;
        font-size: 0.85rem;
        color: ${props => props.theme.textTertiary};
        font-weight: 600;
    }
`;

const EmptyCart = styled.div`
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px;
    
    svg { color: ${props => props.theme.border}; margin-bottom: 24px; }
    h2 { font-size: 2rem; font-weight: 800; margin-bottom: 12px; }
    p { color: ${props => props.theme.textSecondary}; margin-bottom: 32px; max-width: 400px; line-height: 1.6; }
    button {
        background: ${props => props.theme.primary};
        color: #fff;
        border: none;
        padding: 14px 32px;
        border-radius: 12px;
        font-weight: 700;
        cursor: pointer;
    }
`;

const SupportCard = styled.div`
    margin-top: 24px;
    background: #0F172A;
    border-radius: 20px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    color: #fff;
    cursor: pointer;
    
    svg:first-child { color: ${props => props.theme.primary}; }
    
    div {
        flex: 1;
        h4 { font-weight: 800; margin-bottom: 4px; }
        p { font-size: 0.8rem; opacity: 0.7; }
    }
`;
