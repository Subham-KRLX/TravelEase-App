import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import {
    IoAirplane,
    IoTimeOutline,
    IoCheckmarkCircle,
    IoBriefcaseOutline,
    IoBagHandleOutline,
    IoArrowBack
} from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import flightService from '../services/flightService';

const FlightDetailsScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { theme } = useTheme();

    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const response = await flightService.getFlightDetails(id);
                if (response.success) {
                    setFlight(response.flight);
                } else {
                    setError('Flight not found');
                }
            } catch (err) {
                setError('Error fetching flight details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFlight();
        }
    }, [id]);

    const handleAddToCart = () => {
        addToCart({
            ...flight,
            type: 'flight'
        });
        if (window.confirm('Flight added to cart! Go to checkout?')) {
            navigate('/checkout');
        }
    };

    if (loading) {
        return (
            <Container theme={theme}>
                <LoadingText theme={theme}>Loading flight details...</LoadingText>
            </Container>
        );
    }

    if (error || !flight) {
        return (
            <Container theme={theme}>
                <ErrorText>Error: {error || 'Flight not found'}</ErrorText>
                <BackButton theme={theme} onClick={() => navigate(-1)}>Go Back</BackButton>
            </Container>
        );
    }

    return (
        <Container theme={theme}>
            <ContentWrapper>
                <Header>
                    <BackButton theme={theme} onClick={() => navigate(-1)}>
                        <IoArrowBack size={24} />
                        Back
                    </BackButton>
                </Header>

                <MainCard theme={theme}>
                    <CardHeader>
                        <div>
                            <AirlineName theme={theme}>{flight.airline?.name || flight.airline}</AirlineName>
                            <FlightNumber theme={theme}>{flight.flightNumber}</FlightNumber>
                        </div>
                        <PriceTag theme={theme}>₹{flight.price?.economy?.toLocaleString() || flight.price?.toLocaleString()}</PriceTag>
                    </CardHeader>

                    <RouteInfo>
                        <LocationInfo>
                            <Time theme={theme}>{flight.departure?.time || flight.departTime}</Time>
                            <City theme={theme}>{flight.origin?.city || flight.origin} ({flight.origin?.code || 'BOM'})</City>
                            <DateText theme={theme}>{new Date(flight.departure?.date).toLocaleDateString()}</DateText>
                        </LocationInfo>

                        <FlightPath>
                            <Duration theme={theme}>{flight.duration}</Duration>
                            <PathLine theme={theme}>
                                <IoAirplane size={24} color={theme.primary} style={{ transform: 'rotate(90deg)' }} />
                            </PathLine>
                            <Stops theme={theme}>{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop(s)`}</Stops>
                        </FlightPath>

                        <LocationInfo>
                            <Time theme={theme}>{flight.arrival?.time || flight.arriveTime}</Time>
                            <City theme={theme}>{flight.destination?.city || flight.destination} ({flight.destination?.code || 'DEL'})</City>
                            <DateText theme={theme}>{new Date(flight.arrival?.date).toLocaleDateString()}</DateText>
                        </LocationInfo>
                    </RouteInfo>

                    <InfoGrid>
                        <InfoItem theme={theme}>
                            <IoCheckmarkCircle size={20} color="#10b981" />
                            <span>{flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop(s)`}</span>
                        </InfoItem>
                        <InfoItem theme={theme}>
                            <IoAirplane size={20} color={theme.textSecondary} />
                            <span>{flight.aircraft || 'Airbus A320'}</span>
                        </InfoItem>
                    </InfoGrid>
                </MainCard>

                <SectionCard theme={theme}>
                    <SectionTitle theme={theme}>Baggage Information</SectionTitle>
                    <BaggageGrid>
                        <BaggageItem theme={theme}>
                            <IconBox theme={theme}>
                                <IoBriefcaseOutline size={24} color={theme.primary} />
                            </IconBox>
                            <div>
                                <BaggageLabel theme={theme}>Check-in Baggage</BaggageLabel>
                                <BaggageValue theme={theme}>{flight.baggage || '15 KG'}</BaggageValue>
                            </div>
                        </BaggageItem>
                        <BaggageItem theme={theme}>
                            <IconBox theme={theme}>
                                <IoBagHandleOutline size={24} color={theme.primary} />
                            </IconBox>
                            <div>
                                <BaggageLabel theme={theme}>Cabin Baggage</BaggageLabel>
                                <BaggageValue theme={theme}>{flight.cabinBaggage || '7 KG'}</BaggageValue>
                            </div>
                        </BaggageItem>
                    </BaggageGrid>
                </SectionCard>

                <SectionCard theme={theme}>
                    <SectionTitle theme={theme}>Amenities</SectionTitle>
                    <AmenitiesGrid>
                        {(flight.amenities || ['WiFi', 'Meals', 'Entertainment']).map((amenity, index) => (
                            <AmenityItem key={index} theme={theme}>
                                <IoCheckmarkCircle size={20} color="#10b981" />
                                <span>{amenity}</span>
                            </AmenityItem>
                        ))}
                    </AmenitiesGrid>
                </SectionCard>

                <BottomBar theme={theme}>
                    <TotalPrice>
                        <Label theme={theme}>Total Price</Label>
                        <Value theme={theme}>₹{flight.price?.economy?.toLocaleString() || flight.price?.toLocaleString()}</Value>
                    </TotalPrice>
                    <BookButton theme={theme} onClick={handleAddToCart}>
                        Add to Cart
                    </BookButton>
                </BottomBar>
            </ContentWrapper>
        </Container>
    );
};

