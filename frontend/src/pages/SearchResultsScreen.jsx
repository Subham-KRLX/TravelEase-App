import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  IoAirplane,
  IoBed,
  IoGift,
  IoTimeOutline,
  IoLocation,
  IoStar,
  IoAddCircle,
  IoArrowForward,
  IoCloudOfflineOutline,
  IoSearch
} from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import flightService from '../services/flightService';
import hotelService from '../services/hotelService';
import packageService from '../services/packageService';

export default function SearchResultsScreen() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { theme } = useTheme();

  const params = location.state || {}; // Get params from router state
  const searchType = params.type || 'flights';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        if (searchType === 'flights') {
          const origin = params.from?.trim?.() || '';
          const destination = params.to?.trim?.() || '';

          // If no origin/destination provided, explore all flights
          if (!origin || !destination) {
            console.log('🔍 Exploring all flights...');
            const response = await flightService.searchFlights({
              origin: '',
              destination: '',
              passengers: 1,
              class: 'economy'
            });
            
            console.log('📊 All flights response:', response);
            
            if (response.success && response.flights && response.flights.length > 0) {
              setResults(processFlightResults(response.flights));
              setError(null);
            } else {
              const errorMsg = 'No flights available. Please check if backend is running on http://localhost:5000';
              setError(errorMsg);
              setResults([]);
            }
          } else {
            // Regular search with specific route
            const searchParams = {
              origin: origin,
              destination: destination,
              departureDate: params.departDate?.trim?.() || '',
              returnDate: params.returnDate?.trim?.() || '',
              passengers: params.passengers || 1,
              class: 'economy'
            };

            console.log('📍 Flight search params from UI:', searchParams);

            const response = await flightService.searchFlights(searchParams);
            
            console.log('📊 Flight search response:', response);
            
            if (response.success && response.flights && response.flights.length > 0) {
              setResults(processFlightResults(response.flights));
              setError(null);
            } else {
              const errorMsg = response.error || 'No flights found for this route. Try different cities or dates.';
              setError(errorMsg);
              setResults([]);
            }
          }
        } else if (searchType === 'hotels') {
          const city = params.location?.trim?.() || '';

          // If no city provided, explore all hotels
          if (!city) {
            console.log('🔍 Exploring all hotels...');
            const response = await hotelService.searchHotels({
              city: '',
              checkIn: '',
              checkOut: '',
              guests: '1'
            });

            console.log('📊 All hotels response:', response);

            if (response.success && response.hotels && response.hotels.length > 0) {
              setResults(processHotelResults(response.hotels));
              setError(null);
            } else {
              const errorMsg = 'No hotels available. Please check if backend is running on http://localhost:5000';
              setError(errorMsg);
              setResults([]);
            }
          } else {
            const searchParams = {
              city: city,
              checkIn: params.checkIn?.trim?.() || '',
              checkOut: params.checkOut?.trim?.() || '',
              guests: params.guests || '1'
            };

            console.log('📍 Hotel search params from UI:', searchParams);

            const response = await hotelService.searchHotels(searchParams);

            console.log('📊 Hotel search response:', response);

            if (response.success && response.hotels && response.hotels.length > 0) {
              setResults(processHotelResults(response.hotels));
              setError(null);
            } else {
              const errorMsg = response.error || 'No hotels found in this city. Try a different destination.';
              setError(errorMsg);
              setResults([]);
            }
          }
        } else if (searchType === 'packages') {
          const destination = params.destination?.trim?.() || '';
          
          const searchParams = {
            destination: destination,
          };

          const response = await packageService.searchPackages(searchParams);
          if (response.success && response.packages && response.packages.length > 0) {
            setResults(processPackageResults(response.packages));
            setError(null);
          } else {
            const errorMsg = response.error || 'No packages found for this destination.';
            setError(errorMsg);
            setResults([]);
          }
        }
      } catch (error) {
        console.error('❌ Search error:', error);
        setError('Network error. Please make sure the backend server is running on http://localhost:5000');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchType, JSON.stringify(params)]);

  const processFlightResults = (flights) => {
    if (!Array.isArray(flights)) return [];
    return flights.map(flight => ({
      id: flight._id,
      type: 'flight',
      airline: flight.airline?.name || 'Unknown Airline',
      from: `${flight.origin?.city || 'Unknown'} (${flight.origin?.airportCode || 'N/A'})`,
      to: `${flight.destination?.city || 'Unknown'} (${flight.destination?.airportCode || 'N/A'})`,
      departTime: flight.departure?.time || 'N/A',
      arriveTime: flight.arrival?.time || 'N/A',
      duration: flight.duration || 'N/A',
      price: flight.price?.economy || 0,
      stops: flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop(s)`,
      availableSeats: flight.availableSeats?.economy || 0
    })).filter(Boolean);
  };

  const processHotelResults = (hotels) => {
    if (!Array.isArray(hotels)) return [];
    return hotels.map(hotel => ({
      id: hotel._id,
      type: 'hotel',
      name: hotel.name || 'Unknown Hotel',
      location: `${hotel.location?.city || 'Unknown'}, ${hotel.location?.country || 'Unknown'}`,
      rating: hotel.rating?.average || 0,
      reviews: hotel.rating?.count || 0,
      price: hotel.pricePerNight || 0,
      image: hotel.images?.length > 0 ? hotel.images[0].url : 'https://via.placeholder.com/800x600',
      description: hotel.description || 'No description available'
    })).filter(Boolean);
  };

  const processPackageResults = (packages) => {
    if (!Array.isArray(packages)) return [];
    return packages.map(pkg => ({
      id: pkg._id,
      type: 'package',
      name: pkg.name,
      destination: pkg.destination,
      duration: pkg.duration,
      includes: pkg.includes || [],
      price: pkg.price,
      image: pkg.image,
      description: pkg.description,
      rating: pkg.rating
    }));
  };

  const handleAddToCart = (item, e) => {
    e.stopPropagation();
    addToCart(item);
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <LoadingContainer theme={theme}>
        <Spinner theme={theme} />
        <LoadingText theme={theme}>Searching for best deals...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error || results.length === 0) {
    return (
      <Container theme={theme}>
        <ResultsHeader theme={theme}>
          <ResultsTitle theme={theme}>{error ? 'Search Error' : `No ${searchType} found`}</ResultsTitle>
        </ResultsHeader>
        <EmptyContainer>
          {error ? (
            <IoCloudOfflineOutline size={64} color={theme.danger} />
          ) : (
            <IoSearch size={64} color={theme.textSecondary} />
          )}
          <EmptyText theme={theme}>{error || `No results found for your search`}</EmptyText>
          <EmptySubtext theme={theme}>
            {error && error.toLowerCase().includes('backend')
              ? "💡 Make sure MongoDB is running and the backend server is started on http://localhost:5000"
              : error
              ? "Please use the search form to select valid origin, destination, or city."
              : !error
              ? "Try adjusting your filters or searching for different dates."
              : "Try again with different search criteria."}
          </EmptySubtext>
          <RetryButton theme={theme} onClick={() => navigate('/')}>
            ← Back to Home
          </RetryButton>
        </EmptyContainer>
      </Container>
    );
  }

  return (
    <Container theme={theme}>
      <ResultsHeader theme={theme}>
        <ResultsTitle theme={theme}>{results.length} {searchType} found</ResultsTitle>
      </ResultsHeader>

      <ResultsGrid>
        {results.map(result => {
          if (result.type === 'flight') return (
            <Card key={result.id} theme={theme} onClick={() => navigate(`/flight-details/${result.id}`)}>
              <CardHeader>
                <Airline theme={theme}>{result.airline}</Airline>
                <Price theme={theme}>₹{result.price.toLocaleString()}</Price>
              </CardHeader>

              <FlightInfo>
                <FlightRoute>
                  <RoutePoint>
                    <Time theme={theme}>{result.departTime}</Time>
                    <LocationText theme={theme}>{result.from}</LocationText>
                  </RoutePoint>

                  <DurationContainer>
                    <DurationText theme={theme}>{result.duration}</DurationText>
                    <FlightLine>
                      <Line theme={theme} />
                      <IoAirplane size={16} color={theme.textSecondary} />
                      <Line theme={theme} />
                    </FlightLine>
                    <StopsText>{result.stops}</StopsText>
                  </DurationContainer>

                  <RoutePoint>
                    <Time theme={theme}>{result.arriveTime}</Time>
                    <LocationText theme={theme}>{result.to}</LocationText>
                  </RoutePoint>
                </FlightRoute>
              </FlightInfo>

              <CardActions>
                <AddButton theme={theme} onClick={(e) => handleAddToCart(result, e)}>
                  <IoAddCircle size={20} color={theme.primary} />
                  <span>Add to Cart</span>
                </AddButton>
                <DetailsButton theme={theme} onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/flight-details/${result.id}`);
                }}>
                  <span>View Details</span>
                  <IoArrowForward size={16} />
                </DetailsButton>
              </CardActions>
            </Card>
          );

          if (result.type === 'hotel' || result.type === 'package') return (
            <Card key={result.id} theme={theme} onClick={() => navigate(`/${result.type}-details/${result.id}`)}>
              <CardImage src={result.image} alt={result.name} />
              <CardContent>
                <CardHeader>
                  <CardTitle theme={theme}>{result.name}</CardTitle>
                  <Price theme={theme}>₹{result.price.toLocaleString()}</Price>
                </CardHeader>

                <LocationRow>
                  <IoLocation size={14} color={theme.textSecondary} />
                  <LocationTextSm theme={theme}>{result.location || result.destination}</LocationTextSm>
                </LocationRow>

                {result.type === 'package' && (
                  <DurationRow>
                    <IoTimeOutline size={14} color={theme.textSecondary} />
                    <LocationTextSm theme={theme} style={{ marginLeft: 4 }}>{result.duration}</LocationTextSm>
                  </DurationRow>
                )}

                <RatingRow>
                  <IoStar size={16} color={theme.gold || '#eab308'} />
                  <RatingText theme={theme}>{result.rating}</RatingText>
                  {result.reviews && <ReviewsText theme={theme}>({result.reviews} reviews)</ReviewsText>}
                </RatingRow>

                <Description theme={theme}>{result.description}</Description>

                {result.includes && (
                  <IncludesContainer>
                    {result.includes.slice(0, 3).map((item, idx) => (
                      <IncludeBadge key={idx} theme={theme}>{item}</IncludeBadge>
                    ))}
                  </IncludesContainer>
                )}

                <CardActions>
                  <AddButton theme={theme} onClick={(e) => handleAddToCart(result, e)}>
                    <IoAddCircle size={20} color={theme.primary} />
                    <span>Add to Cart</span>
                  </AddButton>
                  <DetailsButton theme={theme} onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/${result.type}-details/${result.id}`);
                  }}>
                    <span>View Details</span>
                    <IoArrowForward size={16} />
                  </DetailsButton>
                </CardActions>
              </CardContent>
            </Card>
          );

          return null;
        })}
      </ResultsGrid>
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.background || '#f8fafc'};
  padding-bottom: 40px;
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.background || '#f8fafc'};
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.borderLight || '#e2e8f0'};
  border-top-color: ${props => props.theme.primary || '#1e40af'};
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 16px;
  color: ${props => props.theme.textSecondary};
  font-size: 16px;
`;

const ResultsHeader = styled.div`
  padding: 24px;
  background-color: ${props => props.theme.card || '#fff'};
  border-bottom: 1px solid ${props => props.theme.border || '#e2e8f0'};
  margin-bottom: 24px;
`;

const ResultsTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.text || '#1e293b'};
  max-width: 1200px;
  margin: 0 auto;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

