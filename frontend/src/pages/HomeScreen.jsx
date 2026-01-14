import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  IoCheckmarkCircle,
  IoArrowForwardCircle,
  IoTimeOutline,
  IoShieldCheckmarkOutline,
  IoTrophyOutline,
  IoAirplane,
  IoBed,
  IoGift,
  IoLocation,
  IoArrowForward
} from 'react-icons/io5';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';

// Mock Data
const features = [
  {
    icon: IoTimeOutline,
    title: '24/7 Support',
    description: 'Round-the-clock customer service for all your travel needs'
  },
  {
    icon: IoShieldCheckmarkOutline,
    title: 'Secure Booking',
    description: 'Your payments and personal data are always protected'
  },
  {
    icon: IoTrophyOutline,
    title: 'Best Prices',
    description: 'Compare prices and get the best deals on flights and hotels'
  }
];

const destinations = [
  {
    id: 1,
    name: 'Goa, India',
    image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 'From ₹8,999',
    description: 'Beautiful beaches and vibrant nightlife'
  },
  {
    id: 2,
    name: 'Kerala, India',
    image: 'https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 'From ₹12,999',
    description: "God's own country with backwaters"
  },
  {
    id: 3,
    name: 'Rajasthan, India',
    image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 'From ₹6,999',
    description: 'Royal palaces and desert landscapes'
  },
  {
    id: 4,
    name: 'Kashmir, India',
    image: 'https://images.pexels.com/photos/1670770/pexels-photo-1670770.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 'From ₹15,999',
    description: 'Paradise on earth with stunning valleys'
  }
];

