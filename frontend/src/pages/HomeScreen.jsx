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
    description: 'Smart routes, flexible fares, and quick comparisons',
    color: '#2563eb'
  },
  {
    icon: IoBed,
    title: 'Hotels',
    description: 'Comfort-first stays near the places you actually visit',
    color: '#f97316'
  },
  {
    icon: IoGift,
    title: 'Packages',
    description: 'Curated escapes with flights, stays, and plans bundled',
    color: '#14b8a6'
  }
];

const heroStats = [
  { value: '2M+', label: 'happy travelers' },
  { value: '120+', label: 'destinations' },
  { value: '4.8', label: 'average rating' }
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
            <HeroBadgeText theme={theme}>Trusted by modern Indian travelers</HeroBadgeText>
          </HeroBadge>
          <HeroTitle>Plan your next escape without the travel chaos</HeroTitle>
          <HeroSubtitle theme={theme}>
            Compare flights, hotels, and curated packages in one polished place, with better deals and a calmer booking flow.
          </HeroSubtitle>
          <HeroActions>
            <HeroButton theme={theme} onClick={() => {
              const defaultParams = {
                type: 'flights',
                from: 'Mumbai',
                to: 'Delhi',
                departDate: new Date().toISOString().split('T')[0],
                returnDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
                passengers: 1
              };
              navigate(`/search?type=flights&from=${defaultParams.from}&to=${defaultParams.to}&departDate=${defaultParams.departDate}`, { state: defaultParams });
            }}>
              <HeroButtonText>Start exploring</HeroButtonText>
              <IoArrowForwardCircle size={20} color="#fff" />
            </HeroButton>
            <HeroGhostButton onClick={() => navigate('/search?type=packages&destination=Goa', { state: { type: 'packages', destination: 'Goa' } })}>
              View packages
            </HeroGhostButton>
          </HeroActions>
          <HeroStats>
            {heroStats.map((stat) => (
              <HeroStat key={stat.label}>
                <HeroStatValue>{stat.value}</HeroStatValue>
                <HeroStatLabel>{stat.label}</HeroStatLabel>
              </HeroStat>
            ))}
          </HeroStats>
        </HeroContent>
      </HeroContainer>

      {/* Search Bar - Positioned over Hero/Content junction */}
      <SearchBarContainer>
        <SearchBar />
      </SearchBarContainer>

      {/* Features Section */}
      <Section>
        <SectionEyebrow theme={theme}>Why TravelEase</SectionEyebrow>
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
          <SectionEyebrow theme={theme}>Book your way</SectionEyebrow>
          <SectionTitle theme={theme}>What We Offer</SectionTitle>
          <SectionSubtitle theme={theme}>Everything you need for your perfect trip</SectionSubtitle>
        </SectionHeader>

        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              theme={theme}
              onClick={() => {
                const type = service.title.toLowerCase();
                const destination = service.title === 'Packages' ? 'Goa' : '';
                navigate(`/search?type=${type}${destination ? `&destination=${destination}` : ''}`, {
                  state: { type, destination: destination || undefined }
                });
              }}
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
          <SectionEyebrow theme={theme}>Trending now</SectionEyebrow>
          <SectionTitle theme={theme} style={{ color: theme.text }}>Popular Destinations</SectionTitle>
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
  background:
    linear-gradient(180deg, ${props => props.theme.background || '#f8fafc'} 0%, ${props => props.theme.card || '#ffffff'} 42%, ${props => props.theme.backgroundSecondary || '#f1f5f9'} 100%);
  color: ${props => props.theme.text || '#111827'};
  overflow-x: hidden;
`;

const HeroContainer = styled.div`
  min-height: 620px;
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #0f172a;

  @media (max-width: 760px) {
    min-height: 680px;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  min-height: inherit;
  object-fit: cover;
  object-position: center;
  display: block;
  transform: scale(1.03);
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(8, 13, 27, 0.88) 0%, rgba(8, 13, 27, 0.62) 42%, rgba(8, 13, 27, 0.24) 100%),
    linear-gradient(180deg, rgba(8, 13, 27, 0.2) 0%, rgba(8, 13, 27, 0.78) 100%);
  z-index: 2;
`;

const HeroContent = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  padding: 88px 24px 140px;

  @media (max-width: 760px) {
    justify-content: flex-start;
    padding: 84px 18px 180px;
    max-width: 100vw;
    overflow: hidden;
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.94);
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.28);
  margin-bottom: 22px;
`;

const HeroBadgeText = styled.span`
  color: #312e81;
  font-size: 13px;
  font-weight: 800;
`;

const HeroTitle = styled.h1`
  width: min(100%, 760px);
  color: #ffffff;
  font-size: 64px;
  line-height: 1.02;
  font-weight: 800;
  letter-spacing: 0;
  text-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
  margin: 0 0 20px;
  overflow-wrap: anywhere;

  @media (max-width: 900px) {
    font-size: 48px;
    max-width: 680px;
  }

  @media (max-width: 560px) {
    width: min(100%, 354px);
    max-width: 354px;
    font-size: 29px;
    line-height: 1.08;
  }
`;

const HeroHighlight = styled.span`
  color: #fbbf24;
`;

const HeroSubtitle = styled.p`
  width: min(100%, 620px);
  color: rgba(255, 255, 255, 0.86);
  font-size: 18px;
  line-height: 1.7;
  margin: 0 0 30px;

  @media (max-width: 560px) {
    width: min(100%, 354px);
    max-width: 354px;
    font-size: 15px;
    line-height: 1.6;
  }
`;

const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;

  @media (max-width: 560px) {
    width: min(100%, 354px);
    max-width: 354px;
    gap: 10px;
  }
`;

const HeroButton = styled.button`
  background: linear-gradient(135deg, #f97316 0%, #facc15 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 24px;
  border-radius: 14px;
  border: 0;
  cursor: pointer;
  box-shadow: 0 22px 45px rgba(249, 115, 22, 0.34);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 28px 55px rgba(249, 115, 22, 0.44);
  }
`;

const HeroButtonText = styled.span`
  color: #111827;
  font-size: 15px;
  font-weight: 800;
`;

const HeroGhostButton = styled.button`
  min-height: 52px;
  padding: 0 22px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.36);
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  backdrop-filter: blur(14px);
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(110px, 1fr));
  gap: 12px;
  max-width: 520px;
  width: 100%;
  margin-top: 34px;

  @media (max-width: 560px) {
    display: none;
  }
