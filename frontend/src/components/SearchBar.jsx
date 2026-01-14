import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
    MapPin,
    Calendar,
    Users,
    Search,
    Plane,
    Hotel,
    Package,
    ArrowRightLeft
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SearchBar = ({ type: initialType = 'flights' }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [type, setType] = useState(initialType);
    const [searchData, setSearchData] = useState({
        from: 'Mumbai',
        to: 'Delhi',
        departDate: new Date().toISOString().split('T')[0],
        returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        passengers: 1,
        location: 'Goa',
        guests: 2
    });

    const handleSearch = () => {
        navigate('/search', { state: { ...searchData, type } });
    };

    const handleChange = (field, value) => {
        setSearchData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Container>
            <Tabs>
                <Tab $active={type === 'flights'} onClick={() => setType('flights')}>
                    <Plane size={18} />
                    Flights
                </Tab>
                <Tab $active={type === 'hotels'} onClick={() => setType('hotels')}>
                    <Hotel size={18} />
                    Hotels
                </Tab>
                <Tab $active={type === 'packages'} onClick={() => setType('packages')}>
                    <Package size={18} />
                    Packages
                </Tab>
            </Tabs>

            <SearchBox>
                {type === 'flights' && (
                    <FieldsGrid>
                        <Field>
                            <label>From</label>
                            <InputGroup>
                                <MapPin size={18} />
                                <input
                                    type="text"
                                    value={searchData.from}
                                    onChange={(e) => handleChange('from', e.target.value)}
                                    placeholder="Origin city"
                                />
                            </InputGroup>
                        </Field>

                        <SwapButton type="button">
                            <ArrowRightLeft size={16} />
                        </SwapButton>

                        <Field>
                            <label>To</label>
                            <InputGroup>
                                <MapPin size={18} />
                                <input
                                    type="text"
                                    value={searchData.to}
                                    onChange={(e) => handleChange('to', e.target.value)}
                                    placeholder="Destination"
                                />
                            </InputGroup>
                        </Field>

                        <Field>
                            <label>Depart</label>
                            <InputGroup>
                                <Calendar size={18} />
                                <input
                                    type="date"
                                    value={searchData.departDate}
                                    onChange={(e) => handleChange('departDate', e.target.value)}
                                />
                            </InputGroup>
                        </Field>

                        <Field>
                            <label>Travelers</label>
                            <InputGroup>
                                <Users size={18} />
                                <input
                                    type="number"
                                    min="1"
                                    value={searchData.passengers}
                                    onChange={(e) => handleChange('passengers', e.target.value)}
                                />
                            </InputGroup>
                        </Field>
                    </FieldsGrid>
                )}

                {type === 'hotels' && (
                    <FieldsGrid>
                        <Field style={{ flex: 2 }}>
                            <label>Where to?</label>
                            <InputGroup>
                                <MapPin size={18} />
                                <input
                                    type="text"
                                    value={searchData.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    placeholder="Enter destination or hotel name"
                                />
                            </InputGroup>
                        </Field>

                        <Field>
                            <label>Dates</label>
                            <InputGroup>
                                <Calendar size={18} />
                                <input
                                    type="text"
                                    placeholder="Choose dates"
                                    onFocus={(e) => e.target.type = 'date'}
                                />
                            </InputGroup>
                        </Field>

                        <Field>
                            <label>Guests</label>
                            <InputGroup>
                                <Users size={18} />
                                <input
                                    type="number"
                                    min="1"
                                    value={searchData.guests}
                                    onChange={(e) => handleChange('guests', e.target.value)}
                                />
                            </InputGroup>
                        </Field>
                    </FieldsGrid>
                )}

                {type === 'packages' && (
                    <FieldsGrid>
                        <Field style={{ flex: 2 }}>
                            <label>Destination</label>
                            <InputGroup>
                                <MapPin size={18} />
                                <input
                                    type="text"
                                    placeholder="Where are you going?"
                                />
                            </InputGroup>
                        </Field>

                        <Field>
                            <label>Month</label>
                            <InputGroup>
                                <Calendar size={18} />
                                <select>
                                    <option>Any month</option>
                                    <option>February 2026</option>
                                    <option>March 2026</option>
                                </select>
                            </InputGroup>
                        </Field>

                        <Field>
                            <label>Budget</label>
                            <InputGroup>
                                <Package size={18} />
                                <select>
                                    <option>Any budget</option>
                                    <option>Economy</option>
                                    <option>Premium</option>
                                    <option>Luxury</option>
                                </select>
                            </InputGroup>
                        </Field>
                    </FieldsGrid>
                )}

                <SearchButton onClick={handleSearch}>
                    <Search size={20} />
                    <span>Search</span>
                </SearchButton>
            </SearchBox>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    font-family: 'Inter', sans-serif;
`;

const Tabs = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    padding: 0 16px;
`;

const Tab = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 50px;
    border: none;
    background: ${props => props.$active ? props.theme.primary : 'transparent'};
    color: ${props => props.$active ? '#fff' : props.theme.textSecondary};
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${props => props.$active ? props.theme.primary : props.theme.backgroundTertiary};
    }
`;

const SearchBox = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 16px 8px 32px;
    
    @media (max-width: 1024px) {
        flex-direction: column;
        padding: 24px;
        align-items: stretch;
    }
`;

const FieldsGrid = styled.div`
    display: flex;
    flex: 1;
    gap: 1px;
    background: ${props => props.theme.border};
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid ${props => props.theme.border};
    position: relative;

    @media (max-width: 768px) {
        flex-direction: column;
        background: transparent;
        gap: 12px;
        border: none;
    }
`;

const Field = styled.div`
    flex: 1;
    background: ${props => props.theme.surface};
    padding: 12px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        color: ${props => props.theme.textSecondary};
        letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
        border: 1px solid ${props => props.theme.border};
        border-radius: 12px;
    }
`;

const InputGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    color: ${props => props.theme.primary};

    input, select {
        border: none;
        background: transparent;
        font-size: 15px;
        font-weight: 600;
        color: ${props => props.theme.text};
        width: 100%;
        outline: none;
        padding: 4px 0;

        &::placeholder {
            color: ${props => props.theme.textTertiary};
            font-weight: 400;
        }
    }
`;

const SwapButton = styled.button`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid ${props => props.theme.border};
    position: absolute;
    left: 20%; /* Rough visual center between From/To */
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${props => props.theme.textSecondary};
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    @media (max-width: 1024px) {
        display: none;
    }
`;

const SearchButton = styled.button`
    background: ${props => props.theme.primary};
    color: #fff;
    border: none;
    padding: 16px 32px;
    border-radius: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0, 106, 255, 0.3);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 106, 255, 0.4);
    }

    &:active {
        transform: translateY(0);
    }
`;

export default SearchBar;
