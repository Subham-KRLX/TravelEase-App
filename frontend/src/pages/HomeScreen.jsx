import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane,
  Hotel,
  Map,
  ShieldCheck,
  Clock,
  Award,
  ArrowRight,
  Star,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const features = [
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Expert travel assistance whenever you need it, anywhere in the world.'
  },
  {
    icon: ShieldCheck,
    title: 'Secure Booking',
    description: 'Military-grade encryption for all your transactions and data.'
  },
  {
    icon: Award,
    title: 'Best Price Guarantee',
    description: 'Find a lower price elsewhere? We will match it, no questions asked.'
  }
];

const topDestinations = [
  {
    id: 1,
    name: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    price: '₹45,999',
    rating: 4.9,
    reviews: 1240
  },
  {
    id: 2,
    name: 'Kyoto, Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    price: '₹38,500',
    rating: 4.8,
    reviews: 980
  },
  {
    id: 3,
    name: 'Swiss Alps',
    image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=800&q=80',
    price: '₹52,000',
    rating: 5.0,
    reviews: 850
  },
  {
    id: 4,
    name: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    price: '₹22,999',
    rating: 4.7,
    reviews: 2100
  }
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <PageContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <HeroSection>
        <HeroBg>
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80" alt="Travel Backdrop" />
          <div className="overlay" />
        </HeroBg>

        <HeroContent>
          <motion.div variants={itemVariants}>
            <HeroBadge>
              <CheckCircle2 size={14} />
              Trusted by 5M+ Travelers Worldwide
            </HeroBadge>
          </motion.div>

          <motion.h1 variants={itemVariants}>
            Book flights, hotels, and<br />
            <span>travel packages easily</span>
          </motion.h1>

          <motion.p variants={itemVariants}>
            Experience the world like never before. Effortless planning,
            exclusive deals, and memories that last a lifetime.
          </motion.p>

          <motion.div variants={itemVariants}>
            <CtaGroup>
              <HeroCta onClick={() => navigate('/search')}>
                Start Exploring
                <ArrowRight size={18} />
              </HeroCta>
              {!user && (
                <SecondaryCta onClick={() => navigate('/signup')}>
                  Join the Club
                </SecondaryCta>
              )}
            </CtaGroup>
          </motion.div>
        </HeroContent>
      </HeroSection>

      {/* Floating Search Bar */}
      <SearchWrapper variants={itemVariants}>
        <div className="search-container">
          <SearchBar />
        </div>
      </SearchWrapper>

      {/* Why Choose Us */}
      <Section>
        <SectionHeader>
          <h2>The TravelEase Difference</h2>
          <p>We handle the details, you handle the discovery.</p>
        </SectionHeader>

        <FeaturesGrid>
          {features.map((f, i) => (
            <FeatureCard key={i} variants={itemVariants} whileHover={{ y: -5 }}>
              <div className="icon">
                <f.icon size={24} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>

      {/* Quick Services */}
      <BookingSection>
        <SectionHeader>
          <h2>What would you like to book?</h2>
        </SectionHeader>

        <BookingGrid>
          <BookingCard
            variants={itemVariants}
            bg="#006AFF"
            onClick={() => navigate('/search', { state: { type: 'flights' } })}
          >
            <div className="card-content">
              <Plane size={32} />
              <h3>Flights</h3>
              <p>Find the best domestic and international flight deals.</p>
            </div>
            <div className="card-image">
              <img src="https://images.unsplash.com/photo-1464037862335-6c65a52bab89?auto=format&fit=crop&w=400&q=80" alt="Flights" />
            </div>
          </BookingCard>

          <BookingCard
            variants={itemVariants}
            bg="#10B981"
            onClick={() => navigate('/search', { state: { type: 'hotels' } })}
          >
            <div className="card-content">
              <Hotel size={32} />
              <h3>Hotels</h3>
              <p>Book from over 1M+ hotels and vacation rentals.</p>
            </div>
            <div className="card-image">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80" alt="Hotels" />
            </div>
          </BookingCard>

          <BookingCard
            variants={itemVariants}
            bg="#F59E0B"
            onClick={() => navigate('/search', { state: { type: 'packages' } })}
          >
            <div className="card-content">
              <Map size={32} />
              <h3>Packages</h3>
              <p>Curated vacation packages for every budget.</p>
            </div>
            <div className="card-image">
              <img src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=400&q=80" alt="Packages" />
            </div>
          </BookingCard>
        </BookingGrid>
      </BookingSection>

      {/* Popular Destinations */}
      <Section className="destinations">
        <SectionHeader>
          <div className="flex-header">
            <div>
              <h2>Popular Destinations</h2>
              <p>Hand-picked locations for your next adventure</p>
            </div>
            <ViewAll onClick={() => navigate('/search')}>
              View All <ArrowRight size={16} />
            </ViewAll>
          </div>
        </SectionHeader>

        <DestinationsGrid>
          {topDestinations.map(dest => (
            <DestCard key={dest.id} variants={itemVariants} whileHover={{ y: -10 }}>
              <div className="img-wrapper">
                <img src={dest.image} alt={dest.name} />
                <div className="rating">
                  <Star size={14} fill="currentColor" />
                  {dest.rating} ({dest.reviews})
                </div>
              </div>
              <div className="content">
                <h3>{dest.name}</h3>
                <div className="footer">
                  <span className="price">Starting <span>{dest.price}</span></span>
                  <BookingBtn onClick={() => navigate('/search', { state: { destination: dest.name } })}>
                    Book
                  </BookingBtn>
                </div>
              </div>
            </DestCard>
          ))}
        </DestinationsGrid>
      </Section>

      {/* Newsletter */}
      <NewsletterSection variants={itemVariants}>
        <div className="nl-content">
          <h2>Get exclusive travel deals</h2>
          <p>Join 100,000+ travelers and receive the best flight & hotel deals in your inbox.</p>
          <div className="input-group">
            <input type="email" placeholder="Enter your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </NewsletterSection>
    </PageContainer>
  );
}

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  padding-bottom: 80px;
`;

const HeroSection = styled.section`
  height: 90vh;
  min-height: 600px;
  max-height: 800px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 53, 128, 0.4) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 0 24px;
  
  h1 {
    font-size: clamp(2.5rem, 8vw, 4.5rem);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 24px;
    letter-spacing: -2px;
    
    span {
      background: linear-gradient(to right, #60A5FA, #93C5FD);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  
  p {
    font-size: clamp(1rem, 3vw, 1.25rem);
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 40px;
    max-width: 600px;
    margin-inline: auto;
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CtaGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const HeroCta = styled.button`
  background: #fff;
  color: #001E4D;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const SecondaryCta = styled.button`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  color: #fff;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SearchWrapper = styled(motion.div)`
  margin-top: -60px;
  position: relative;
  z-index: 10;
  padding: 0 24px;
  
  .search-container {
    max-width: 1100px;
    margin: 0 auto;
    background: #fff;
    padding: 8px;
    border-radius: 20px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  }
`;

const Section = styled.section`
  max-width: 1280px;
  margin: 80px auto 0;
  padding: 0 24px;
  
  &.destinations {
    background: ${props => props.theme.backgroundSecondary};
    padding: 80px 24px;
    max-width: 100%;
    
    .flex-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 48px;
  
  h2 {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    font-weight: 800;
    margin-bottom: 8px;
    color: ${props => props.theme.text};
  }
  
  p {
    color: ${props => props.theme.textSecondary};
    font-size: 1.1rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
`;

const FeatureCard = styled(motion.div)`
  background: ${props => props.theme.backgroundSecondary};
  padding: 40px;
  border-radius: 24px;
  border: 1px solid ${props => props.theme.border};
  
  .icon {
    width: 48px;
    height: 48px;
    background: ${props => props.theme.primary}10;
    color: ${props => props.theme.primary};
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 12px;
  }
  
  p {
    color: ${props => props.theme.textSecondary};
    line-height: 1.6;
  }
`;

const BookingSection = styled.section`
  max-width: 1280px;
  margin: 100px auto 0;
  padding: 0 24px;
`;

const BookingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
`;

const BookingCard = styled(motion.div)`
  height: 280px;
  background: ${props => props.bg};
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  display: flex;
  
  .card-content {
    flex: 1;
    padding: 40px;
    color: #fff;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    h3 {
      font-size: 1.75rem;
      font-weight: 800;
      margin: 16px 0 8px;
    }
    
    p {
      opacity: 0.9;
      font-size: 0.95rem;
    }
  }
  
  .card-image {
    width: 150px;
    position: relative;
    pointer-events: none;
    
    img {
      position: absolute;
      top: 50%;
      right: -20px;
      transform: translateY(-50%) rotate(-5deg);
      height: 120%;
      width: auto;
      object-fit: cover;
      border-radius: 20px;
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
    }
  }
`;

const DestinationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
  margin-top: 40px;
  max-width: 1280px;
  margin-inline: auto;
`;

const DestCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.border};
  
  .img-wrapper {
    height: 240px;
    position: relative;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .rating {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(255, 255, 255, 0.9);
      padding: 4px 10px;
      border-radius: 50px;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
      color: #F59E0B;
      backdrop-filter: blur(4px);
    }
  }
  
  .content {
    padding: 24px;
    
    h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 20px;
    }
    
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .price {
        font-size: 0.9rem;
        color: ${props => props.theme.textSecondary};
        
        span {
          display: block;
          color: ${props => props.theme.text};
          font-weight: 800;
          font-size: 1.1rem;
        }
      }
    }
  }
`;

const BookingBtn = styled.button`
  background: ${props => props.theme.primary};
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ViewAll = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.primary};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  &:hover {
    gap: 12px;
  }
  transition: all 0.2s;
`;

const NewsletterSection = styled(motion.section)`
  max-width: 1200px;
  margin: 100px auto 0;
  padding: 80px 40px;
  background: #001E4D;
  border-radius: 32px;
  color: #fff;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent);
    border-radius: 50%;
  }
  
  @media (min-width: 640px) {
    margin: 32px 20px 50px;
    padding: 32px 24px;
  }
  
  @media (min-width: 1024px) {
    margin: 40px auto 60px;
    padding: 40px;
  }
`;

const CtaTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  
  @media (min-width: 640px) {
    font-size: 24px;
    margin-bottom: 12px;
  }
  
  @media (min-width: 1024px) {
    font-size: 28px;
  }
`;

const CtaSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 24px;
`;

const CtaButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  align-items: stretch;
  
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
`;

const CtaButton = styled.button`
  background-color: #fff;
  color: #1e40af;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255,255,255,0.3);
  letter-spacing: 0.3px;

  &:hover {
    background-color: #f1f5f9;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255,255,255,0.4);
  }
`;

const CtaButtonSecondary = styled.button`
  background-color: transparent;
  color: #fff;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 700;
  border: 2px solid #fff;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;

  &:hover {
    background-color: rgba(255,255,255,0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  }
`;
