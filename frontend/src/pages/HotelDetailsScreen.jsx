import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import {
    IoBed,
    IoLocationOutline,
    IoStar,
    IoWifi,
    IoRestaurantOutline,
    IoFitness,
    IoArrowBack,
    IoCheckmarkCircle
} from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import hotelService from '../services/hotelService';

const HotelDetailsScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { theme } = useTheme();

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await hotelService.getHotelDetails(id);
                if (response.success) {
                    setHotel(response.hotel);
                } else {
                    setError('Hotel not found');
                }
            } catch (err) {
                setError('Error fetching hotel details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchHotel();
        }
    }, [id]);

    const handleAddToCart = () => {
        addToCart({
            ...hotel,
            type: 'hotel',
            quantity: 1 // Default quantity
        });
        if (window.confirm('Hotel added to cart! Go to checkout?')) {
            navigate('/checkout');
        }
    };

    if (loading) {
        return (
            <Container theme={theme}>
                <LoadingText theme={theme}>Loading hotel details...</LoadingText>
            </Container>
        );
    }

    if (error || !hotel) {
        return (
            <Container theme={theme}>
                <ErrorText>Error: {error || 'Hotel not found'}</ErrorText>
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

                <MainCard theme={theme} hasImage={!!hotel.images?.length}>
                    {hotel.images?.length > 0 && (
                        <HeroImage src={hotel.images[0].url} alt={hotel.name} />
                    )}

                    <CardContent>
                        <CardHeader>
                            <div>
                                <HotelName theme={theme}>{hotel.name}</HotelName>
                                <LocationRow>
                                    <IoLocationOutline size={16} color={theme.textSecondary} />
                                    <LocationText theme={theme}>{hotel.location?.address}, {hotel.location?.city}</LocationText>
                                </LocationRow>
                            </div>
                            <PriceTag theme={theme}>
                                ₹{hotel.pricePerNight?.toLocaleString()}
                                <PerNight theme={theme}>/night</PerNight>
                            </PriceTag>
                        </CardHeader>

                        <RatingRow>
                            <Stars>
                                {[...Array(Math.floor(hotel.rating?.average || 0))].map((_, i) => (
                                    <IoStar key={i} size={18} color="#eab308" />
                                ))}
                            </Stars>
                            <RatingValue theme={theme}>{hotel.rating?.average}</RatingValue>
                            <ReviewsCount theme={theme}>({hotel.rating?.count} reviews)</ReviewsCount>
                        </RatingRow>

                        <Description theme={theme}>{hotel.description}</Description>

                        <SectionTitle theme={theme}>Amenities</SectionTitle>
                        <AmenitiesGrid>
                            {(hotel.amenities || ['WiFi', 'Pool', 'Gym', 'Restaurant']).map((amenity, index) => (
                                <AmenityItem key={index} theme={theme}>
                                    <AmenityIconWrapper theme={theme}>
                                        {amenity.toLowerCase().includes('wifi') ? <IoWifi /> :
                                            amenity.toLowerCase().includes('food') || amenity.toLowerCase().includes('restaurant') ? <IoRestaurantOutline /> :
                                                amenity.toLowerCase().includes('gym') || amenity.toLowerCase().includes('fitness') ? <IoFitness /> :
                                                    <IoCheckmarkCircle />}
                                    </AmenityIconWrapper>
                                    <span>{amenity}</span>
                                </AmenityItem>
                            ))}
                        </AmenitiesGrid>
                    </CardContent>
                </MainCard>

                <SectionCard theme={theme}>
                    <SectionTitle theme={theme}>Room Types</SectionTitle>
                    <RoomsList>
                        {(hotel.rooms || []).map((room, index) => (
                            <RoomItem key={index} theme={theme}>
                                <RoomInfo>
                                    <RoomType theme={theme}>{room.type}</RoomType>
                                    <RoomPrice theme={theme}>₹{room.price?.toLocaleString()}</RoomPrice>
                                </RoomInfo>
                                <SelectButton theme={theme} onClick={handleAddToCart}>Select Room</SelectButton>
                            </RoomItem>
                        ))}
                        {(!hotel.rooms || hotel.rooms.length === 0) && (
                            <RoomItem theme={theme}>
                                <RoomInfo>
                                    <RoomType theme={theme}>Standard Room</RoomType>
                                    <RoomPrice theme={theme}>₹{hotel.pricePerNight?.toLocaleString()}</RoomPrice>
                                </RoomInfo>
                                <SelectButton theme={theme} onClick={handleAddToCart}>Select Room</SelectButton>
                            </RoomItem>
                        )}
                    </RoomsList>
                </SectionCard>

            </ContentWrapper>
        </Container>
    );
};

// Styled Components
const Container = styled.div`
    min-height: 100vh;
    background-color: ${props => props.theme.backgroundSecondary || '#f8fafc'};
    padding: 24px;
`;

const ContentWrapper = styled.div`
    max-width: 900px;
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
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
`;

const HeroImage = styled.img`
    width: 100%;
    height: 300px;
    object-fit: cover;
`;

const CardContent = styled.div`
    padding: 24px;
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
`;

const HotelName = styled.h1`
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.theme.text};
    margin: 0 0 8px 0;
`;

const LocationRow = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const LocationText = styled.span`
    font-size: 14px;
    color: ${props => props.theme.textSecondary};
`;

const PriceTag = styled.div`
    font-size: 24px;
    font-weight: 800;
    color: ${props => props.theme.primary};
    text-align: right;
`;

const PerNight = styled.span`
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.theme.textSecondary};
`;

const RatingRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
`;

const Stars = styled.div`
    display: flex;
    gap: 2px;
`;

const RatingValue = styled.span`
    font-weight: 700;
    color: ${props => props.theme.text};
`;

const ReviewsCount = styled.span`
    color: ${props => props.theme.textSecondary};
    font-size: 14px;
`;

const Description = styled.p`
    color: ${props => props.theme.textSecondary};
    line-height: 1.6;
    margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme.text};
    margin: 0 0 16px 0;
`;

const AmenitiesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
`;

const AmenityItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    color: ${props => props.theme.text};
    font-size: 14px;
    background-color: ${props => props.theme.backgroundSecondary};
    padding: 12px;
    border-radius: 8px;
`;

const AmenityIconWrapper = styled.div`
    color: ${props => props.theme.primary};
    display: flex;
    align-items: center;
`;

const SectionCard = styled.div`
    background-color: ${props => props.theme.card};
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
`;

const RoomsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const RoomItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border: 1px solid ${props => props.theme.border || '#e2e8f0'};
    border-radius: 12px;
    
    @media (max-width: 600px) {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }
`;

const RoomInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const RoomType = styled.span`
    font-weight: 600;
    color: ${props => props.theme.text};
    font-size: 16px;
`;

const RoomPrice = styled.span`
    color: ${props => props.theme.primary};
    font-weight: 700;
    font-size: 16px;
`;

const SelectButton = styled.button`
    background-color: ${props => props.theme.primary};
    color: white;
    padding: 10px 24px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
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

export default HotelDetailsScreen;
