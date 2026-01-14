import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Hotel,
    MapPin,
    Star,
    Wifi,
    Coffee,
    Wind,
    Utensils,
    CheckCircle2,
    ArrowLeft,
    Calendar,
    Users,
    Info,
    ChevronRight,
    ShieldCheck,
    Heart
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import hotelService from '../services/hotelService';

export default function HotelDetailsScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { addToCart } = useCart();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHotel();
    }, [id]);

    const fetchHotel = async () => {
        try {
            const data = await hotelService.getHotelById(id);
            setHotel(data);
        } catch (error) {
            console.error('Error fetching hotel:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (hotel) {
            addToCart({
                ...hotel,
                type: 'hotel'
            });
            navigate('/cart');
        }
    };

    if (loading) return <LoadingState><div className="spinner" /></LoadingState>;
    if (!hotel) return <EmptyState>Hotel not found</EmptyState>;

    return (
        <Container>
            <GalleryGrid>
                <div className="main-img">
                    <img src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} alt={hotel.name} />
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <button className="fav-btn">
                        <Heart size={20} />
                    </button>
                </div>
                <div className="sub-imgs">
                    <img src="https://images.unsplash.com/photo-1582719478250-c89cae4df85b?w=400" alt="Room" />
                    <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400" alt="Pool" />
                </div>
            </GalleryGrid>

            <MainLayout>
                <div className="info-column">
                    <Header>
                        <div className="title-section">
                            <h1>{hotel.name}</h1>
                            <div className="location">
                                <MapPin size={18} />
                                <span>{hotel.location}</span>
                                <button className="map-link">Show on Map</button>
                            </div>
                        </div>
                        <div className="rating-badge">
                            <div className="score">
                                <Star size={16} fill="currentColor" />
                                {hotel.rating || '4.5'}
                            </div>
                            <span className="reviews">128 Reviews</span>
                        </div>
                    </Header>

                    <Section title="About this property">
                        <p className="description">
                            Experience luxury and comfort in the heart of {hotel.location}. Our property offers
                            world-class amenities and personalized service to make your stay unforgettable.
                            {hotel.description || "Beautifully appointed rooms with stunning views and modern facilities."}
                        </p>
                    </Section>

                    <Section title="What this place offers">
                        <AmenitiesGrid>
                            <AmenityItem><Wifi size={20} /> Free high-speed WiFi</AmenityItem>
                            <AmenityItem><Utensils size={20} /> Breakfast included</AmenityItem>
                            <AmenityItem><Wind size={20} /> Air conditioning</AmenityItem>
                            <AmenityItem><Coffee size={20} /> Coffee maker</AmenityItem>
                            <AmenityItem><Utensils size={20} /> 24/7 Room service</AmenityItem>
                            <AmenityItem><CheckCircle2 size={20} /> Free parking</AmenityItem>
                        </AmenitiesGrid>
                    </Section>

                    <Section title="Choose your room">
                        <RoomList>
                            <RoomCard>
                                <div className="room-info">
                                    <h4>Deluxe King Room</h4>
                                    <p>1 King Bed • City View • 350 sqft</p>
                                    <span className="tag">Last few left!</span>
                                </div>
                                <div className="room-price">
                                    <div className="amt">₹{hotel.price?.toLocaleString()} <span>/night</span></div>
                                    <button className="select-btn" onClick={handleAddToCart}>Reserve</button>
                                </div>
                            </RoomCard>

                            <RoomCard>
                                <div className="room-info">
                                    <h4>Executive Suite</h4>
                                    <p>1 King Bed • Living Area • Premium View</p>
                                </div>
                                <div className="room-price">
                                    <div className="amt">₹{(hotel.price * 1.5)?.toLocaleString()} <span>/night</span></div>
                                    <button className="select-btn" onClick={handleAddToCart}>Reserve</button>
                                </div>
                            </RoomCard>
                        </RoomList>
                    </Section>
                </div>

                <div className="sidebar">
                    <BookingWidget>
                        <div className="price-header">
                            <span className="from">Starting from</span>
                            <div className="price">₹{hotel.price?.toLocaleString()} <span>/night</span></div>
                        </div>

                        <div className="inputs">
                            <div className="input-group">
                                <label>Check-in / Check-out</label>
                                <div className="field">
                                    <Calendar size={18} />
                                    <span>Pick Dates</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Guests</label>
                                <div className="field">
                                    <Users size={18} />
                                    <span>2 Adults, 0 Children</span>
                                </div>
                            </div>
                        </div>

                        <button className="reserve-btn" onClick={handleAddToCart}>
                            Check Availability
                        </button>

                        <p className="hint">You won't be charged yet</p>

                        <div className="guarantee">
                            <ShieldCheck size={16} />
                            <span>Price Match Guarantee</span>
                        </div>
                    </BookingWidget>

                    <StickyPromo>
                        <div className="promo-content">
                            <h3>Member Exclusive</h3>
                            <p>Save 10% or more with Member Prices at thousands of properties.</p>
                            <button>Sign in to save</button>
                        </div>
                    </StickyPromo>
                </div>
            </MainLayout>
        </Container>
    );
}

const Section = ({ title, children }) => (
    <SectionBox>
        <h3>{title}</h3>
        {children}
    </SectionBox>
);

const Container = styled.div`
    min-height: 100vh;
    background: #fff;
`;

