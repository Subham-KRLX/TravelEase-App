import { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  IoAirplane,
  IoBed,
  IoGift,
  IoCalendar,
  IoCheckmarkCircle,
  IoTime,
  IoLogOutOutline,
  IoPerson,
  IoChevronForward
} from 'react-icons/io5';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [statsVisible, setStatsVisible] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simple entrance animation trigger
    setTimeout(() => setStatsVisible(true), 100);
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      if (response.data.status === 'success') {
        setBookings(response.data.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/');
    }
  };

  if (!user) {
    return (
      <Container theme={theme}>
        <EmptyState>
          <IoPerson size={64} color={theme.textTertiary} />
          <Title theme={theme}>Please Login</Title>
          <Subtitle theme={theme}>Login to view your dashboard</Subtitle>
          <PrimaryButton theme={theme} onClick={() => navigate('/login')}>
            Login Now
          </PrimaryButton>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container theme={theme}>
      <HeaderGradient theme={theme}>
        <HeaderContent>
          <ProfileSection>
            <Avatar theme={theme}>
              <IoPerson size={32} color={theme.primary} />
            </Avatar>
            <UserInfo>
              <WelcomeText>Welcome back,</WelcomeText>
              <UserName>{user.name || 'Traveler'}</UserName>
            </UserInfo>
          </ProfileSection>

          <HeaderActions>
            <IconButton onClick={handleLogout} title="Logout">
              <IoLogOutOutline size={24} color="#fff" />
            </IconButton>
          </HeaderActions>
        </HeaderContent>
      </HeaderGradient>

      <StatsContainer isVisible={statsVisible}>
        <StatCard theme={theme}>
          <IconCircle color={theme.primary}>
            <IoCalendar size={20} color="#fff" />
          </IconCircle>
          <StatValue theme={theme}>{bookings.length}</StatValue>
          <StatLabel theme={theme}>Bookings</StatLabel>
        </StatCard>

        <StatCard theme={theme}>
          <IconCircle color="#10b981">
            <IoCheckmarkCircle size={20} color="#fff" />
          </IconCircle>
          <StatValue theme={theme}>{bookings.filter(b => b.paymentStatus === 'completed').length}</StatValue>
          <StatLabel theme={theme}>Completed</StatLabel>
        </StatCard>

        <StatCard theme={theme}>
          <IconCircle color="#f59e0b">
            <IoTime size={20} color="#fff" />
          </IconCircle>
          <StatValue theme={theme}>{bookings.filter(b => b.bookingStatus === 'confirmed' && b.paymentStatus !== 'completed').length}</StatValue>
          <StatLabel theme={theme}>Upcoming</StatLabel>
        </StatCard>
      </StatsContainer>

      <ContentSection>
        <SectionHeader>
          <SectionTitle theme={theme}>My Bookings</SectionTitle>
          <SeeAllButton theme={theme} onClick={() => navigate('/search', { state: { type: 'flights' } })}>See All</SeeAllButton>
        </SectionHeader>

        <BookingsList>
          {loading ? (
            <StatLabel theme={theme}>Loading bookings...</StatLabel>
          ) : bookings.length === 0 ? (
            <StatLabel theme={theme}>No bookings found. Start exploring!</StatLabel>
          ) : bookings.map((booking) => (
            <BookingCard key={booking._id} theme={theme}>
              <BookingHeader>
                <BookingIcon theme={theme} isDarkMode={isDarkMode}>
                  {booking.bookingType === 'flight' ?
                    <IoAirplane size={24} color={theme.primary} /> :
                    <IoBed size={24} color={theme.primary} />
                  }
                </BookingIcon>
                <BookingInfo>
                  <BookingTitle theme={theme}>
                    {booking.bookingType === 'flight' ?
                      `${booking.flight?.origin?.city || 'Flight'} to ${booking.flight?.destination?.city || ''}` :
                      (booking.hotel?.name || 'Hotel Stay')}
                  </BookingTitle>
                  <BookingDate theme={theme}>
                    {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </BookingDate>
                </BookingInfo>
                <StatusBadge paymentStatus={booking.paymentStatus}>
                  {booking.paymentStatus}
                </StatusBadge>
              </BookingHeader>
              <Divider theme={theme} />
              <BookingFooter>
                <div>
                  <AmountLabel theme={theme}>Total Amount</AmountLabel>
                  <Amount theme={theme}>₹{booking.totalPrice?.toLocaleString()}</Amount>
                </div>
                <DetailsLink
                  theme={theme}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard`);
                  }}
                >
                  {booking.bookingType.toUpperCase()} {booking.bookingReference}
                </DetailsLink>
              </BookingFooter>
            </BookingCard>
          ))}
        </BookingsList>

        <SectionHeader>
          <SectionTitle theme={theme} style={{ marginTop: 32 }}>Quick Actions</SectionTitle>
        </SectionHeader>

        <QuickActionsGrid>
          <ActionCard theme={theme} onClick={() => navigate('/search', { state: { type: 'flights' } })}>
            <ActionIconWrapper isDarkMode={isDarkMode}>
              <IoAirplane size={24} color={theme.primary} />
            </ActionIconWrapper>
            <ActionContent>
              <ActionTitle theme={theme}>Book Flights</ActionTitle>
              <ActionSubtitle theme={theme}>Find best deals worldwide</ActionSubtitle>
            </ActionContent>
            <IoChevronForward color={theme.textTertiary} />
          </ActionCard>

          <ActionCard theme={theme} onClick={() => navigate('/search', { state: { type: 'hotels' } })}>
            <ActionIconWrapper isDarkMode={isDarkMode}>
              <IoBed size={24} color="#f59e0b" />
            </ActionIconWrapper>
            <ActionContent>
              <ActionTitle theme={theme}>Book Hotels</ActionTitle>
              <ActionSubtitle theme={theme}>Luxury stays for you</ActionSubtitle>
            </ActionContent>
            <IoChevronForward color={theme.textTertiary} />
          </ActionCard>
        </QuickActionsGrid>

      </ContentSection>
    </Container>
  );
};

// Animations
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.backgroundSecondary || '#f8fafc'};
  padding-bottom: 40px;
`;

const HeaderGradient = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.primary || '#1e40af'} 0%, ${props => props.theme.secondary || '#3b82f6'} 100%);
  padding: 40px 20px 80px; /* Extra padding at bottom for overlap */
  color: white;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  box-shadow: 0 4px 20px rgba(30, 64, 175, 0.2);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${props => props.theme.card};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255,255,255,0.3);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const WelcomeText = styled.span`
  font-size: 14px;
  opacity: 0.9;
  font-weight: 500;
`;

const UserName = styled.span`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const IconButton = styled.button`
  background: rgba(255,255,255,0.2);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
  }
`;

const StatsContainer = styled.div`
  max-width: 1000px;
  margin: -50px auto 0; /* Negative margin for overlap */
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  opacity: 0;
  transform: translateY(20px);
  animation: ${props => props.isVisible ? css`${slideUp} 0.6s ease-out forwards` : 'none'};
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.card};
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  box-shadow: 0 4px 10px ${props => props.color}40;
`;

const StatValue = styled.span`
  font-size: 28px;
  font-weight: 800;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const StatLabel = styled.span`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
`;

const ContentSection = styled.div`
  max-width: 1000px;
  margin: 40px auto 0;
  padding: 0 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
`;

const SeeAllButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.primary};
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BookingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BookingCard = styled.div`
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid ${props => props.theme.borderLight || 'transparent'};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.primary}30;
  }
`;

const BookingHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const BookingIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background-color: ${props => props.isDarkMode ? props.theme.backgroundSecondary : '#dbeafe'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const BookingInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BookingTitle = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const BookingDate = styled.span`
  font-size: 13px;
  color: ${props => props.theme.textSecondary};
`;

const StatusBadge = styled.span`
  background: ${props => props.paymentStatus === 'completed' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${props => props.theme.borderLight || '#e2e8f0'};
  margin-bottom: 16px;
`;

const BookingFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AmountLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textTertiary};
  margin-bottom: 2px;
`;

const Amount = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const DetailsLink = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.theme.primary};
  font-weight: 600;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const ActionCard = styled.div`
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  border: 1px solid ${props => props.theme.borderLight || '#e2e8f0'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
`;

const ActionIconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
`;

const ActionSubtitle = styled.div`
  font-size: 13px;
  color: ${props => props.theme.textSecondary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${props => props.theme.text};
  margin-top: 24px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 32px;
`;

const PrimaryButton = styled.button`
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

export default DashboardScreen;
