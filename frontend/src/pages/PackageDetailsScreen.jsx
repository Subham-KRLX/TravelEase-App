import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Package,
    MapPin,
    Clock,
    Star,
    CheckCircle2,
    Plane,
    Hotel,
    Car,
    Camera,
    ArrowLeft,
    ChevronRight,
    ShieldCheck,
    Calendar,
    Users,
    Compass
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import packageService from '../services/packageService';

export default function PackageDetailsScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { addToCart } = useCart();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPackage();
    }, [id]);

    const fetchPackage = async () => {
        try {
            const data = await packageService.getPackageById(id);
            setPkg(data);
        } catch (error) {
            console.error('Error fetching package:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (pkg) {
            addToCart({
                ...pkg,
                type: 'package'
            });
            navigate('/cart');
        }
    };

    if (loading) return <LoadingState><div className="spinner" /></LoadingState>;
    if (!pkg) return <EmptyState>Package not found</EmptyState>;

    return (
        <Container>
            <Hero>
                <img src={pkg.image || 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200'} alt={pkg.title} />
                <div className="overlay" />
                <div className="content">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} /> Back
                    </button>
                    <div className="title-row">
                        <div>
                            <h1>{pkg.title}</h1>
                            <div className="meta">
                                <span className="duration"><Clock size={16} /> {pkg.duration || '5 Days / 4 Nights'}</span>
                                <span className="location"><MapPin size={16} /> {pkg.destination || 'Exotic Location'}</span>
                            </div>
                        </div>
                        <div className="rating">
                            <div className="score"><Star size={16} fill="currentColor" /> 4.9</div>
                            <span>Best Seller</span>
                        </div>
                    </div>
                </div>
            </Hero>

            <MainLayout>
                <div className="content-column">
                    <Section title="Trip Overview">
                        <p className="description">
                            {pkg.description || "Embark on an unforgettable journey through breathtaking landscapes and cultural treasures. This carefully curated package combines luxury, adventure, and local experiences."}
                        </p>
                        <QuickFeatures>
                            <div className="feature">
                                <Plane size={24} />
                                <span>Round Trip Flights</span>
                            </div>
                            <div className="feature">
                                <Hotel size={24} />
                                <span>4-Star Accommodation</span>
                            </div>
                            <div className="feature">
                                <Car size={24} />
                                <span>Private Transfers</span>
                            </div>
                            <div className="feature">
                                <Camera size={24} />
                                <span>Guided Tours</span>
                            </div>
                        </QuickFeatures>
                    </Section>

                    <Section title="Itinerary">
                        <Timeline>
                            {[1, 2, 3, 4, 5].map(day => (
                                <TimelineItem key={day}>
                                    <div className="day-badge">Day {day}</div>
                                    <div className="content">
                                        <h4>{day === 1 ? 'Arrival & Welcome Dinner' : day === 5 ? 'Leisure & Departure' : 'Explore the Hidden Gems'}</h4>
                                        <p>Standard itinerary details with local sightseeing, meals, and comfortable stays at our partner hotels.</p>
                                    </div>
                                </TimelineItem>
                            ))}
                        </Timeline>
                    </Section>

                    <Section title="What's Included">
                        <IncludedGrid>
                            <IncludedItem><CheckCircle2 size={18} /> Daily Breakfast & Dinner</IncludedItem>
                            <IncludedItem><CheckCircle2 size={18} /> English Speaking Guide</IncludedItem>
                            <IncludedItem><CheckCircle2 size={18} /> Entrance Fees to Monuments</IncludedItem>
                            <IncludedItem><CheckCircle2 size={18} /> Internal Transportation</IncludedItem>
                            <IncludedItem><CheckCircle2 size={18} /> Travel Insurance</IncludedItem>
                            <IncludedItem><CheckCircle2 size={18} /> Welcome Kit</IncludedItem>
                        </IncludedGrid>
                    </Section>
                </div>

                <div className="sidebar">
                    <BookingCard>
                        <div className="price-box">
                            <span className="label">Package Price</span>
                            <div className="price">₹{pkg.price?.toLocaleString()} <span>/ person</span></div>
                        </div>

                        <div className="config">
                            <div className="item">
                                <Calendar size={18} />
                                <div>
                                    <label>Date</label>
                                    <span>Sep 12, 2026</span>
                                </div>
                                <ChevronRight size={16} />
                            </div>
                            <div className="item">
                                <Users size={18} />
                                <div>
                                    <label>Travelers</label>
                                    <span>2 Adults</span>
                                </div>
                                <ChevronRight size={16} />
                            </div>
                        </div>

                        <button className="book-btn" onClick={handleAddToCart}>
                            Complete Booking
                        </button>

                        <div className="trust">
                            <ShieldCheck size={16} />
                            <span>100% Secure Payments • Lowest Price</span>
                        </div>
                    </BookingCard>

                    <InquiryCard>
                        <Compass size={24} />
                        <div>
                            <h4>Need Customization?</h4>
                            <p>Talk to our experts for a personalized plan.</p>
                        </div>
                    </InquiryCard>
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

const Hero = styled.div`
    height: 600px;
    position: relative;
    img { width: 100%; height: 100%; object-fit: cover; }
    .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); }
    
    .content {
       position: absolute;
       bottom: 0;
       left: 0;
       right: 0;
       max-width: 1280px;
       margin: 0 auto;
       padding: 48px;
       color: #fff;
       
       .back-btn {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: #fff;
          padding: 8px 16px;
          border-radius: 50px;
          margin-bottom: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
       }
       
       h1 { font-size: 3.5rem; font-weight: 900; margin-bottom: 16px; text-shadow: 0 4px 12px rgba(0,0,0,0.3); }
       
       .meta {
          display: flex;
          gap: 24px;
          font-weight: 600;
          font-size: 1.1rem;
          span { display: flex; align-items: center; gap: 8px; }
       }
       
       .title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
       }
       
       .rating {
          text-align: right;
          .score { background: #FACC15; color: #000; padding: 6px 14px; border-radius: 12px; font-weight: 800; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
          span { font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; }
       }
    }
`;

const MainLayout = styled.div`
    max-width: 1280px;
    margin: 60px auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 64px;
    
    @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const SectionBox = styled.div`
    margin-bottom: 60px;
    h3 { font-size: 1.75rem; font-weight: 800; margin-bottom: 24px; }
    .description { font-size: 1.15rem; line-height: 1.8; color: ${props => props.theme.textSecondary}; }
`;

const QuickFeatures = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-top: 40px;
    
    .feature {
       text-align: center;
       background: ${props => props.theme.backgroundTertiary};
       padding: 24px;
       border-radius: 20px;
       display: flex;
       flex-direction: column;
       align-items: center;
       gap: 12px;
       svg { color: ${props => props.theme.primary}; }
       span { font-weight: 700; font-size: 0.9rem; }
    }
`;

const Timeline = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    position: relative;
    &::before {
       content: '';
       position: absolute;
       left: 44px;
       top: 40px;
       bottom: 40px;
       width: 2px;
       background: ${props => props.theme.border};
    }
`;

const TimelineItem = styled.div`
    display: flex;
    gap: 48px;
    position: relative;
    
    .day-badge {
       width: 88px;
       height: 88px;
       background: #fff;
       border: 2px solid ${props => props.theme.primary};
       border-radius: 50%;
       display: flex;
       align-items: center;
       justify-content: center;
       font-weight: 800;
       flex-shrink: 0;
       z-index: 5;
    }
    
    .content {
       padding-top: 20px;
       h4 { font-size: 1.25rem; font-weight: 800; margin-bottom: 8px; }
       p { color: ${props => props.theme.textSecondary}; line-height: 1.6; }
    }
`;

const IncludedGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
`;

const IncludedItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    font-size: 1.1rem;
    svg { color: #10B981; }
`;

const BookingCard = styled.div`
    background: #fff;
    border: 1px solid ${props => props.theme.border};
    border-radius: 32px;
    padding: 32px;
    box-shadow: ${props => props.theme.shadows.md};
    position: sticky;
    top: 100px;
    
    .price-box {
       margin-bottom: 40px;
       .label { font-weight: 700; color: ${props => props.theme.textTertiary}; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; }
       .price { font-size: 2.5rem; font-weight: 900; color: ${props => props.theme.primary}; span { font-size: 1rem; color: ${props => props.theme.textSecondary}; } }
    }
    
    .config {
       display: flex;
       flex-direction: column;
       gap: 16px;
       margin-bottom: 32px;
       
       .item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 1px solid ${props => props.theme.border};
          border-radius: 20px;
          cursor: pointer;
          
          svg:first-child { color: ${props => props.theme.primary}; }
          
          div {
             flex: 1;
             label { display: block; font-size: 0.75rem; font-weight: 800; color: ${props => props.theme.textTertiary}; }
             span { font-weight: 700; }
          }
       }
    }
    
    .book-btn {
       width: 100%;
       background: ${props => props.theme.primary};
       color: #fff;
       border: none;
       padding: 20px;
       border-radius: 20px;
       font-size: 1.25rem;
       font-weight: 800;
       cursor: pointer;
       margin-bottom: 20px;
    }
    
    .trust {
       display: flex;
       align-items: center;
       justify-content: center;
       gap: 8px;
       font-size: 0.85rem;
       color: ${props => props.theme.textSecondary};
       font-weight: 600;
       svg { color: #10B981; }
    }
`;

const InquiryCard = styled.div`
    margin-top: 24px;
    background: ${props => props.theme.backgroundTertiary};
    border-radius: 24px;
    padding: 24px;
    display: flex;
    gap: 16px;
    align-items: center;
    cursor: pointer;
    h4 { font-weight: 800; margin-bottom: 4px; }
    p { font-size: 0.85rem; color: ${props => props.theme.textSecondary}; line-height: 1.4; }
    svg { color: ${props => props.theme.primary}; }
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
