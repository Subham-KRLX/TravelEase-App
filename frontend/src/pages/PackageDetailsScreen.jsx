import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import {
    IoTimeOutline,
    IoLocationOutline,
    IoStar,
    IoCheckmarkCircle,
    IoArrowBack,
    IoMapOutline,
    IoAirplaneOutline,
    IoBedOutline,
    IoCarOutline
} from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import packageService from '../services/packageService';

const PackageDetailsScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { theme } = useTheme();

    const [pkg, setPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                // Check if service has getPackageDetails, otherwise mock or use search
                const response = await packageService.getPackageById(id);
                if (response.success) {
                    setPackage(response.package);
                } else {
                    setError('Package not found');
                }
            } catch (err) {
                setError('Error fetching package details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPackage();
        }
    }, [id]);

    const handleAddToCart = () => {
        addToCart({
            ...pkg,
            type: 'package',
            quantity: 1
        });
        if (window.confirm('Package added to cart! Go to checkout?')) {
            navigate('/checkout');
        }
    };

    if (loading) {
        return (
            <Container theme={theme}>
                <LoadingText theme={theme}>Loading package details...</LoadingText>
            </Container>
        );
    }

    if (error || !pkg) {
        return (
            <Container theme={theme}>
                <ErrorText>Error: {error || 'Package not found'}</ErrorText>
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
                    <Grid>
                        <ImageSection>
                            <HeroImage src={pkg.image} alt={pkg.name} />
                        </ImageSection>

                        <InfoSection>
                            <CardHeader>
                                <PackageName theme={theme}>{pkg.name}</PackageName>
                                <LocationRow>
                                    <IoLocationOutline size={18} color={theme.primary} />
                                    <LocationText theme={theme}>{pkg.destination}</LocationText>
                                </LocationRow>
                            </CardHeader>

                            <RatingRow>
                                <Stars>
                                    {[...Array(Math.floor(pkg.rating || 0))].map((_, i) => (
                                        <IoStar key={i} size={18} color="#eab308" />
                                    ))}
                                </Stars>
                                <RatingValue theme={theme}>{pkg.rating}</RatingValue>
                            </RatingRow>

                            <PriceTag theme={theme}>
                                ₹{pkg.price?.toLocaleString()}
                                <PerPerson theme={theme}>/person</PerPerson>
                            </PriceTag>

                            <DurationBadge theme={theme}>
                                <IoTimeOutline size={16} />
                                {pkg.duration}
                            </DurationBadge>

                            <Description theme={theme}>{pkg.description}</Description>

                            <BookButton theme={theme} onClick={handleAddToCart}>
                                Book This Package
                            </BookButton>
                        </InfoSection>
                    </Grid>
                </MainCard>

                <SectionCard theme={theme}>
                    <SectionTitle theme={theme}>What's Included</SectionTitle>
                    <AmenitiesGrid>
                        {(pkg.includes || ['Flights', 'Hotel', 'Transfer']).map((item, index) => (
                            <AmenityItem key={index} theme={theme}>
                                <AmenityIconWrapper theme={theme}>
                                    {item.toLowerCase().includes('flight') ? <IoAirplaneOutline /> :
                                        item.toLowerCase().includes('hotel') ? <IoBedOutline /> :
                                            item.toLowerCase().includes('transfer') || item.toLowerCase().includes('car') ? <IoCarOutline /> :
                                                <IoCheckmarkCircle />}
                                </AmenityIconWrapper>
                                <span>{item}</span>
                            </AmenityItem>
                        ))}
                    </AmenitiesGrid>
                </SectionCard>

                <SectionCard theme={theme}>
                    <SectionTitle theme={theme}>Itinerary</SectionTitle>
                    <ItineraryList>
                        {(pkg.itinerary || [
                            { day: 1, title: 'Arrival & Check-in', desc: 'Welcome drink and relax.' },
                            { day: 2, title: 'City Tour', desc: 'Visit famous landmarks.' },
                            { day: 3, title: 'Departure', desc: 'Transfer to airport.' }
                        ]).map((item, index) => (
                            <ItineraryItem key={index} theme={theme}>
                                <DayBadge theme={theme}>Day {item.day}</DayBadge>
                                <ItineraryContent>
                                    <ItineraryTitle theme={theme}>{item.title}</ItineraryTitle>
                                    <ItineraryDesc theme={theme}>{item.desc}</ItineraryDesc>
                                </ItineraryContent>
                            </ItineraryItem>
                        ))}
                    </ItineraryList>
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
    max-width: 1000px;
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

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ImageSection = styled.div`
    height: 100%;
    min-height: 400px;
`;

const HeroImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const InfoSection = styled.div`
    padding: 32px;
    display: flex;
    flex-direction: column;
`;

const CardHeader = styled.div`
    margin-bottom: 16px;
`;

const PackageName = styled.h1`
    font-size: 28px;
    font-weight: 700;
    color: ${props => props.theme.text};
    margin: 0 0 8px 0;
    line-height: 1.2;
`;

const LocationRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const LocationText = styled.span`
    font-size: 16px;
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

const PriceTag = styled.div`
    font-size: 32px;
    font-weight: 800;
    color: ${props => props.theme.primary};
    margin-bottom: 16px;
`;

const PerPerson = styled.span`
    font-size: 16px;
    font-weight: 400;
    color: ${props => props.theme.textSecondary};
    margin-left: 4px;
`;

const DurationBadge = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background-color: ${props => props.theme.backgroundSecondary};
    color: ${props => props.theme.text};
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 24px;
    align-self: flex-start;
`;

const Description = styled.p`
    color: ${props => props.theme.textSecondary};
    line-height: 1.6;
    margin-bottom: 32px;
`;

const BookButton = styled.button`
    background-color: ${props => props.theme.primary};
    color: white;
    padding: 16px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    margin-top: auto;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${props => props.theme.secondary};
    }
`;

const SectionCard = styled.div`
    background-color: ${props => props.theme.card};
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.text};
    margin: 0 0 24px 0;
`;

const AmenitiesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
`;

const AmenityItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    color: ${props => props.theme.text};
    font-size: 15px;
    background-color: ${props => props.theme.backgroundSecondary};
    padding: 16px;
    border-radius: 12px;
`;

const AmenityIconWrapper = styled.div`
    color: ${props => props.theme.primary};
    font-size: 20px;
    display: flex;
    align-items: center;
`;

const ItineraryList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const ItineraryItem = styled.div`
    display: flex;
    gap: 20px;
    
    @media (max-width: 600px) {
        flex-direction: column;
        gap: 12px;
    }
`;

const DayBadge = styled.div`
    background-color: ${props => props.theme.primary};
    color: white;
    font-weight: 700;
    border-radius: 8px;
    padding: 8px 16px;
    height: fit-content;
    white-space: nowrap;
`;

const ItineraryContent = styled.div`
    flex: 1;
`;

const ItineraryTitle = styled.h3`
    font-size: 16px;
    font-weight: 700;
    color: ${props => props.theme.text};
    margin-bottom: 8px;
`;

const ItineraryDesc = styled.p`
    color: ${props => props.theme.textSecondary};
    line-height: 1.6;
    font-size: 14px;
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

export default PackageDetailsScreen;
