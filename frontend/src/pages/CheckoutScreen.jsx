import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
    IoCartOutline,
    IoArrowForward,
    IoAdd,
    IoRemove,
    IoTrashOutline
} from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const CheckoutScreen = () => {
    const navigate = useNavigate();
    const { cartItems, getTotalPrice, removeFromCart, updateQuantity } = useCart();
    const { user } = useAuth();
    const { theme } = useTheme();

    const handleCheckout = () => {
        if (!user) {
            if (window.confirm('Please login to complete your booking')) {
                navigate('/login');
            }
            return;
        }

        if (cartItems.length === 0) {
            alert('Cart is empty!');
            return;
        }

        // Navigate to Stripe payment screen
        const amount = Math.round(getTotalPrice() * 1.18);
        const paymentData = {
            amount: amount,
            items: cartItems
        };

        // Save to localStorage as backup
        localStorage.setItem('pending_payment', JSON.stringify(paymentData));

        navigate('/payment', { state: paymentData });
    };

    if (cartItems.length === 0) {
        return (
            <Container theme={theme}>
                <EmptyState>
                    <IoCartOutline size={80} color={theme.textTertiary} />
                    <EmptyTitle theme={theme}>Your cart is empty</EmptyTitle>
                    <EmptySubtitle theme={theme}>Add some items to get started</EmptySubtitle>
                    <BrowseButton theme={theme} onClick={() => navigate('/')}>
                        Browse Deals
                    </BrowseButton>
                </EmptyState>
            </Container>
        );
    }

    return (
        <Container theme={theme}>
            <ContentWrapper>
                <Title theme={theme}>Shopping Cart</Title>

                <Grid>
                    <CartList>
                        {cartItems.map((item) => (
                            <CartItem key={`${item.type}-${item.id}`} theme={theme}>
                                <ItemInfo>
                                    <ItemName theme={theme}>
                                        {item.type === 'flight' ?
                                            `${item.airline?.name || item.airline} - ${item.from || (item.origin?.city || item.origin)} to ${item.to || (item.destination?.city || item.destination)}`
                                            : item.name}
                                    </ItemName>
                                    <ItemDetails theme={theme}>
                                        {item.type === 'flight' && (
                                            <>
                                                {item.departure?.time || item.departTime} - {item.arrival?.time || item.arriveTime} • {item.duration}
                                            </>
                                        )}
                                        {item.type === 'hotel' && (item.from || (item.location?.city ? `${item.location.address}, ${item.location.city}` : item.location))}
                                    </ItemDetails>
                                    <ItemPrice theme={theme}>
                                        ₹{(typeof item.price === 'number' ? item.price : (item.price?.economy || item.price?.pricePerNight || item.pricePerNight || 0)).toLocaleString()} × {item.quantity}
                                    </ItemPrice>
                                </ItemInfo>

                                <ItemActions>
                                    <QuantityControls theme={theme}>
                                        <QuantityButton theme={theme} onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}>
                                            <IoRemove size={16} />
                                        </QuantityButton>
                                        <Quantity theme={theme}>{item.quantity}</Quantity>
                                        <QuantityButton theme={theme} onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}>
                                            <IoAdd size={16} />
                                        </QuantityButton>
                                    </QuantityControls>

                                    <RemoveButton onClick={() => removeFromCart(item.id, item.type)}>
                                        <IoTrashOutline size={20} />
                                    </RemoveButton>
                                </ItemActions>
                            </CartItem>
                        ))}
                    </CartList>

                    <SummaryCard theme={theme}>
                        <SummaryTitle theme={theme}>Order Summary</SummaryTitle>

                        <SummaryRow>
                            <SummaryLabel theme={theme}>Subtotal</SummaryLabel>
                            <SummaryValue theme={theme}>₹{getTotalPrice().toLocaleString()}</SummaryValue>
                        </SummaryRow>

                        <SummaryRow>
                            <SummaryLabel theme={theme}>Taxes & Fees (18%)</SummaryLabel>
                            <SummaryValue theme={theme}>₹{Math.round(getTotalPrice() * 0.18).toLocaleString()}</SummaryValue>
                        </SummaryRow>

                        <Divider theme={theme} />

                        <TotalRow>
                            <TotalLabel theme={theme}>Total</TotalLabel>
                            <TotalValue theme={theme}>₹{Math.round(getTotalPrice() * 1.18).toLocaleString()}</TotalValue>
                        </TotalRow>

                        <CheckoutButton theme={theme} onClick={handleCheckout}>
                            Proceed to Payment
                            <IoArrowForward size={20} />
                        </CheckoutButton>
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
    padding: 40px 24px;