const services = [
  {
    icon: IoAirplane,
    title: 'Flights',
    description: 'Find the best flight deals worldwide',
    color: '#1e40af'
  },
  {
    icon: IoBed,
    title: 'Hotels',
    description: 'Book comfortable accommodations',
    color: '#f97316'
  },
  {
    icon: IoGift,
    title: 'Packages',
    description: 'Complete vacation packages',
    color: '#16a34a'
  }
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <PageContainer theme={theme}>
      {/* Hero Section */}
      <HeroContainer>
        <HeroImage src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600" alt="Hero" />
        <HeroOverlay theme={theme} />
        <HeroContent>
          <HeroBadge>
            <IoCheckmarkCircle size={16} color={theme.primary} />
            <HeroBadgeText theme={theme}>#1 Travel App in India</HeroBadgeText>
          </HeroBadge>
          <HeroTitle>
            Explore the<br />
            <HeroHighlight theme={theme}>World 🌍</HeroHighlight>
          </HeroTitle>
          <HeroSubtitle theme={theme}>
            Book smarter, travel better with exclusive deals
          </HeroSubtitle>
          <HeroButtonGroup>
            <HeroButton theme={theme} onClick={() => {
              // Navigate with default search parameters
              const defaultParams = {
                type: 'flights',
                from: 'Mumbai',
                to: 'Delhi',
                departDate: new Date().toISOString().split('T')[0],
                returnDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
                passengers: 1
              };
              navigate('/search', { state: defaultParams });
            }}>
              <HeroButtonText>Start Exploring</HeroButtonText>
              <IoArrowForwardCircle size={20} color="#fff" />
            </HeroButton>
            <ExploreAllButton theme={theme} onClick={() => {
              // Navigate to explore all flights
              const exploreParams = {
                type: 'flights',
                exploreAll: true // Show all available flights
              };
              navigate('/search', { state: exploreParams });
            }}>
              <HeroButtonText>Explore All</HeroButtonText>
              <IoArrowForwardCircle size={20} color="#fff" />
            </ExploreAllButton>
          </HeroButtonGroup>
        </HeroContent>
      </HeroContainer>

      {/* Search Bar - Positioned over Hero/Content junction */}
      <SearchBarContainer>
        <SearchBar />
      </SearchBarContainer>

      {/* Features Section */}
      <Section>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index} theme={theme} onClick={() => { }}>
              <FeatureIconContainer theme={theme}>
                <feature.icon size={28} color={theme.primary} />
              </FeatureIconContainer>
              <FeatureTitle theme={theme}>{feature.title}</FeatureTitle>
              <FeatureDescription theme={theme}>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>

      {/* Services Section */}
      <Section>
        <SectionHeader>
          <SectionTitle theme={theme}>What We Offer</SectionTitle>
          <SectionSubtitle theme={theme}>Everything you need for your perfect trip</SectionSubtitle>
        </SectionHeader>

        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              theme={theme}
              onClick={() => navigate('/search', { state: { type: service.title.toLowerCase() } })}
            >
              <ServiceIcon bg={service.color}>
                <service.icon size={32} color="#fff" />
              </ServiceIcon>
              <ServiceContent>
                <ServiceTitle theme={theme}>{service.title}</ServiceTitle>
                <ServiceDescription theme={theme}>{service.description}</ServiceDescription>
              </ServiceContent>
              <IoArrowForward size={20} color={theme.textSecondary} />
            </ServiceCard>
          ))}
        </ServicesGrid>
      </Section>

      {/* Destinations Section */}
      <Section>
        <SectionHeader>
          <SectionTitle theme={theme} style={{ color: '#1e293b' }}>Popular Destinations</SectionTitle>
          <SectionSubtitle theme={theme}>Explore the world's most amazing places</SectionSubtitle>
        </SectionHeader>

        <DestinationsScroll>
          {destinations.map(destination => (
            <DestinationCard
              key={destination.id}
              onClick={() => navigate('/search', { state: { type: 'packages', destination: destination.name } })}
            >
              <DestinationImage src={destination.image} alt={destination.name} />
              <DestinationOverlay>
                <PriceTag>
                  <PriceText>{destination.price}</PriceText>
                </PriceTag>
              </DestinationOverlay>
              <DestinationContent>
                <DestinationNameContainer>
                  <IoLocation size={16} color="#1e40af" />
                  <DestinationName>{destination.name}</DestinationName>
                </DestinationNameContainer>
                <DestinationDescription>{destination.description}</DestinationDescription>
              </DestinationContent>
            </DestinationCard>
          ))}
        </DestinationsScroll>
      </Section>

      {/* CTA Section */}
      <CtaSection>
        <CtaTitle>Ready to Start Your Adventure?</CtaTitle>
        <CtaSubtitle>
          Join millions of travelers who trust TravelEase for their journeys
        </CtaSubtitle>
        <CtaButtons>
          <CtaButton onClick={() => navigate('/search')}>
            {user ? 'Search More' : 'Start Planning'}
          </CtaButton>
          {!user && (
            <CtaButtonSecondary onClick={() => navigate('/signup')}>
              Create Account
            </CtaButtonSecondary>
          )}
        </CtaButtons>
      </CtaSection>
    </PageContainer>
  );
}

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.background || '#fff'};
`;

const HeroContainer = styled.div`
  height: 320px;
  position: relative;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  
  @media (min-width: 640px) {
    height: 420px;
  }
  
  @media (min-width: 1024px) {
    height: 500px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(30, 64, 175, 0.1) 0%, transparent 50%);
    animation: float 8s ease-in-out infinite;
    z-index: 1;
  }

  @keyframes float {
    0%, 100% { transform: translate(0px, 0px); }
    50% { transform: translate(15px, -15px); }
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.isDarkMode ? 'rgba(12, 10, 9, 0.5)' : 'rgba(0, 0, 0, 0.2)'};
  backdrop-filter: blur(2px);
  z-index: 2;
`;

const HeroContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  z-index: 3;
  animation: fadeInContent 0.8s ease-out;
  
  @media (min-width: 640px) {
    padding: 24px;
  }

  @keyframes fadeInContent {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(255, 255, 255, 0.98);
  padding: 10px 18px;
  border-radius: 30px;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  animation: slideInDown 0.6s ease-out;

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroBadgeText = styled.span`
  color: ${props => props.theme.primary};
  font-size: 14px;
  font-weight: 700;