// Styled Components
const Container = styled.div`
    min-height: 100vh;
    background-color: ${props => props.theme.backgroundSecondary || '#f8fafc'};
    padding: 24px;
    padding-bottom: 100px;
`;

const ContentWrapper = styled.div`
    max-width: 800px;
    margin: 0 auto;
`;

const Header = styled.div`
    margin-bottom: 24px;
`;

const BackButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: ${props => props.theme.text};
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 8px;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${props => props.theme.card};
    }
`;

const MainCard = styled.div`
    background-color: ${props => props.theme.card};
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
`;

const AirlineName = styled.h1`
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.text};
    margin: 0 0 8px 0;
`;

const FlightNumber = styled.span`
    background-color: ${props => props.theme.backgroundSecondary};
    color: ${props => props.theme.textSecondary};
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
`;

const PriceTag = styled.div`
    font-size: 28px;
    font-weight: 800;
    color: ${props => props.theme.primary};
`;

const RouteInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
`;

const LocationInfo = styled.div`
    text-align: center;
`;

const Time = styled.div`
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme.text};
    margin-bottom: 4px;
`;

const City = styled.div`
    font-size: 16px;
    color: ${props => props.theme.textSecondary};
    font-weight: 500;
`;

const DateText = styled.div`
    font-size: 14px;
    color: ${props => props.theme.textTertiary};
    margin-top: 4px;
`;

const FlightPath = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    padding: 0 24px;
`;

const Duration = styled.span`
    font-size: 14px;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 8px;
`;

const PathLine = styled.div`
    width: 100%;
    height: 2px;
    background-color: ${props => props.theme.border || '#e2e8f0'};
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;

    &::after {
        content: '';
        width: 8px;
        height: 8px;
        background-color: ${props => props.theme.primary};
        border-radius: 50%;
        position: absolute;
        right: 0;
        top: -3px;
    }
    
    &::before {
        content: '';
        width: 8px;
        height: 8px;
        background-color: ${props => props.theme.primary};
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: -3px;
    }
`;

const Stops = styled.span`
    font-size: 14px;
    color: ${props => props.theme.textTertiary};
`;

const InfoGrid = styled.div`
    display: flex;
    gap: 24px;
    padding-top: 24px;
    border-top: 1px solid ${props => props.theme.border || '#e2e8f0'};
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${props => props.theme.text};
    font-size: 14px;
`;

const SectionCard = styled.div`
    background-color: ${props => props.theme.card};
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.text};
    margin: 0 0 20px 0;
`;

const BaggageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
`;

const BaggageItem = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const IconBox = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: ${props => props.theme.backgroundSecondary};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const BaggageLabel = styled.div`
    font-size: 14px;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 4px;
`;

const BaggageValue = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.text};
`;

const AmenitiesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
`;

const AmenityItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    color: ${props => props.theme.text};
    font-size: 14px;
`;

const BottomBar = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: ${props => props.theme.card};
    padding: 16px 24px;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px; /* Optional: limit max width on large screens */
    margin: 0 auto; /* Center if max-width used */
    width: 100%;
    z-index: 100;
`;

const TotalPrice = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.span`
    font-size: 14px;
    color: ${props => props.theme.textSecondary};
`;

const Value = styled.span`
    font-size: 24px;
    font-weight: 800;
    color: ${props => props.theme.primary};
`;

const BookButton = styled.button`
    background-color: ${props => props.theme.primary};
    color: white;
    padding: 16px 48px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${props => props.theme.secondary};
    }
`;

const LoadingText = styled.div`
    text-align: center;
    color: ${props => props.theme.textSecondary};
    margin-top: 40px;
    font-size: 18px;
`;

const ErrorText = styled.div`
    color: #ef4444;
    text-align: center;
    margin-bottom: 20px;
    font-size: 18px;
`;

export default FlightDetailsScreen;
