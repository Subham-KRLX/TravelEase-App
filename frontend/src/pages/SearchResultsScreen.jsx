import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane,
  Hotel,
  Package,
  Clock,
  MapPin,
  Star,
  ArrowRight,
  Filter,
  ArrowUpDown,
  Info,
  ChevronRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import flightService from '../services/flightService';
import hotelService from '../services/hotelService';
import packageService from '../services/packageService';

export default function SearchResultsScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(location.state?.type || 'flights');

  useEffect(() => {
    fetchResults();
  }, [location.state]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      let data = [];
      if (type === 'flights') {
        data = await flightService.searchFlights(location.state);
      } else if (type === 'hotels') {
        data = await hotelService.searchHotels(location.state);
      } else {
        data = await packageService.searchPackages(location.state);
      }
      setResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFlightCard = (flight) => (
    <ResultCard
      key={flight._id}
      whileHover={{ y: -4 }}
      layout
    >
      <div className="card-header">
        <div className="airline-info">
          <div className="airline-logo">
            {flight.airline?.[0] || 'A'}
          </div>
          <div>
            <h3>{flight.airline || 'SkyHigh Airways'}</h3>
            <span className="flight-num">Flight {flight.flightNumber || 'AI-101'}</span>
          </div>
        </div>
        <div className="price-tag">
          ₹{flight.price?.toLocaleString()}
        </div>
      </div>

      <div className="flight-route">
        <div className="point">
          <time>{flight.departureTime || '10:00'}</time>
          <span className="city">{flight.from || 'BOM'}</span>
        </div>

        <div className="duration">
          <span>{flight.duration || '2h 15m'}</span>
          <div className="line">
            <div className="dot" />
            <Plane size={14} />
            <div className="dot" />
          </div>
          <span className="stops">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}</span>
        </div>

        <div className="point align-right">
          <time>{flight.arrivalTime || '12:15'}</time>
          <span className="city">{flight.to || 'DEL'}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="features">
          <span><CheckCircle2 size={14} /> Free Meals</span>
          <span><CheckCircle2 size={14} /> WiFi</span>
        </div>
        <button onClick={() => navigate(`/flight-details/${flight._id}`)}>
          Details <ChevronRight size={16} />
        </button>
      </div>
    </ResultCard>
  );

  const renderHotelCard = (hotel) => (
    <ResultCard
      key={hotel._id}
      className="hotel-card"
      whileHover={{ y: -4 }}
      layout
    >
      <div className="hotel-thumb">
        <img src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'} alt={hotel.name} />
        {hotel.rating && (
          <div className="badge">
            <Star size={12} fill="currentColor" /> {hotel.rating}
          </div>
        )}
      </div>
      <div className="hotel-content">
        <div className="header">
          <div>
            <h3>{hotel.name}</h3>
            <div className="location">
              <MapPin size={14} /> {hotel.location}
            </div>
          </div>
          <div className="price">
            ₹{hotel.price?.toLocaleString()}
            <span>/night</span>
          </div>
        </div>
        <p className="description">{hotel.description?.substring(0, 100)}...</p>
        <div className="card-footer">
          <div className="amenities">
            {hotel.amenities?.slice(0, 3).map((a, i) => (
              <span key={i}>{a}</span>
            ))}
          </div>
          <button onClick={() => navigate(`/hotel-details/${hotel._id}`)}>
            View Deal
          </button>
        </div>
      </div>
    </ResultCard>
  );

  const renderPackageCard = (pkg) => (
    <ResultCard
      key={pkg._id}
      className="package-card"
      whileHover={{ y: -4 }}
      layout
    >
      <div className="package-thumb">
        <img src={pkg.image || 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400'} alt={pkg.title} />
      </div>
      <div className="package-content">
        <div className="duration">
          <Clock size={14} /> {pkg.duration || '5 Days, 4 Nights'}
        </div>
        <h3>{pkg.title}</h3>
        <div className="price-section">
          <div className="price">
            ₹{pkg.price?.toLocaleString()}
            <span>per person</span>
          </div>
          <button onClick={() => navigate(`/package-details/${pkg._id}`)}>
            View Details
          </button>
        </div>
      </div>
    </ResultCard>
  );

  return (
    <Container>
      <TopBar>
        <div className="content">
          <h1>{type.charAt(0).toUpperCase() + type.slice(1)} in {location.state?.to || location.state?.location || 'India'}</h1>
          <div className="controls">
            <ControlBtn>
              <Filter size={18} /> Filters
            </ControlBtn>
            <ControlBtn>
              <ArrowUpDown size={18} /> Sort by Price
            </ControlBtn>
          </div>
        </div>
      </TopBar>

      <MainLayout>
        <FiltersSidebar>
          <div className="search-summary">
            <h4>Your Search</h4>
            <div className="item">
              <MapPin size={16} />
              <span>{location.state?.from || 'Anywhere'} → {location.state?.to || 'Everywhere'}</span>
            </div>
            <div className="item">
              <Calendar size={16} />
              <span>{location.state?.departDate ? new Date(location.state.departDate).toLocaleDateString() : 'Dates flexible'}</span>
            </div>
          </div>

          <FilterGroup>
            <h4>Price Range</h4>
            <input type="range" min="0" max="100000" />
          </FilterGroup>

          <FilterGroup>
            <h4>Airlines / Brands</h4>
            <label><input type="checkbox" /> Indigo</label>
            <label><input type="checkbox" /> Air India</label>
            <label><input type="checkbox" /> Spicejet</label>
          </FilterGroup>
        </FiltersSidebar>

        <ResultsList>
          {loading ? (
            <LoadingState>
              <div className="spinner" />
              <p>Searching for the best deals...</p>
            </LoadingState>
          ) : results.length > 0 ? (
            <AnimatePresence>
              <Grid>
                {results.map(item => {
                  if (type === 'flights') return renderFlightCard(item);
                  if (type === 'hotels') return renderHotelCard(item);
                  return renderPackageCard(item);
                })}
              </Grid>
            </AnimatePresence>
          ) : (
            <EmptyState>
              <Info size={48} />
              <h3>No results found</h3>
              <p>Try adjusting your filters or searching for different dates.</p>
              <button onClick={() => navigate('/')}>Return to Home</button>
            </EmptyState>
          )}
        </ResultsList>
      </MainLayout>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
`;

const TopBar = styled.div`
  background: #fff;
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 24px 0;
  position: sticky;
  top: 72px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  
  .content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h1 {
      font-size: 1.5rem;
      font-weight: 800;
      color: ${props => props.theme.text};
    }
    
    .controls {
      display: flex;
      gap: 12px;
    }
  }
`;

const ControlBtn = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.backgroundTertiary};
  }
`;

const MainLayout = styled.div`
  max-width: 1280px;
  margin: 32px auto;
  padding: 0 24px;
  display: flex;
  gap: 32px;
`;

const FiltersSidebar = styled.div`
  width: 280px;
  flex-shrink: 0;
  display: none;
  
  @media (min-width: 1024px) {
    display: block;
  }
  
  .search-summary {
    background: ${props => props.theme.primary}10;
    padding: 20px;
    border-radius: 16px;
    margin-bottom: 24px;
    
    h4 {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      color: ${props => props.theme.primary};
    }
    
    .item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      color: ${props => props.theme.text};
    }
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 32px;
  
  h4 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 16px;
  }
  
  label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    margin-bottom: 10px;
    cursor: pointer;
    color: ${props => props.theme.textSecondary};
    
    input {
      width: 18px;
      height: 18px;
    }
  }
  
  input[type="range"] {
    width: 100%;
  }
`;

const ResultsList = styled.div`
  flex: 1;
`;

const Grid = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ResultCard = styled(motion.div)`
  background: #fff;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.border};
  padding: 24px;
  box-shadow: ${props => props.theme.shadows.sm};
  
  .card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    
    .airline-info {
      display: flex;
      gap: 16px;
      align-items: center;
      
      .airline-logo {
        width: 48px;
        height: 48px;
        background: ${props => props.theme.backgroundTertiary};
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        color: ${props => props.theme.primary};
      }
      
      h3 {
        font-size: 1.1rem;
        font-weight: 700;
      }
      
      .flight-num {
        font-size: 0.85rem;
        color: ${props => props.theme.textSecondary};
      }
    }
    
    .price-tag {
      font-size: 1.5rem;
      font-weight: 800;
      color: ${props => props.theme.primary};
    }
  }
  
  .flight-route {
    display: flex;
    align-items: center;
    gap: 32px;
    margin-bottom: 24px;
    
    .point {
      flex: 1;
      
      time {
        display: block;
        font-size: 1.5rem;
        font-weight: 800;
      }
      
      .city {
        color: ${props => props.theme.textSecondary};
        font-weight: 600;
      }
      
      &.align-right {
        text-align: right;
      }
    }
    
    .duration {
      text-align: center;
      min-width: 120px;
      
      span {
        font-size: 0.85rem;
        font-weight: 600;
        color: ${props => props.theme.textTertiary};
      }
      
      .line {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px 0;
        
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: 2px solid ${props => props.theme.border};
        }
        
        svg {
          color: ${props => props.theme.border};
        }
        
        &::before, &::after {
          content: '';
          height: 2px;
          background: ${props => props.theme.border};
          flex: 1;
        }
      }
      
      .stops {
        color: #10B981;
      }
    }
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid ${props => props.theme.border};
    
    .features {
      display: flex;
      gap: 16px;
      
      span {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.85rem;
        color: ${props => props.theme.textSecondary};
        font-weight: 500;
        
        svg {
          color: #10B981;
        }
      }
    }
    
    button {
      background: ${props => props.theme.primary};
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 50px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
  }
  
  &.hotel-card {
    display: flex;
    gap: 24px;
    padding: 0;
    overflow: hidden;
    
    .hotel-thumb {
      width: 240px;
      position: relative;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .badge {
        position: absolute;
        top: 16px;
        left: 16px;
        background: #fff;
        padding: 4px 10px;
        border-radius: 50px;
        font-weight: 800;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 4px;
        color: #F59E0B;
      }
    }
    
    .hotel-content {
      flex: 1;
      padding: 24px;
      display: flex;
      flex-direction: column;
      
      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        
        h3 {
          font-size: 1.25rem;
          font-weight: 800;
        }
        
        .location {
          display: flex;
          align-items: center;
          gap: 4px;
          color: ${props => props.theme.textSecondary};
          font-size: 0.9rem;
          margin-top: 4px;
        }
        
        .price {
          text-align: right;
          font-size: 1.5rem;
          font-weight: 800;
          color: ${props => props.theme.primary};
          
          span {
            display: block;
            font-size: 0.85rem;
            color: ${props => props.theme.textSecondary};
            font-weight: 500;
          }
        }
      }
      
      .description {
        color: ${props => props.theme.textSecondary};
        font-size: 0.9rem;
        line-height: 1.5;
        margin-bottom: 20px;
      }
      
      .amenities {
        display: flex;
        gap: 8px;
        
        span {
          background: ${props => props.theme.backgroundTertiary};
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }
      }
    }
  }

  &.package-card {
     display: flex;
     gap: 24px;
     padding: 0;
     overflow: hidden;

     .package-thumb {
       width: 200px;
       img {
         width: 100%;
         height: 100%;
         object-fit: cover;
       }
     }

     .package-content {
       flex: 1;
       padding: 24px;
       display: flex;
       flex-direction: column;
       justify-content: center;

       .duration {
         display: flex;
         align-items: center;
         gap: 6px;
         font-weight: 700;
         color: ${props => props.theme.primary};
         font-size: 0.85rem;
         margin-bottom: 8px;
       }

       h3 {
         font-size: 1.25rem;
         font-weight: 800;
         margin-bottom: 20px;
       }

       .price-section {
         display: flex;
         justify-content: space-between;
         align-items: flex-end;

         .price {
           font-size: 1.5rem;
           font-weight: 800;
           color: ${props => props.theme.text};
           
           span {
             display: block;
             font-size: 0.85rem;
             color: ${props => props.theme.textSecondary};
             font-weight: 500;
           }
         }

         button {
           background: ${props => props.theme.primary};
           color: #fff;
           border: none;
           padding: 12px 24px;
           border-radius: 12px;
           font-weight: 700;
           cursor: pointer;
         }
       }
     }
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid ${props => props.theme.border};
    border-top-color: ${props => props.theme.primary};
    border-radius: 50%;
    animation: rotate 1s linear infinite;
    margin-bottom: 24px;
  }
  
  @keyframes rotate {
    to { transform: rotate(360deg); }
  }
  
  p {
    color: ${props => props.theme.textSecondary};
    font-weight: 600;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
  background: #fff;
  border-radius: 24px;
  border: 1px solid ${props => props.theme.border};
  
  svg {
    color: ${props => props.theme.textTertiary};
    margin-bottom: 24px;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 12px;
  }
  
  p {
    color: ${props => props.theme.textSecondary};
    margin-bottom: 32px;
    max-width: 400px;
  }
  
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