const GalleryGrid = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 12px;
    height: 500px;
    padding: 12px;
    
    .main-img {
       position: relative;
       img {
         width: 100%;
         height: 100%;
         object-fit: cover;
         border-radius: 20px 0 0 20px;
       }
       .back-btn, .fav-btn {
          position: absolute;
          top: 20px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          color: ${props => props.theme.text};
       }
       .back-btn { left: 20px; }
       .fav-btn { right: 20px; }
    }
    
    .sub-imgs {
       display: flex;
       flex-direction: column;
       gap: 12px;
       img {
         flex: 1;
         object-fit: cover;
         width: 100%;
         height: 50%;
         &:first-child { border-radius: 0 20px 0 0; }
         &:last-child { border-radius: 0 0 20px 0; }
       }
    }
`;

const MainLayout = styled.div`
    max-width: 1280px;
    margin: 40px auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 60px;
    
    @media (max-width: 1024px) {
       grid-template-columns: 1fr;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    
    .title-section {
       h1 {
         font-size: 2.25rem;
         font-weight: 800;
         margin-bottom: 12px;
       }
       .location {
         display: flex;
         align-items: center;
         gap: 8px;
         color: ${props => props.theme.textSecondary};
         font-weight: 500;
         
         .map-link {
           border: none;
           background: transparent;
           color: ${props => props.theme.primary};
           font-weight: 700;
           cursor: pointer;
           text-decoration: underline;
           margin-left: 8px;
         }
       }
    }
    
    .rating-badge {
       text-align: right;
       .score {
         background: ${props => props.theme.primary};
         color: #fff;
         padding: 8px 16px;
         border-radius: 12px;
         font-weight: 800;
         font-size: 1.25rem;
         display: flex;
         align-items: center;
         gap: 8px;
         margin-bottom: 4px;
       }
       .reviews {
         font-size: 0.9rem;
         color: ${props => props.theme.textSecondary};
         font-weight: 600;
       }
    }
`;

const SectionBox = styled.div`
    margin-bottom: 48px;
    h3 {
       font-size: 1.5rem;
       font-weight: 800;
       margin-bottom: 24px;
    }
    .description {
       color: ${props => props.theme.textSecondary};
       line-height: 1.7;
       font-size: 1.1rem;
    }
`;

const AmenitiesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
`;

const AmenityItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    color: ${props => props.theme.text};
    svg { color: ${props => props.theme.primary}; }
`;

const RoomList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const RoomCard = styled.div`
    border: 1px solid ${props => props.theme.border};
    border-radius: 20px;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
    
    &:hover {
       border-color: ${props => props.theme.primary};
       background: ${props => props.theme.primary}05;
    }
    
    .room-info {
       h4 { font-size: 1.25rem; font-weight: 800; margin-bottom: 8px; }
       p { color: ${props => props.theme.textSecondary}; font-size: 0.95rem; }
       .tag {
         display: inline-block;
         background: #FFF7ED;
         color: #EA580C;
         font-size: 0.8rem;
         font-weight: 700;
         padding: 4px 10px;
         border-radius: 50px;
         margin-top: 12px;
       }
    }
    
    .room-price {
       text-align: right;
       .amt {
         font-size: 1.5rem;
         font-weight: 800;
         margin-bottom: 12px;
         span { font-size: 0.9rem; color: ${props => props.theme.textSecondary}; }
       }
       .select-btn {
         background: ${props => props.theme.primary};
         color: #fff;
         border: none;
         padding: 10px 24px;
         border-radius: 50px;
         font-weight: 700;
         cursor: pointer;
       }
    }
`;

const BookingWidget = styled.div`
    border: 1px solid ${props => props.theme.border};
    border-radius: 24px;
    padding: 32px;
    box-shadow: ${props => props.theme.shadows.md};
    position: sticky;
    top: 100px;
    
    .price-header {
      margin-bottom: 32px;
      .from { font-weight: 600; color: ${props => props.theme.textSecondary}; font-size: 0.9rem; }
      .price {
        font-size: 2rem;
        font-weight: 900;
        color: ${props => props.theme.primary};
        span { font-size: 1.1rem; color: ${props => props.theme.textSecondary}; font-weight: 600; }
      }
    }
    
    .inputs {
       display: flex;
       flex-direction: column;
       gap: 16px;
       margin-bottom: 24px;
       
       .input-group {
          label { display: block; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; margin-bottom: 8px; color: ${props => props.theme.textTertiary}; }
          .field {
             border: 1px solid ${props => props.theme.border};
             padding: 14px;
             border-radius: 12px;
             display: flex;
             align-items: center;
             gap: 12px;
             font-weight: 600;
             color: ${props => props.theme.text};
             svg { color: ${props => props.theme.primary}; }
          }
       }
    }
    
    .reserve-btn {
       width: 100%;
       background: ${props => props.theme.primary};
       color: #fff;
       border: none;
       padding: 18px;
       border-radius: 16px;
       font-size: 1.1rem;
       font-weight: 800;
       cursor: pointer;
       margin-bottom: 16px;
       transition: all 0.2s;
       
       &:hover { opacity: 0.9; transform: translateY(-2px); }
    }
    
    .hint { text-align: center; font-size: 0.85rem; color: ${props => props.theme.textSecondary}; margin-bottom: 24px; }
    
    .guarantee {
       display: flex;
       align-items: center;
       justify-content: center;
       gap: 8px;
       font-size: 0.9rem;
       color: ${props => props.theme.textSecondary};
       font-weight: 600;
       svg { color: #10B981; }
    }
`;

const StickyPromo = styled.div`
   margin-top: 24px;
   background: #0F172A;
   border-radius: 20px;
   padding: 24px;
   color: #fff;
   
   h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 8px; }
   p { font-size: 0.9rem; opacity: 0.8; line-height: 1.5; margin-bottom: 20px; }
   button {
      background: #fff;
      color: #0F172A;
      border: none;
      padding: 10px 20px;
      border-radius: 50px;
      font-weight: 700;
      width: 100%;
      cursor: pointer;
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