`;

const HeroStat = styled.div`
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.13);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(16px);
`;

const HeroStatValue = styled.div`
  color: #ffffff;
  font-size: 22px;
  font-weight: 800;
`;

const HeroStatLabel = styled.div`
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const SearchBarContainer = styled.div`
  max-width: 980px;
  width: 100%;
  margin: -116px auto 34px;
  padding: 0 18px;
  position: relative;
  z-index: 20;

  @media (max-width: 760px) {
    margin-top: -108px;
    margin-left: 18px;
    margin-right: 18px;
    max-width: 354px;
    padding: 0;
  }
`;

const Section = styled.section`
  padding: 34px 24px;
  max-width: 1180px;
  margin: 0 auto;

  @media (max-width: 640px) {
    padding: 28px 18px;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 26px;
  text-align: center;
`;

const SectionEyebrow = styled.div`
  color: ${props => props.theme.primaryDark || '#ea580c'};
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 10px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 34px;
  line-height: 1.15;
  font-weight: 800;
  color: ${props => props.theme.text || '#111827'};
  margin-bottom: 8px;

  @media (max-width: 640px) {
    font-size: 26px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.textSecondary || '#64748b'};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.card || '#ffffff'};
  padding: 26px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border || '#e5e7eb'};
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.primary || '#f97316'};
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.13);
  }
`;

const FeatureIconContainer = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background: linear-gradient(135deg, ${props => props.theme.primary || '#f97316'}22, ${props => props.theme.accent || '#06b6d4'}22);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: ${props => props.theme.text || '#111827'};
  margin-bottom: 8px;
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textSecondary || '#64748b'};
  line-height: 1.6;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  background: ${props => props.theme.card || '#ffffff'};
  padding: 24px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border || '#e5e7eb'};
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.07);

  &:hover {
    transform: translateY(-4px);
    border-color: ${props => props.theme.primary || '#f97316'};
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
  }
`;

const ServiceIcon = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 8px;
  background: ${props => props.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 14px 28px ${props => props.bg}38;
`;

const ServiceContent = styled.div`
  flex: 1;
`;

const ServiceTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: ${props => props.theme.text || '#111827'};
  margin-bottom: 4px;
`;

const ServiceDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textSecondary || '#64748b'};
  line-height: 1.45;
`;

const DestinationsScroll = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1050px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const DestinationCard = styled.div`
  min-width: 0;
  border-radius: 8px;
  overflow: hidden;
  background: ${props => props.theme?.card || '#ffffff'};
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.1);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  border: 1px solid rgba(148, 163, 184, 0.18);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 28px 68px rgba(15, 23, 42, 0.16);
  }
`;

const DestinationImage = styled.img`
  width: 100%;
  height: 230px;
  object-fit: cover;
  display: block;
`;

const DestinationOverlay = styled.div`
  position: relative;
  height: 0;
`;

const PriceTag = styled.div`
  position: absolute;
  top: -216px;
  right: 12px;
  background: rgba(17, 24, 39, 0.82);
  padding: 7px 11px;
  border-radius: 999px;
  z-index: 10;
  backdrop-filter: blur(12px);
`;

const PriceText = styled.span`
  color: #fff;
  font-size: 13px;
  font-weight: 800;
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
  font-size: 17px;
  font-weight: 800;
  color: #111827;
`;

const DestinationDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  line-height: 1.45;
`;

const CtaSection = styled.div`
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(49, 46, 129, 0.92)),
    url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600') center/cover;
  margin: 34px auto 64px;
  padding: 46px 28px;
  border-radius: 8px;
  text-align: center;
  max-width: 1120px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.22);

  @media (max-width: 640px) {
    margin: 24px 18px 48px;
    padding: 34px 20px;
  }
`;

const CtaTitle = styled.h2`
  font-size: 34px;
  line-height: 1.15;
  font-weight: 800;
  color: #fff;
  margin-bottom: 10px;

  @media (max-width: 640px) {
    font-size: 26px;
  }
`;

const CtaSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.82);
  margin: 0 auto 24px;
  max-width: 620px;
`;

const CtaButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const CtaButton = styled.button`
  background: #ffffff;
  color: #111827;
  min-height: 48px;
  padding: 0 24px;
  border-radius: 8px;
  font-weight: 800;
  border: none;
  cursor: pointer;
  font-size: 15px;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    background: #f8fafc;
    transform: translateY(-2px);
  }
`;

const CtaButtonSecondary = styled.button`
  background-color: transparent;
  color: #fff;
  min-height: 48px;
  padding: 0 24px;
  border-radius: 8px;
  font-weight: 800;
  border: 1px solid rgba(255, 255, 255, 0.44);
  cursor: pointer;
  font-size: 15px;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    background-color: rgba(255,255,255,0.14);
    transform: translateY(-2px);
  }
`;
