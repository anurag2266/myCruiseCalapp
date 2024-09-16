import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    Image,
    Alert,
    ActivityIndicator,
    Platform,
    Linking,
    PermissionsAndroid
} from 'react-native';
import axios from 'axios';
import CalendarEvents from 'react-native-calendar-events';

const requestCalendarPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
                {
                    title: 'Calendar Permission',
                    message: 'This app needs access to your calendar to add events.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    }
    return true;  // For iOS, permissions are handled automatically
};

const axiosInstance = axios.create({
    baseURL: 'https://cruisecal.blackbullsolution.com/api/',
});

const Itinerary = ({ navigation, route }) => {
    const { tourCode } = route.params;

    const [itineraryData, setItineraryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cabinNumber, setCabinNumber] = useState('');
    const [bookingNumber, setBookingNumber] = useState('');
    const [hasPermission, setHasPermission] = useState(false);


    const fetchItineraryData = async (tourCode) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post('/itinary', { tour_code: tourCode }); // Adjust endpoint and request body as needed
            setItineraryData(response.data.data); // Adjust based on your API response
        } catch (error) {
            setError('Failed to fetch itinerary data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tourCode) {
            fetchItineraryData(tourCode);
        }
    }, [tourCode]);

    const openSettings = () => {
        if (Platform.OS === 'android') {
            Linking.openSettings();
        } else {
            Linking.openURL('app-settings:');
        }
    };

    const handleSave = async () => {
        const hasPermission = await requestCalendarPermission();
      setHasPermission(hasPermission);
      console.log("hgvjbjiohb", hasPermission)
        if (!hasPermission) {
            Alert.alert(
                'Calendar Permission Denied',
                'Unable to save event to calendar. Please grant calendar permissions in app settings.',
                [{ text: 'Open Settings', onPress: openSettings }],
                { cancelable: false }
            );
            return;
        }

        try {
            const eventId = await CalendarEvents.saveEvent('Cruise Itinerary', {
                startDate: new Date().toISOString(),
                endDate: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
                description: `Cabin: ${cabinNumber}, Booking: ${bookingNumber}`,
            });
            Alert.alert('Success', 'Event saved to calendar successfully!');
            console.log('Event ID:', eventId);
        } catch (error) {
            console.error('Error saving event to calendar:', error);
            Alert.alert('Failed to save event', 'An error occurred while saving the event to the calendar.');
        }
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image resizeMode='contain' source={require('../../assets/images/backNew.png')} style={{ height: 30, width: 30, paddingTop: 20 }} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Cruise Itinerary</Text>
            </View>

            <Text style={styles.text}>Bridgetown to Philipsburg (7 Nights)</Text>

            <View style={styles.tableContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerCell}>Date</Text>
                    <Text style={styles.headerCell}>Port</Text>
                    <Text style={styles.headerCell}>Arrive</Text>
                    <Text style={styles.headerCell}>Depart</Text>
                </View>
                <FlatList
                    data={itineraryData}
                    keyExtractor={(item) => item.date}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            <Text style={styles.cell}>{item.day || '-'}</Text>
                            <Text style={styles.cell}>{item.port || '-'}</Text>
                            <Text style={styles.cell}>{item.arrival || '-'}</Text>
                            <Text style={styles.cell}>{item.departure || '-'}</Text>
                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#5779B9" />
                            ) : (
                                <Text>{error || 'No itinerary data available'}</Text>
                            )}
                        </View>
                    )}
                    contentContainerStyle={styles.flatListContent}
                />
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => setIsModalVisible(true)}
            >
                <Text style={styles.buttonText}>Add to Calendar</Text>
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Booking Information</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Cabin Number"
                            value={cabinNumber}
                            onChangeText={setCabinNumber}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Booking Number"
                            value={bookingNumber}
                            onChangeText={setBookingNumber}
                        />
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleSave}
                        >
                            <Text style={styles.modalButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: "space-between"
    },
    header: {
        backgroundColor: '#5779B9',
        padding: 15,
        marginBottom: 20,
        flexDirection: "row",
        alignItems:"center"
    },
    headerText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 24,
        textAlign: 'center',
        alignSelf: "center",
        justifyContent: "center",
        marginLeft: 20
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        color: "black"
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#2B3B59',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 1,
    },
    headerCell: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '600',
        color: "white"
    },
    tableContainer: {
        marginTop: 20, // Adjust based on the height of the fixed header
        flex: 1,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#5779B9',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        margin: 30
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
    },
    text: {
        fontWeight: '800',
        fontSize: 24,
        marginBottom: 20,
        color: '#5779B9',
        textAlign: 'center',
        marginHorizontal: 20
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
        color: "#5779B9"
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
        marginTop: 10,
        backgroundColor: "#F8F8F8",
    },
    modalButton: {
        backgroundColor: '#5779B9',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        marginHorizontal: 25
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContent: {
        paddingTop: 40, // Space for the fixed header
    }
});

export default Itinerary;
