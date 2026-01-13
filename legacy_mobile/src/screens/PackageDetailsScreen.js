import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import packageService from '../services/packageService';

const { width } = Dimensions.get('window');

export default function PackageDetailsScreen() {
    const [pkg, setPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const route = useRoute();
    const { theme } = useTheme();
    const { addToCart } = useCart();

    const packageId = route.params?.id;

    useEffect(() => {
        fetchPackageDetails();
    }, [packageId]);

    const fetchPackageDetails = async () => {
        if (!packageId) return;
        setLoading(true);
        const result = await packageService.getPackageById(packageId);
        if (result.success) {
            setPackage(result.package);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    if (!pkg) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Package not found</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: pkg.image }} style={styles.image} />
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={[styles.name, { color: theme.text }]}>{pkg.name}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={18} color={theme.gold} />
                            <Text style={[styles.rating, { color: theme.text }]}>{pkg.rating}</Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={16} color={theme.primary} />
                        <Text style={[styles.location, { color: theme.textSecondary }]}>{pkg.destination}</Text>
                        <View style={styles.dot} />
                        <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                        <Text style={[styles.duration, { color: theme.textSecondary }]}>{pkg.duration}</Text>
                    </View>

                    <View style={styles.includesContainer}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>What's Included</Text>
                        <View style={styles.includesGrid}>
                            {pkg.includes.map((item, index) => (
                                <View key={index} style={[styles.includeItem, { backgroundColor: theme.backgroundSecondary }]}>
                                    <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                                    <Text style={[styles.includeText, { color: theme.textSecondary }]}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Overview</Text>
                        <Text style={[styles.description, { color: theme.textSecondary }]}>{pkg.description}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Itinerary</Text>
                        {pkg.itinerary.map((day, index) => (
                            <View key={index} style={styles.itineraryItem}>
                                <View style={styles.dayBadge}>
                                    <Text style={styles.dayText}>Day {day.day}</Text>
                                </View>
                                <View style={styles.itineraryContent}>
                                    <Text style={[styles.itineraryTitle, { color: theme.text }]}>{day.title}</Text>
                                    {day.activities.map((act, i) => (
                                        <View key={i} style={styles.activityRow}>
                                            <View style={[styles.activityDot, { backgroundColor: theme.primary }]} />
                                            <Text style={[styles.activityText, { color: theme.textSecondary }]}>{act}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                <View>
                    <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>Total Price</Text>
                    <Text style={[styles.price, { color: theme.primary }]}>₹{pkg.price.toLocaleString()}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.bookButton, { backgroundColor: theme.primary }]}
                    onPress={() => {
                        addToCart({
                            id: pkg._id,
                            type: 'package',
                            name: pkg.name,
                            price: pkg.price,
                            image: pkg.image,
                            destination: pkg.destination,
                            duration: pkg.duration
                        });
                        navigation.navigate('Dashboard');
                    }}
                >
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    imageContainer: { height: 300, width: '100%', position: 'relative' },
    image: { width: '100%', height: '100%' },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 8,
        borderRadius: 20
    },
    content: { padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    name: { fontSize: 24, fontWeight: 'bold', flex: 1 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    rating: { fontSize: 18, fontWeight: '600' },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12, gap: 8 },
    location: { fontSize: 14 },
    dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#94a3b8' },
    duration: { fontSize: 14 },
    section: { marginVertical: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    description: { fontSize: 15, lineHeight: 22 },
    includesContainer: { marginVertical: 15 },
    includesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    includeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6
    },
    includeText: { fontSize: 12, fontWeight: '500' },
    itineraryItem: { flexDirection: 'row', marginBottom: 20 },
    dayBadge: {
        backgroundColor: '#1e40af',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        height: 25,
        marginRight: 15
    },
    dayText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    itineraryContent: { flex: 1 },
    itineraryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    activityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
    activityDot: { width: 6, height: 6, borderRadius: 3 },
    activityText: { fontSize: 14, flex: 1 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 35,
        borderTopWidth: 1
    },
    priceLabel: { fontSize: 12 },
    price: { fontSize: 24, fontWeight: 'bold' },
    bookButton: { paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
    bookButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