`;

const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  text-align: center;
  margin-bottom: 12px;
  text-shadow: 0 3px 20px rgba(0, 0, 0, 0.4);
  line-height: 1.2;
  animation: slideInUp 0.7s ease-out 0.1s both;
  letter-spacing: -0.5px;
  
  @media (min-width: 640px) {
    font-size: 36px;
    margin-bottom: 16px;
  }
  
  @media (min-width: 1024px) {
    font-size: 52px;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroHighlight = styled.span`
  color: #fbbf24;
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(120deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (min-width: 640px) {
    font-size: 42px;
  }
  
  @media (min-width: 1024px) {
    font-size: 56px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 14px;
  color: #f1f5f9;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  max-width: 90%;
  animation: slideInUp 0.7s ease-out 0.2s both;
  
  @media (min-width: 640px) {
    font-size: 16px;
    margin-bottom: 28px;
    max-width: 500px;
  }
  
  @media (min-width: 1024px) {
    font-size: 18px;
    margin-bottom: 32px;
    max-width: 600px;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroButton = styled.button`
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(251, 191, 36, 0.4);
  transition: all 0.3s ease;
  animation: slideInUp 0.7s ease-out 0.3s both;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: #1e40af;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(251, 191, 36, 0.6);
  }

  &:active {
    transform: translateY(-1px);
  }
  
  @media (min-width: 640px) {
    gap: 10px;
    padding: 16px 40px;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroButtonText = styled.span`
  color: #1e40af;
  font-size: 14px;
  font-weight: 700;
  
  @media (min-width: 640px) {
    font-size: 16px;
  }
`;

const SearchBarContainer = styled.div`
  max-width: 800px;
  margin: -40px auto 24px;
  padding: 0 16px;
  
  @media (min-width: 640px) {
    margin: -50px auto 32px;
  }
  
  @media (min-width: 1024px) {
    margin: -60px auto 40px;
  }
`;

const Section = styled.section`
  padding: 24px 16px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 640px) {
    padding: 32px 20px;
  }
  
  @media (min-width: 1024px) {
    padding: 40px 24px;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
  
  @media (min-width: 640px) {
    font-size: 26px;
  }
  
  @media (min-width: 1024px) {
    font-size: 28px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.textSecondary};
`;

const FeaturesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
`;

const FeatureCard = styled.div`
  flex: 1;
  min-width: 250px;
  background: linear-gradient(135deg, ${props => props.theme.card} 0%, ${props => props.theme.card}dd 100%);
  padding: 28px;
  border-radius: 20px;
  border: 2px solid ${props => props.theme.primary}25;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.primary}40;

    &::before {
      opacity: 1;
    }
  }
`;

const FeatureIconContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, ${props => props.theme.primary}25 0%, ${props => props.theme.primary}10 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: all 0.3s ease;

  ${FeatureCard}:hover & {
    background: linear-gradient(135deg, ${props => props.theme.primary}35 0%, ${props => props.theme.primary}20 100%);
    transform: scale(1.1) rotate(5deg);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  line-height: 1.5;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
`;

const ServiceCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.card} 0%, ${props => props.theme.card}dd 100%);
  padding: 24px;
  border-radius: 16px;
  border: 2px solid ${props => props.theme.border || '#e2e8f0'};
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: -100px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255,255,255,0.1), transparent);
    transition: right 0.3s ease;
  }

  &:hover {
    box-shadow: 0 12px 30px rgba(0,0,0,0.12);
    border-color: #cbd5e1;
    transform: translateY(-4px);

    &::before {
      right: 0;
    }
  }
`;

const ServiceIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, ${props => props.bg} 0%, ${props => props.bg}dd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 15px ${props => props.bg}40;
  transition: all 0.3s ease;

  ${ServiceCard}:hover & {
    transform: scale(1.15) rotate(-5deg);
    box-shadow: 0 8px 25px ${props => props.bg}60;
  }
`;

const ServiceContent = styled.div`
  flex: 1;
`;

const ServiceTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const ServiceDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
`;

const DestinationsScroll = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding-bottom: 20px; /* Space for scrollbar or shadow */
  scrollbar-width: thin;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 4px;
  }
`;

const DestinationCard = styled.div`
  min-width: 280px;
  width: 280px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  }
`;

const DestinationImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const DestinationOverlay = styled.div`
  position: relative;
  height: 0;
`;

const PriceTag = styled.div`
  position: absolute;
  top: -190px;
  right: 12px;
  background-color: #1e40af;
  padding: 6px 12px;
  border-radius: 20px;
  z-index: 10;
`;

const PriceText = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
`;

const DestinationContent = styled.div`
  padding: 16px;
`;

const DestinationNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
`;

const DestinationName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

const DestinationDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  line-height: 1.4;
`;

const CtaSection = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  margin: 24px 16px 40px;
  padding: 24px 16px;
  border-radius: 20px;
  text-align: center;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(30, 64, 175, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255,255,255,0.1), transparent);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
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

const HeroButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 16px;
  }
`;

const ExploreAllButton = styled.button`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(245, 87, 108, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(245, 87, 108, 0.6);
  }
`;
