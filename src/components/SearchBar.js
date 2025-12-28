import { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function SearchBar({ type = 'flights' }) {
  const [searchType, setSearchType] = useState(type);
  const { theme } = useTheme();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: '1',
    location: '',
    checkIn: '',
    checkOut: '',
    guests: '1'
  });

  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    navigation.navigate('SearchResults', {
      type: searchType,
      ...searchData
    });
  };

  const renderFlightSearch = () => (
    <>
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
          />
        </View>
      </View>

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

          />
        </View>
      </View>

      <View style={[styles.searchField, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
        <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
        <View style={styles.fieldContent}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Departure Date</Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="DD/MM/YYYY"
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
            placeholder="DD/MM/YYYY"
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
          />
        </View>
      </View>

      <View style={[styles.searchField, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}>
        <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
        <View style={styles.fieldContent}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Check-in</Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="DD/MM/YYYY"
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
            placeholder="DD/MM/YYYY"
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
    <View style={[styles.container, { backgroundColor: theme.card }]}>
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
    maxHeight: 300,
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
});
