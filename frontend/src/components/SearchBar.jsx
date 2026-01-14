import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
    IoLocationOutline,
    IoCalendarOutline,
    IoPeopleOutline,
    IoAirplane,
    IoBed,
    IoGift,
    IoSearch
} from 'react-icons/io5';
import { useTheme } from '../context/ThemeContext';
import flightService from '../services/flightService';
import hotelService from '../services/hotelService';

const SearchBar = ({ type = 'flights' }) => {
    const [searchType, setSearchType] = useState(type);
    const { theme } = useTheme();

    // Search state
    const [searchData, setSearchData] = useState({
        from: '',
        to: '',
        departDate: new Date().toISOString().split('T')[0],
        returnDate: '',
        passengers: '1',
        location: '',
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: '',
        guests: '1'
    });

    // Suggestions state
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Fetch suggestions when inputs change
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!activeField || !searchData[activeField] || searchData[activeField].length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                let results = [];

                if (searchType === 'flights' && (activeField === 'from' || activeField === 'to')) {
                    const response = await flightService.getPopularRoutes();
                    if (response.success) {
                        const cities = [...new Set(response.routes.map(r => r._id.origin).concat(response.routes.map(r => r._id.destination)))];
                        results = cities.filter(city => city.toLowerCase().includes(searchData[activeField].toLowerCase()));
                    }
                } else if (searchType === 'hotels' && activeField === 'location') {
                    const response = await hotelService.getPopularDestinations();
                    if (response.success) {
                        results = response.destinations
                            .filter(d => d._id.toLowerCase().includes(searchData[activeField].toLowerCase()))
                            .map(d => d._id);
                    }
                }

                setSuggestions(results);
                setShowSuggestions(results.length > 0);
            } catch (error) {
                console.log('Error fetching suggestions:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(timer);
    }, [searchData.from, searchData.to, searchData.location, activeField, searchType, searchData]);

    const handleInputChange = (field, value) => {
        setActiveField(field);
        setSearchData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSuggestionSelect = (value) => {
        setSearchData(prev => ({
            ...prev,
            [activeField]: value
        }));
        setShowSuggestions(false);
        setActiveField(null);
    };

    const handleSearch = () => {
        navigate('/search', {
            state: {
                type: searchType,
                ...searchData
            }
        });
    };

    const renderSuggestions = () => {
        if (!showSuggestions || suggestions.length === 0) return null;

        return (
            <SuggestionsContainer theme={theme}>
                <SuggestionList>
                    {suggestions.map((item, index) => (
                        <SuggestionItem
                            key={index}
                            theme={theme}
                            onClick={() => handleSuggestionSelect(item)}
                        >
                            <IoLocationOutline size={16} color={theme.textSecondary} />
                            <SuggestionText theme={theme}>{item}</SuggestionText>
                        </SuggestionItem>
                    ))}
                </SuggestionList>
            </SuggestionsContainer>
        );
    };

    const renderFlightSearch = () => (
        <>
            <SearchFieldWrapper>
                <SearchField theme={theme}>
                    <IoLocationOutline size={20} color={theme.textSecondary} />
                    <FieldContent>
                        <Label theme={theme}>From</Label>
                        <Input
                            theme={theme}
                            placeholder="Mumbai, Delhi..."
                            value={searchData.from}
                            onChange={(e) => handleInputChange('from', e.target.value)}
                            onFocus={() => setActiveField('from')}
                        />
                    </FieldContent>
                </SearchField>
                {activeField === 'from' && renderSuggestions()}
            </SearchFieldWrapper>

            <SearchFieldWrapper>
                <SearchField theme={theme}>
                    <IoLocationOutline size={20} color={theme.textSecondary} />
                    <FieldContent>
                        <Label theme={theme}>To</Label>
                        <Input
                            theme={theme}
                            placeholder="Delhi, Mumbai..."
                            value={searchData.to}
                            onChange={(e) => handleInputChange('to', e.target.value)}
                            onFocus={() => setActiveField('to')}
                        />
                    </FieldContent>
                </SearchField>
                {activeField === 'to' && renderSuggestions()}
            </SearchFieldWrapper>

            <SearchField theme={theme}>
                <IoCalendarOutline size={20} color={theme.textSecondary} />
                <FieldContent>
                    <Label theme={theme}>Departure Date</Label>
                    <Input
                        type="date"
                        theme={theme}
                        min={new Date().toISOString().split('T')[0]}
                        value={searchData.departDate}
                        onChange={(e) => handleInputChange('departDate', e.target.value)}
                    />
                </FieldContent>
            </SearchField>

            <SearchField theme={theme}>
                <IoCalendarOutline size={20} color={theme.textSecondary} />
                <FieldContent>
                    <Label theme={theme}>Return Date</Label>
                    <Input
                        type="date"
                        theme={theme}
                        min={searchData.departDate}
                        value={searchData.returnDate}
                        onChange={(e) => handleInputChange('returnDate', e.target.value)}
                    />
                </FieldContent>
            </SearchField>

            <SearchField theme={theme}>
                <IoPeopleOutline size={20} color={theme.textSecondary} />
                <FieldContent>
                    <Label theme={theme}>Passengers</Label>
                    <Input
                        type="number"
                        min="1"
                        theme={theme}
                        placeholder="1"
                        value={searchData.passengers}
                        onChange={(e) => handleInputChange('passengers', e.target.value)}
                    />
                </FieldContent>
            </SearchField>
        </>
    );

    const renderHotelSearch = () => (
        <>
            <SearchFieldWrapper>
                <SearchField theme={theme}>
                    <IoLocationOutline size={20} color={theme.textSecondary} />
                    <FieldContent>
                        <Label theme={theme}>Destination</Label>
                        <Input
                            theme={theme}
                            placeholder="City, Hotel..."
                            value={searchData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            onFocus={() => setActiveField('location')}
                        />
                    </FieldContent>
                </SearchField>
                {activeField === 'location' && renderSuggestions()}
            </SearchFieldWrapper>

            <SearchField theme={theme}>
                <IoCalendarOutline size={20} color={theme.textSecondary} />
                <FieldContent>
                    <Label theme={theme}>Check-in</Label>
                    <Input
                        type="date"
                        theme={theme}
                        min={new Date().toISOString().split('T')[0]}
                        value={searchData.checkIn}
                        onChange={(e) => handleInputChange('checkIn', e.target.value)}
                    />
                </FieldContent>
            </SearchField>

            <SearchField theme={theme}>
                <IoCalendarOutline size={20} color={theme.textSecondary} />
                <FieldContent>
                    <Label theme={theme}>Check-out</Label>
                    <Input
                        type="date"
                        theme={theme}
                        min={searchData.checkIn}
                        value={searchData.checkOut}
                        onChange={(e) => handleInputChange('checkOut', e.target.value)}
                    />
                </FieldContent>
            </SearchField>

            <SearchField theme={theme}>
                <IoPeopleOutline size={20} color={theme.textSecondary} />
                <FieldContent>
                    <Label theme={theme}>Guests</Label>
                    <Input
                        type="number"
                        min="1"
                        theme={theme}
                        placeholder="1"
                        value={searchData.guests}
                        onChange={(e) => handleInputChange('guests', e.target.value)}
                    />
                </FieldContent>
            </SearchField>
        </>
    );

    return (
        <Container theme={theme}>
            <TabContainer theme={theme}>
                <Tab
                    active={searchType === 'flights'}
                    theme={theme}
                    onClick={() => setSearchType('flights')}
                >
                    <IoAirplane size={20} color={searchType === 'flights' ? '#fff' : theme.textSecondary} />
                    <TabText active={searchType === 'flights'} theme={theme}>Flights</TabText>
                </Tab>
                <Tab
                    active={searchType === 'hotels'}
                    theme={theme}
                    onClick={() => setSearchType('hotels')}
                >
                    <IoBed size={20} color={searchType === 'hotels' ? '#fff' : theme.textSecondary} />
                    <TabText active={searchType === 'hotels'} theme={theme}>Hotels</TabText>
                </Tab>
                <Tab
                    active={searchType === 'packages'}
                    theme={theme}
                    onClick={() => setSearchType('packages')}
                >
                    <IoGift size={20} color={searchType === 'packages' ? '#fff' : theme.textSecondary} />
                    <TabText active={searchType === 'packages'} theme={theme}>Packages</TabText>
                </Tab>
            </TabContainer>

            <SearchForm>
                {searchType === 'flights' ? renderFlightSearch() : renderHotelSearch()}
            </SearchForm>

            <SearchButton theme={theme} onClick={handleSearch}>
                <IoSearch size={20} color="#fff" />
                <SearchButtonText>Search</SearchButtonText>
            </SearchButton>
        </Container>
    );
};

// Styled Components
const Container = styled.div`
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  padding: 12px;
  margin: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  z-index: 100;
  
  @media (min-width: 640px) {
    padding: 16px;
    margin: 16px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  background-color: ${props => props.theme.backgroundTertiary || '#f1f5f9'};
  border-radius: 8px;
  padding: 4px;
`;

const Tab = styled.button`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 6px;
  border-radius: 6px;
  gap: 4px;
  background-color: ${props => props.active ? props.theme.primary : 'transparent'};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 44px; /* Touch-friendly */
  
  @media (min-width: 640px) {
    padding: 10px;
    gap: 6px;
  }
`;

const TabText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.active ? '#fff' : props.theme.textSecondary};
  
  @media (min-width: 640px) {
    font-size: 14px;
  }
`;

const SearchForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SearchFieldWrapper = styled.div`
  position: relative;
  z-index: 10;
`;

const SearchField = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${props => props.theme.border || '#e2e8f0'};
  background-color: ${props => props.theme.backgroundSecondary || 'transparent'};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 0px; /* managed by gap in parent */
`;

const FieldContent = styled.div`
  flex: 1;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 4px;
`;

const Input = styled.input`
  font-size: 14px;
  color: ${props => props.theme.text};
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  
  &::placeholder {
    color: ${props => props.theme.textTertiary || '#94a3b8'};
  }
`;

const SearchButton = styled.button`
  background-color: ${props => props.theme.primary || '#1e40af'};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border-radius: 8px;
  margin-top: 12px;
  gap: 8px;
  border: none;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  transition: opacity 0.2s;
  min-height: 48px; /* Touch-friendly */

  &:hover {
    opacity: 0.9;
  }
`;

const SearchButtonText = styled.span`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.card};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
`;

const SuggestionList = styled.div`
  display: flex;
  flex-direction: column;
`;

const SuggestionItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid ${props => props.theme.border || '#f1f5f9'};
  gap: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.backgroundSecondary};
  }
`;

const SuggestionText = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text};
`;

export default SearchBar;
