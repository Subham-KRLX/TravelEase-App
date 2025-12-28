import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import flightService from '../services/flightService';
import hotelService from '../services/hotelService';

// Helper function to validate and convert string date to Date object
const convertStringToDate = (dateString) => {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  
  try {
    const date = new Date(dateString);
    // Ensure the date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string: ${dateString}`);
      return null;
    }
    return date;
  } catch (error) {
    console.warn(`Error converting date: ${error.message}`);
    return null;
  }
};

// Helper function to convert Date object to ISO string (YYYY-MM-DD)
const dateToString = (date) => {
  if (!date) return '';
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0];
};

export default function SearchBar({ type = 'flights' }) {
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

  const navigation = useNavigation();

  // Fetch suggestions when inputs change
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!activeField || searchData[activeField].length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        let results = [];

        if (searchType === 'flights' && (activeField === 'from' || activeField === 'to')) {
          // Use popular routes API for suggestions or filter local list in real app
          // For now, simple mock filter or backend call if available
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
  }, [searchData.from, searchData.to, searchData.location, activeField]);

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
    // Keep only string dates for navigation (Date objects can't be serialized in navigation params)
    const processedData = { ...searchData };

    navigation.navigate('SearchResults', {
      type: searchType,
      ...processedData
      // String dates are already in YYYY-MM-DD format in searchData
      // Convert them to Date objects in the SearchResults screen if needed
    });
  };

  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;

    return (
      <View style={[styles.suggestionsContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <ScrollView scrollEnabled nestedScrollEnabled={false}>
          {suggestions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.suggestionItem, { borderBottomColor: theme.border }]}
              onPress={() => handleSuggestionSelect(item)}
            >
              <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.suggestionText, { color: theme.text }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderFlightSearch = () => (
    <>
      <View style={{ zIndex: 10 }}>
        <View style={[styles.searchField, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
          <Ionicons name="location-outline" size={20} color={theme.textSecondary} />
          <View style={styles.fieldContent}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>From</Text>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Mumbai, Delhi, Bangalore..."
              placeholderTextColor={theme.textTertiary}
              value={searchData.from}
              onChangeText={(value) => handleInputChange('from', value)}
              onFocus={() => setActiveField('from')}
            />
          </View>
        </View>
        {activeField === 'from' && renderSuggestions()}
      </View>

      <View style={{ zIndex: 9 }}>
        <View style={[styles.searchField, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
          <Ionicons name="location-outline" size={20} color={theme.textSecondary} />
          <View style={styles.fieldContent}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>To</Text>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Delhi, Mumbai, Chennai..."
              placeholderTextColor={theme.textTertiary}
              value={searchData.to}
              onChangeText={(value) => handleInputChange('to', value)}
              onFocus={() => setActiveField('to')}
            />
          </View>
        </View>
        {activeField === 'to' && renderSuggestions()}
      </View>

      <View style={[styles.searchField, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
        <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
        <View style={styles.fieldContent}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Departure Date</Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textTertiary}
            value={searchData.departDate}
            onChangeText={(value) => handleInputChange('departDate', value)}
          />
        </View>
      </View>

      <View style={[styles.searchField, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
        <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
        <View style={styles.fieldContent}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Return Date</Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textTertiary}
            value={searchData.returnDate}
            onChangeText={(value) => handleInputChange('returnDate', value)}
          />
        </View>
      </View>

      <View style={[styles.searchField, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
        <Ionicons name="people-outline" size={20} color={theme.textSecondary} />
        <View style={styles.fieldContent}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Passengers</Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="1"
            placeholderTextColor={theme.textTertiary}
            keyboardType="numeric"
            value={searchData.passengers}
            onChangeText={(value) => handleInputChange('passengers', value)}
          />
        </View>
      </View>
    </>
  );

  const renderHotelSearch = () => (
    <>
      <View style={{ zIndex: 10 }}>
        <View style={[styles.searchField, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
          <Ionicons name="location-outline" size={20} color={theme.textSecondary} />
          <View style={styles.fieldContent}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Destination</Text>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="City, Hotel, or Location..."
              placeholderTextColor={theme.textTertiary}
              value={searchData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              onFocus={() => setActiveField('location')}
            />
          </View>
        </View>
        {activeField === 'location' && renderSuggestions()}
      </View>

      <View style={[styles.searchField, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
        <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
        <View style={styles.fieldContent}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Check-in</Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textTertiary}
            value={searchData.checkIn}
            onChangeText={(value) => handleInputChange('checkIn', value)}
          />
        </View>
      </View>

      <View style={[styles.searchField, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
        <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
        <View style={styles.fieldContent}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Check-out</Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textTertiary}
            value={searchData.checkOut}
            onChangeText={(value) => handleInputChange('checkOut', value)}
          />
        </View>
      </View>

      <View style={[styles.searchField, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
        <Ionicons name="people-outline" size={20} color={theme.textSecondary} />
        <View style={styles.fieldContent}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Guests</Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="1"
            placeholderTextColor={theme.textTertiary}
            keyboardType="numeric"
            value={searchData.guests}
            onChangeText={(value) => handleInputChange('guests', value)}
          />
        </View>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.card, zIndex: 100 }]}>
      <View style={[styles.tabContainer, { backgroundColor: theme.backgroundTertiary }]}>
        <TouchableOpacity
          style={[styles.tab, searchType === 'flights' && { backgroundColor: theme.primary }]}
          onPress={() => setSearchType('flights')}
        >
          <Ionicons
            name="airplane"
            size={20}
            color={searchType === 'flights' ? '#fff' : theme.textSecondary}
          />
          <Text style={[
            styles.tabText,
            { color: searchType === 'flights' ? '#fff' : theme.textSecondary }
          ]}>
            Flights
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, searchType === 'hotels' && { backgroundColor: theme.primary }]}
          onPress={() => setSearchType('hotels')}
        >
          <Ionicons
            name="bed"
            size={20}
            color={searchType === 'hotels' ? '#fff' : theme.textSecondary}
          />
          <Text style={[
            styles.tabText,
            { color: searchType === 'hotels' ? '#fff' : theme.textSecondary }
          ]}>
            Hotels
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, searchType === 'packages' && { backgroundColor: theme.primary }]}
          onPress={() => setSearchType('packages')}
        >
          <Ionicons
            name="gift"
            size={20}
            color={searchType === 'packages' ? '#fff' : theme.textSecondary}
          />
          <Text style={[
            styles.tabText,
            { color: searchType === 'packages' ? '#fff' : theme.textSecondary }
          ]}>
            Packages
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.searchForm}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {searchType === 'flights' ? renderFlightSearch() : renderHotelSearch()}
      </ScrollView>

      <TouchableOpacity style={[styles.searchButton, { backgroundColor: theme.primary }]} onPress={handleSearch}>
        <Ionicons name="search" size={20} color="#fff" />
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#1e40af',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  searchForm: {
    maxHeight: 400,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  fieldContent: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  input: {
    fontSize: 14,
    color: '#1e293b',
    padding: 0,
  },
  searchButton: {
    backgroundColor: '#1e40af',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 5,
    zIndex: 1000,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: '#334155',
  }
});