`;

const ContentWrapper = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;

const Title = styled.h1`
    font-size: 32px;
    font-weight: 800;
    color: ${props => props.theme.text};
    margin-bottom: 32px;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    align-items: start;

    @media (min-width: 968px) {
        grid-template-columns: 1fr 380px;
        gap: 32px;
    }
`;


const CartList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const CartItem = styled.div`
    background-color: ${props => props.theme.card};
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid ${props => props.theme.border || 'transparent'};
    
    @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }
`;

const ItemInfo = styled.div`
    flex: 1;
`;

const ItemName = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: ${props => props.theme.text};
    margin-bottom: 8px;
`;

const ItemDetails = styled.div`
    font-size: 14px;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 8px;
`;

const ItemPrice = styled.div`
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.primary};
`;

const ItemActions = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    
    @media (max-width: 640px) {
        width: 100%;
        justify-content: space-between;
    }
`;

const QuantityControls = styled.div`
    display: flex;
    align-items: center;
    background-color: ${props => props.theme.backgroundSecondary};
    padding: 4px;
    border-radius: 8px;
    gap: 12px;
`;

const QuantityButton = styled.button`
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.card};
    border: 1px solid ${props => props.theme.border || 'transparent'};
    border-radius: 6px;
    cursor: pointer;
    color: ${props => props.theme.text};
    
    &:hover {
        background-color: ${props => props.theme.backgroundTertiary};
    }
`;

const Quantity = styled.span`
    font-weight: 600;
    color: ${props => props.theme.text};
    min-width: 20px;
    text-align: center;
`;

const RemoveButton = styled.button`
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        background-color: #fee2e2;
    }
`;

const SummaryCard = styled.div`
    background-color: ${props => props.theme.card};
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    border: 1px solid ${props => props.theme.border || 'transparent'};
    position: sticky;
    top: 100px;
`;

const SummaryTitle = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.text};
    margin-bottom: 24px;
`;

const SummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
`;

const SummaryLabel = styled.span`
    color: ${props => props.theme.textSecondary};
    font-size: 15px;
`;

const SummaryValue = styled.span`
    color: ${props => props.theme.text};
    font-weight: 500;
    font-size: 15px;
`;

const Divider = styled.div`
    height: 1px;
    background-color: ${props => props.theme.border || '#e2e8f0'};
    margin: 20px 0;
`;

const TotalRow = styled(SummaryRow)`
    margin-bottom: 32px;
`;

const TotalLabel = styled.span`
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.text};
`;

const TotalValue = styled.span`
    font-size: 24px;
    font-weight: 800;
    color: ${props => props.theme.primary};
`;

const CheckoutButton = styled.button`
    width: 100%;
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
    transition: background-color 0.2s;

    &:hover {
        background-color: ${props => props.theme.secondary};
    }
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    text-align: center;
`;

const EmptyTitle = styled.h2`
    font-size: 24px;
    color: ${props => props.theme.text};
    margin-top: 24px;
    margin-bottom: 8px;
`;

const EmptySubtitle = styled.p`
    color: ${props => props.theme.textSecondary};
    margin-bottom: 32px;
`;

const BrowseButton = styled.button`
    background-color: ${props => props.theme.primary};
    color: white;
    padding: 12px 32px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    font-size: 16px;
    
    &:hover {
        background-color: ${props => props.theme.secondary};
    }
`;

export default CheckoutScreen;
