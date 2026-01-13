import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { isDarkMode, toggleTheme, theme } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.logo}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="airplane" size={24} color={theme.headerText} />
          <Text style={[styles.logoText, { color: theme.headerText }]}>TravelEase</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.themeButton}
            onPress={toggleTheme}
          >
            <Ionicons 
              name={isDarkMode ? 'sunny' : 'moon'} 
              size={24} 
              color={theme.headerText} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Checkout')}
          >
            <Ionicons name="cart" size={24} color={theme.headerText} />
            {getTotalItems() > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>

          {user ? (
            <TouchableOpacity 
              style={styles.userButton}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <Ionicons name="person" size={24} color={theme.headerText} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.loginButton, { backgroundColor: theme.headerText }]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[styles.loginText, { color: theme.headerBackground }]}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1e40af',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeButton: {
    padding: 4,
  },
  cartButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userButton: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  loginText: {
    color: '#1e40af',
    fontWeight: '600',
  },
});