const EmptyText = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-top: 16px;
  color: ${props => props.theme.text};
`;

const EmptySubtext = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  margin-top: 8px;
  max-width: 400px;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

const Card = styled.div`
  background-color: ${props => props.theme.card || '#fff'};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border || '#e2e8f0'};
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: ${props => props.noPadding ? '0' : '16px 16px 0 16px'};
`;

const Airline = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const Price = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.primary};
`;

const FlightInfo = styled.div`
  padding: 0 16px;
  margin-bottom: 16px;
`;

const FlightRoute = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RoutePoint = styled.div`
  display: flex;
  flex-direction: column;
`;

const Time = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const LocationText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  margin-top: 4px;
`;

const DurationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 0 16px;
`;

const DurationText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 4px;
`;

const FlightLine = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
`;

const Line = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${props => props.theme.border};
`;

const StopsText = styled.span`
  font-size: 12px;
  color: #16a34a;
  margin-top: 4px;
`;

const CardActions = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid ${props => props.theme.border || '#e2e8f0'};
  margin-top: auto;
`;

const AddButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.primary};
  background: transparent;
  color: ${props => props.theme.primary};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.backgroundSecondary || '#eff6ff'};
  }
`;

const DetailsButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background-color: ${props => props.theme.primary};
  color: white;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text};
  flex: 1;
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DurationRow = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const LocationTextSm = styled.span`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`;

const RatingText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const ReviewsText = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
`;

const Description = styled.p`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const IncludesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const IncludeBadge = styled.span`
  background-color: ${props => props.theme.backgroundSecondary || '#f1f5f9'};
  color: ${props => props.theme.textSecondary};
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
`;

const RetryButton = styled.button`
  margin-top: 24px;
  padding: 12px 24px;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;
