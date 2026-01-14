import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Plane,
    Clock,
    MapPin,
    ArrowLeft,
    ShieldCheck,
    Wifi,
    Coffee,
    Monitor,
    Briefcase,
    ChevronRight,
    Info,
    CreditCard,
    Gift
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import flightService from '../services/flightService';

export default function FlightDetailsScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { addToCart } = useCart();
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFlight();
    }, [id]);

    const fetchFlight = async () => {
        try {
            const data = await flightService.getFlightById(id);
            setFlight(data);
        } catch (error) {
            console.error('Error fetching flight:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (flight) {
            addToCart({
                ...flight,
                type: 'flight'
            });
            navigate('/cart');
        }
    };

    if (loading) return <LoadingState><div className="spinner" /></LoadingState>;
    if (!flight) return <EmptyState>Flight not found</EmptyState>;

    return (
        <Container>
            <HeroSection>
                <div className="overlay" />
                <div className="content">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} /> Back to Search
                    </button>
                    <div className="main-info">
                        <div className="airline">
                            <div className="logo">{flight.airline?.[0]}</div>
                            <div>
                                <h1>{flight.airline || 'SkyHigh Airways'}</h1>
                                <span>Flight {flight.flightNumber || 'FL-101'} • Boeing 737 MAX</span>
                            </div>
                        </div>
                        <div className="status">
                            <span className="badge">On Time</span>
                        </div>
                    </div>
                </div>
            </HeroSection>

            <MainLayout>
                <div className="details-column">
                    <Section>
                        <div className="route-viz">
                            <div className="point">
                                <span className="time">{flight.departureTime || '10:00'}</span>
                                <span className="city">{flight.from || 'BOM'}</span>
                                <span className="airport">Chatrapati Shivaji Int'l</span>
                            </div>

                            <div className="path">
                                <div className="duration">
                                    <Clock size={14} /> {flight.duration || '2h 15m'}
                                </div>
                                <div className="line">
                                    <div className="dot" />
                                    <Plane size={18} />
                                    <div className="dot" />
                                </div>
                                <div className="type">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}</div>
                            </div>

                            <div className="point align-right">
                                <span className="time">{flight.arrivalTime || '12:15'}</span>
                                <span className="city">{flight.to || 'DEL'}</span>
                                <span className="airport">Indira Gandhi Int'l</span>
                            </div>
                        </div>
                    </Section>

                    <Section title="In-flight Amenities">
                        <AmenitiesGrid>
                            <AmenityItem>
                                <Wifi size={20} />
                                <div>
                                    <h4>High Speed WiFi</h4>
                                    <p>Stay connected throughout your flight</p>
                                </div>
                            </AmenityItem>
                            <AmenityItem>
                                <Coffee size={20} />
                                <div>
                                    <h4>Choice of Meals</h4>
                                    <p>Delicious breakfast and beverage options</p>
                                </div>
                            </AmenityItem>
                            <AmenityItem>
                                <Monitor size={20} />
                                <div>
                                    <h4>Entertainment</h4>
                                    <p>Browse 500+ movies and TV shows</p>
                                </div>
                            </AmenityItem>
                            <AmenityItem>
                                <ShieldCheck size={20} />
                                <div>
                                    <h4>Travel Safety</h4>
                                    <p>Enhanced cleaning and sanitized cabin</p>
                                </div>
                            </AmenityItem>
                        </AmenitiesGrid>
                    </Section>

                    <Section title="Baggage Information">
                        <BaggageInfo>
                            <div className="row">
                                <Briefcase size={20} />
                                <div className="text">
                                    <h4>Cabin Baggage</h4>
                                    <span>7 KG / Person</span>
                                </div>
                                <div className="status included">Included</div>
                            </div>
                            <div className="row">
                                <Briefcase size={20} />
                                <div className="text">
                                    <h4>Check-in Baggage</h4>
                                    <span>15 KG / Person</span>
                                </div>
                                <div className="status included">Included</div>
                            </div>
                        </BaggageInfo>
                    </Section>
                </div>

                <div className="sidebar">
                    <BookingCard>
                        <div className="header">
                            <h3>Pricing Summary</h3>
                            <div className="price">
                                ₹{flight.price?.toLocaleString()}
                                <span>/person</span>
                            </div>
                        </div>

                        <div className="breakdown">
                            <div className="item">
                                <span>Base Fare</span>
                                <span>₹{(flight.price * 0.8).toLocaleString()}</span>
                            </div>
                            <div className="item">
                                <span>Taxes & Fees</span>
                                <span>₹{(flight.price * 0.2).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="total">
                            <span>Total Price</span>
                            <span>₹{flight.price?.toLocaleString()}</span>
                        </div>

                        <button className="book-btn" onClick={handleAddToCart}>
                            Book Selection <ArrowRight size={20} />
                        </button>

                        <div className="trust-footer">
                            <ShieldCheck size={16} /> Best Price Guaranteed
                        </div>
                    </BookingCard>

                    <PromoCard>
                        <Gift size={24} />
                        <div>
                            <h4>Unlock Deals</h4>
                            <p>Sign in to earn 250 TravelPoints on this booking.</p>
                        </div>
                        <ChevronRight size={20} />
                    </PromoCard>
                </div>
            </MainLayout>
        </Container>
    );
}

