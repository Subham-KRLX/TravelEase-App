import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { theme, isDarkMode } = useTheme();

  // Animation Values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const statsTranslateY = useRef(new Animated.Value(50)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(50)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of entrance animations
    Animated.stagger(100, [
      // 1. Fade in Header
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      // 2. Slide up Stats
      Animated.parallel([
        Animated.timing(statsTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)) // bouncy effect
        }),
        Animated.timing(statsOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        })
      ]),
      // 3. Slide up Content
      Animated.parallel([
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        })
      ])
    ]).start();
  }, []);

  const handleLogout = async () => {
    const doLogout = async () => {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        await doLogout();
      }
    } else {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: doLogout
        }
      ]);
    }
  };

  const mockBookings = [
    {
      id: 1,
      type: 'flight',
      title: 'Mumbai to Delhi',
      date: '15 Nov 2025',
      status: 'Confirmed',
      amount: 8999
    },
    {
      id: 2,
      type: 'hotel',
      title: 'The Taj Mahal Palace',
      date: '20 Nov 2025',
      status: 'Confirmed',
      amount: 15999
    }
  ];

  // Parallax Header Interpolation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp'
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: 'clamp'
  });

  const renderBooking = (booking, index) => (
    <View key={booking.id} style={[styles.bookingCard, { backgroundColor: theme.card, shadowColor: theme.cardShadow }]}>
      <View style={styles.bookingHeader}>
        <View style={[styles.bookingIcon, { backgroundColor: isDarkMode ? theme.backgroundSecondary : '#dbeafe' }]}>
          <Ionicons
            name={booking.type === 'flight' ? 'airplane' : 'bed'}
            size={24}
            color={theme.primary}
          />
        </View>
        <View style={styles.bookingInfo}>
          <Text style={[styles.bookingTitle, { color: theme.text }]}>{booking.title}</Text>
          <Text style={[styles.bookingDate, { color: theme.textSecondary }]}>{booking.date}</Text>
        </View>
        <LinearGradient
          colors={theme.successGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.statusBadge}
        >
          <Text style={styles.statusText}>{booking.status}</Text>
        </LinearGradient>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
      <View style={styles.bookingFooter}>
        <View>
          <Text style={[styles.amountLabel, { color: theme.textTertiary }]}>Total Amount</Text>
          <Text style={[styles.amount, { color: theme.primary }]}>₹{booking.amount.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.detailsLink}>
          <Text style={[styles.detailsLinkText, { color: theme.primary }]}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!user) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="person-circle-outline" size={80} color={theme.textTertiary} />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>Please Login</Text>
        <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>Login to view your dashboard</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
        >
          <LinearGradient
            colors={theme.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Header Section with Gradient and Parallax */}
        <Animated.View style={{
          opacity: headerOpacity,
          transform: [
            { scale: headerHeight },
            { translateY: headerTranslateY }
          ]
        }}>
          <LinearGradient
            colors={theme.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: theme.card }]}>
                  <Ionicons name="person" size={32} color={theme.primary} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.welcomeText}>Welcome back,</Text>
                  <Text style={styles.userName}>{user.name}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.logoutButton}>
                  <View style={[styles.logoutIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Ionicons name="home" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                  <View style={[styles.logoutIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats Cards Floating on Gradient with Staggered Slide Up */}
            <Animated.View style={[styles.statsContainer, {
              opacity: statsOpacity,
              transform: [{ translateY: statsTranslateY }]
            }]}>
              <View style={[styles.statCard, { backgroundColor: theme.card, shadowColor: theme.cardShadow }]}>
                <LinearGradient
                  colors={theme.primaryGradient}
                  style={styles.iconCircle}
                >
                  <Ionicons name="calendar" size={20} color="#fff" />
                </LinearGradient>
                <Text style={[styles.statValue, { color: theme.text }]}>{mockBookings.length}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Bookings</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: theme.card, shadowColor: theme.cardShadow }]}>
                <LinearGradient
                  colors={theme.successGradient}
                  style={styles.iconCircle}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                </LinearGradient>
                <Text style={[styles.statValue, { color: theme.text }]}>{mockBookings.length}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Completed</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: theme.card, shadowColor: theme.cardShadow }]}>
                <LinearGradient
                  colors={theme.warningGradient}
                  style={styles.iconCircle}
                >
                  <Ionicons name="time" size={20} color="#fff" />
                </LinearGradient>
                <Text style={[styles.statValue, { color: theme.text }]}>0</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Upcoming</Text>
              </View>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* Content Section with Slide Up */}
        <Animated.View style={[styles.contentSection, {
          opacity: contentOpacity,
          transform: [{ translateY: contentTranslateY }]
        }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>My Bookings</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {mockBookings.map((booking, index) => renderBooking(booking, index))}

          <View style={styles.quickActionsContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 16 }]}>Quick Actions</Text>

            <TouchableOpacity onPress={() => navigation.navigate('SearchResults', { type: 'flights' })}>
              <LinearGradient
                colors={theme.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.actionButton, { borderColor: theme.border, borderWidth: 1 }]}
              >
                <View style={[styles.actionIcon, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#fff' }]}>
                  <Ionicons name="airplane" size={24} color={theme.primary} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={[styles.actionTitle, { color: theme.text }]}>Book Flights</Text>
                  <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>Find best deals worldwide</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SearchResults', { type: 'hotels' })}>
              <LinearGradient
                colors={theme.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.actionButton, { borderColor: theme.border, borderWidth: 1 }]}
              >
                <View style={[styles.actionIcon, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#fff' }]}>
                  <Ionicons name="bed" size={24} color={theme.accent} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={[styles.actionTitle, { color: theme.text }]}>Book Hotels</Text>
                  <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>Luxury stays for you</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity>
              <LinearGradient
                colors={theme.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.actionButton, { borderColor: theme.border, borderWidth: 1 }]}
              >
                <View style={[styles.actionIcon, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#fff' }]}>
                  <Ionicons name="headset" size={24} color={theme.success} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={[styles.actionTitle, { color: theme.text }]}>Help & Support</Text>
                  <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>24/7 Customer Service</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 4,
  },
  logoutIconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    marginRight: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
    marginBottom: -60, // Pull up to overlap gradient
    zIndex: 1,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  contentSection: {
    marginTop: 70, // Space for the floating stats
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  bookingCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookingIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsLinkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsContainer: {
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  loginButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
