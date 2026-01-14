import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  Hotel,
  Package,
  Settings,
  LogOut,
  User,
  ChevronRight,
  Clock,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import bookingService from '../services/bookingService';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const result = await bookingService.getUserBookings();
      if (result.success) {
        setBookings(result.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container>
      <Sidebar>
        <div className="logo-section">
          <Plane size={24} />
          <span>TravelEase</span>
        </div>
        <nav>
          <NavBtn $active><User size={18} /> Profile Overview</NavBtn>
          <NavBtn><Calendar size={18} /> My Bookings</NavBtn>
          <NavBtn><CreditCard size={18} /> Payments</NavBtn>
          <NavBtn><Settings size={18} /> Settings</NavBtn>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </Sidebar>

      <MainContent>
        <header>
          <div className="welcome">
            <h1>Hi, {user?.name || 'Explorer'}! 👋</h1>
            <p>Welcome back! You have {bookings.length} upcoming trips.</p>
          </div>
          <div className="avatar">
            {user?.name?.[0] || 'U'}
          </div>
        </header>

        <StatsGrid>
          <StatCard>
            <div className="icon" style={{ background: '#E0E7FF', color: '#4338CA' }}><Plane size={20} /></div>
            <div className="data">
              <span>Flights</span>
              <h3>{bookings.filter(b => b.type === 'flight').length || 0}</h3>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon" style={{ background: '#FEF3C7', color: '#D97706' }}><Hotel size={20} /></div>
            <div className="data">
              <span>Hotels</span>
              <h3>{bookings.filter(b => b.type === 'hotel').length || 0}</h3>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon" style={{ background: '#D1FAE5', color: '#059669' }}><ShieldCheck size={20} /></div>
            <div className="data">
              <span>TravelPoints</span>
              <h3>2,450</h3>
            </div>
          </StatCard>
        </StatsGrid>

        <Section>
          <div className="section-header">
            <h2>Internal Trips & Bookings</h2>
            <button onClick={() => navigate('/')}>Book New</button>
          </div>

          {loading ? (
            <div className="loading">Loading your adventures...</div>
          ) : bookings.length > 0 ? (
            <BookingsList>
              {bookings.map((booking) => (
                <BookingItem key={booking._id}>
                  <div className="type-icon">
                    {booking.type === 'flight' ? <Plane size={20} /> : booking.type === 'hotel' ? <Hotel size={20} /> : <Package size={20} />}
                  </div>
                  <div className="info">
                    <h4>{booking.itemName || 'Trip to Paradise'}</h4>
                    <div className="meta">
                      <span><Calendar size={14} /> {new Date(booking.bookingDate || Date.now()).toLocaleDateString()}</span>
                      <span><MapPin size={14} /> International</span>
                    </div>
                  </div>
                  <div className="status">
                    <div className="badge success"><CheckCircle2 size={12} /> Confirmed</div>
                    <span className="price">₹{booking.totalAmount?.toLocaleString()}</span>
                  </div>
                  <button className="details-btn">
                    Manage <ChevronRight size={16} />
                  </button>
                </BookingItem>
              ))}
            </BookingsList>
          ) : (
            <EmptyBookings>
              <div className="icon"><Clock size={48} /></div>
              <h3>No upcoming trips found</h3>
              <p>Adventure is waiting for you! Start exploring destinations now.</p>
              <button onClick={() => navigate('/')}>Plan a Trip</button>
            </EmptyBookings>
          )}
        </Section>
      </MainContent>
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background: #F8FAFC;
`;

const Sidebar = styled.div`
    width: 280px;
    background: #fff;
    border-right: 1px solid ${props => props.theme.border};
    padding: 32px;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 72px;
    height: calc(100vh - 72px);

    .logo-section {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 800;
        font-size: 1.25rem;
        color: ${props => props.theme.primary};
        margin-bottom: 48px;
    }

    nav {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .logout-btn {
        margin-top: auto;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: none;
        background: transparent;
        color: ${props => props.theme.danger};
        font-weight: 600;
        cursor: pointer;
        opacity: 0.8;
        &:hover { opacity: 1; background: ${props => props.theme.danger}05; border-radius: 12px; }
    }
`;

const NavBtn = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    border: none;
    background: ${props => props.$active ? props.theme.primary + '15' : 'transparent'};
    color: ${props => props.$active ? props.theme.primary : props.theme.textSecondary};
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    
    &:hover {
        background: ${props => props.$active ? props.theme.primary + '15' : props.theme.backgroundTertiary};
    }
`;

const MainContent = styled.div`
    flex: 1;
    padding: 48px;
    max-width: 1000px;
    margin: 0 auto;

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 48px;
        
        h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 8px; }
        p { color: ${props => props.theme.textSecondary}; font-weight: 500; }
        
        .avatar {
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.primaryDark});
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 800;
            box-shadow: 0 4px 12px ${props => props.theme.primary}40;
        }
    }
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 48px;
`;

const StatCard = styled.div`
    background: #fff;
    padding: 24px;
    border-radius: 20px;
    border: 1px solid ${props => props.theme.border};
    display: flex;
    align-items: center;
    gap: 16px;
    
    .icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .data {
        span { font-size: 0.8rem; font-weight: 700; color: ${props => props.theme.textTertiary}; text-transform: uppercase; }
        h3 { font-size: 1.5rem; font-weight: 800; margin-top: 2px; }
    }
`;

const Section = styled.div`
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        h2 { font-size: 1.5rem; font-weight: 800; }
        button { background: transparent; color: ${props => props.theme.primary}; border: none; font-weight: 700; cursor: pointer; }
    }
`;

const BookingsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const BookingItem = styled.div`
    background: #fff;
    padding: 24px;
    border-radius: 20px;
    border: 1px solid ${props => props.theme.border};
    display: flex;
    align-items: center;
    gap: 24px;
    transition: all 0.2s;
    
    &:hover { border-color: ${props => props.theme.primary}; transform: translateY(-2px); }
    
    .type-icon {
        width: 48px;
        height: 48px;
        background: ${props => props.theme.backgroundTertiary};
        color: ${props => props.theme.primary};
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .info {
        flex: 1;
        h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
        .meta {
            display: flex;
            gap: 16px;
            font-size: 0.85rem;
            color: ${props => props.theme.textSecondary};
            font-weight: 500;
            span { display: flex; align-items: center; gap: 4px; }
        }
    }
    
    .status {
        text-align: right;
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 700;
            margin-bottom: 4px;
            &.success { background: #10B98115; color: #10B981; }
        }
        .price { display: block; font-weight: 800; font-size: 1.1rem; }
    }
    
    .details-btn {
        background: transparent;
        border: 1px solid ${props => props.theme.border};
        padding: 8px 16px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        &:hover { background: ${props => props.theme.backgroundTertiary}; }
    }
`;

const EmptyBookings = styled.div`
    background: #fff;
    padding: 60px;
    border-radius: 24px;
    border: 2px dashed ${props => props.theme.border};
    text-align: center;
    
    .icon { color: ${props => props.theme.textTertiary}; margin-bottom: 24px; }
    h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 8px; }
    p { color: ${props => props.theme.textSecondary}; font-weight: 500; margin-bottom: 24px; }
    button {
        background: ${props => props.theme.primary};
        color: #fff;
        border: none;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 700;
        cursor: pointer;
    }
`;