const Section = ({ title, children }) => (
    <SectionBox>
        {title && <h3>{title}</h3>}
        {children}
    </SectionBox>
);

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.backgroundTertiary};
`;

const HeroSection = styled.div`
  height: 300px;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.primaryDark});
  position: relative;
  overflow: hidden;
  padding-top: 72px;
  
  .overlay {
    position: absolute;
    inset: 0;
    opacity: 0.1;
    background-image: radial-gradient(#fff 2px, transparent 2px);
    background-size: 32px 32px;
  }
  
  .content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 24px;
    position: relative;
    z-index: 10;
    color: #fff;
    
    .back-btn {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      padding: 8px 16px;
      border-radius: 50px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 40px;
      backdrop-filter: blur(4px);
      
      &:hover {
        background: rgba(255,255,255,0.2);
      }
    }
    
    .main-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      
      .airline {
        display: flex;
        gap: 20px;
        align-items: center;
        
        .logo {
          width: 64px;
          height: 64px;
          background: #fff;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 2rem;
          color: ${props => props.theme.primary};
        }
        
        h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 4px;
        }
        
        span {
          opacity: 0.8;
          font-weight: 600;
        }
      }
      
      .badge {
        background: #10B981;
        color: #fff;
        padding: 6px 16px;
        border-radius: 50px;
        font-weight: 700;
        font-size: 0.9rem;
      }
    }
  }
`;

const MainLayout = styled.div`
  max-width: 1280px;
  margin: -40px auto 40px;
  padding: 0 24px;
  display: flex;
  gap: 32px;
  position: relative;
  z-index: 20;

  .details-column {
    flex: 1;
  }

  .sidebar {
    width: 380px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

const SectionBox = styled.div`
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.border};
  
  h3 {
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 24px;
    color: ${props => props.theme.text};
  }

  .route-viz {
    display: flex;
    align-items: center;
    gap: 40px;
    
    .point {
      flex: 1;
      .time {
        display: block;
        font-size: 2.25rem;
        font-weight: 900;
        line-height: 1;
        margin-bottom: 8px;
        color: ${props => props.theme.text};
      }
      .city {
        display: block;
        font-size: 1.25rem;
        font-weight: 800;
        margin-bottom: 4px;
      }
      .airport {
        color: ${props => props.theme.textSecondary};
        font-size: 0.9rem;
      }
      
      &.align-right {
        text-align: right;
      }
    }
    
    .path {
      text-align: center;
      flex: 1;
      
      .duration {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-weight: 600;
        color: ${props => props.theme.textSecondary};
        font-size: 0.9rem;
        margin-bottom: 8px;
      }
      
      .line {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 2px solid ${props => props.theme.primary};
        }
        
        svg {
          color: ${props => props.theme.primary};
        }
        
        &::before, &::after {
          content: '';
          height: 2px;
          background: ${props => props.theme.border};
          flex: 1;
        }
      }
      
      .type {
        color: #10B981;
        font-weight: 700;
        font-size: 0.9rem;
      }
    }
  }
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
`;

const AmenityItem = styled.div`
  display: flex;
  gap: 16px;
  
  svg {
    color: ${props => props.theme.primary};
    flex-shrink: 0;
  }
  
  h4 {
    font-weight: 700;
    margin-bottom: 4px;
    font-size: 1rem;
  }
  
  p {
    color: ${props => props.theme.textSecondary};
    font-size: 0.85rem;
    line-height: 1.4;
  }
`;

const BaggageInfo = styled.div`
  .row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid ${props => props.theme.borderLight};
    
    &:last-child {
      border: none;
    }
    
    svg {
      color: ${props => props.theme.textSecondary};
    }
    
    .text {
      flex: 1;
      h4 {
        font-weight: 700;
        font-size: 1rem;
      }
      span {
        color: ${props => props.theme.textSecondary};
        font-size: 0.85rem;
      }
    }
    
    .status {
      padding: 4px 12px;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 700;
      
      &.included {
        background: #10B98115;
        color: #10B981;
      }
    }
  }
`;

const BookingCard = styled.div`
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.border};
  position: sticky;
  top: 100px;
  
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
    
    h3 {
      font-size: 1.25rem;
      font-weight: 800;
    }
    
    .price {
      text-align: right;
      font-size: 1.75rem;
      font-weight: 900;
      color: ${props => props.theme.primary};
      
      span {
        display: block;
        font-size: 0.9rem;
        color: ${props => props.theme.textSecondary};
        font-weight: 600;
      }
    }
  }
  
  .breakdown {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid ${props => props.theme.border};
    
    .item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      color: ${props => props.theme.textSecondary};
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    
    span {
      font-weight: 800;
      font-size: 1.25rem;
    }
  }
  
  .book-btn {
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
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0, 106, 255, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 106, 255, 0.4);
    }
  }
  
  .trust-footer {
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

const PromoCard = styled.div`
  background: linear-gradient(135deg, #0F172A, #1E293B);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  color: #fff;
  cursor: pointer;
  
  svg:first-child {
    color: #FACC15;
  }
  
  h4 {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 4px;
  }
  
  p {
    font-size: 0.85rem;
    opacity: 0.7;
    line-height: 1.4;
  }
`;

const LoadingState = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid ${props => props.theme.border};
    border-top-color: ${props => props.theme.primary};
    border-radius: 50%;
    animation: rotate 1s linear infinite;
  }
  @keyframes rotate { to { transform: rotate(360deg); } }
`;

const EmptyState = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
`;
