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
    StatusBar
} from 'react-native';
import axios from 'axios';
import CalendarEvents from 'react-native-calendar-events';
import { getFontFamily } from '../../utils/fontFamily';
import CustomButton from '../../components/CustomButton';
import LinearGradient from 'react-native-linear-gradient';
import { format, addDays } from 'date-fns';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';


const axiosInstance = axios.create({
    baseURL: 'https://cruisecal.blackbullsolution.com/api/',
});

const Itinerary = ({ navigation, route }) => {
    const { tourCode, date, heading1, duration1 } = route.params;

    console.log("date", date);

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
            console.log("gvhdjkhbvbd", response.data.data);
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

    const checkCalendarPermission = async () => {
        const result = await check(PERMISSIONS.ANDROID.WRITE_CALENDAR);
        if (result === RESULTS.GRANTED) {
            return true;
        } else {
            const requestResult = await request(PERMISSIONS.ANDROID.WRITE_CALENDAR);
            return requestResult === RESULTS.GRANTED;
        }
    };

    const requestCalendarPermissions = async () => {
        try {
            const readPermission = await request(PERMISSIONS.ANDROID.READ_CALENDAR);
            const writePermission = await request(PERMISSIONS.ANDROID.WRITE_CALENDAR);

            if (readPermission === RESULTS.GRANTED && writePermission === RESULTS.GRANTED) {
                return true;
            } else {
                Alert.alert('Permissions Required', 'Calendar permissions are needed to save events.');
                return false;
            }
        } catch (error) {
            console.error('Error requesting calendar permissions:', error);
            return false;
        }
    };


    const handleSave = async () => {
        const hasPermission = await checkCalendarPermission();
        if (!hasPermission) {
            Alert.alert('Calendar Permission Denied', 'Unable to save event to calendar. Please grant calendar permissions in app settings.');
            return;
        }

        try {
            console.log("Itinerary Data:", itineraryData);

            // Create an array of promises for saving events
            const savePromises = itineraryData.map(async (item) => {
                // Calculate the full-day event date using the base date and the day's offset
                const baseDate = new Date(date); // Ensure 'date' is valid
                if (!isValidDate(baseDate)) {
                    throw new Error('Base date is invalid');
                }

                const eventDate = calculateDate(baseDate, parseInt(item.day, 10));

                // Check if the calculated eventDate is valid
                if (!isValidDate(eventDate)) {
                    console.error('Invalid event date:', eventDate);
                    throw new Error(`Invalid event date for day: ${eventDate}`);
                }

                // Use the eventDate as both start and end date (for full-day events)
                const startDate = new Date(eventDate); // Start of the day
                startDate.setHours(0, 0, 0, 0); // Set to midnight

                const endDate = new Date(eventDate); // End of the day
                endDate.setHours(23, 59, 59, 999); // Set to end of the day

                console.log('Saving full-day event:', { startDate: startDate.toISOString(), endDate: endDate.toISOString() });

                // Save the full-day event to the calendar
                return CalendarEvents.saveEvent('Cruise Itinerary', {
                    startDate: startDate.toISOString(), // Use the start date in ISO format
                    endDate: endDate.toISOString(), // Use the end date in ISO format
                    allDay: true, // This marks it as a full-day event
                    description: `Port Name: ${item.port || '-'} ,Details: URL - http://cruisecal.com, Cruise Name: Port Williamsom `,
                });
            });

            // Wait for all save operations to complete
            const eventIds = await Promise.all(savePromises);
            console.log('Full-day events saved with IDs:', eventIds);

            Alert.alert('Success', 'Full-day itinerary events saved to calendar successfully!');
        } catch (error) {
            console.error('Error saving full-day event to calendar:', error);
            Alert.alert('Failed to save full-day events', error.message || 'An error occurred while saving the full-day events.');
        }

        setIsModalVisible(false);
    };




    const calculateDateShow = (baseDate, dayOffset) => {
        const parsedDate = new Date(baseDate); // Parse the base date
        return format(addDays(parsedDate, dayOffset - 1), 'MMM-dd-yyyy'); // Subtract 1 from dayOffset since day 1 is baseDate
    };

    const calculateDate = (baseDate, dayOffset) => {
        const parsedDate = new Date(baseDate); // Parse the base date

        // Add the day offset (dayOffset should be a number)
        const calculatedDate = addDays(parsedDate, dayOffset - 1); // Subtract 1 since day 1 is baseDate

        return calculatedDate; // Return a Date object
    };


    const isValidDate = (date) => {
        return date instanceof Date && !isNaN(date);
    };



    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#5779B9" barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image resizeMode='contain' source={require('../../assets/images/backNew.png')} style={{ height: 30, width: 30, paddingTop: 20 }} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Cruise Itinerary</Text>
            </View>

            <Text style={styles.text}>{heading1} ({duration1} Nights)</Text>

            <View style={styles.tableContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerCell}>Date</Text>
                    <Text style={styles.headerCell}>Port</Text>
                    {/* <Text style={styles.headerCell}>Arrive</Text>
                    <Text style={styles.headerCell}>Depart</Text> */}
                </View>
                <FlatList
                    data={itineraryData}
                    keyExtractor={(item) => item.date}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            <Text style={styles.cell}>{calculateDateShow(date, item.day)}</Text>
                            <Text style={styles.cell}>{item.port || '-'}</Text>
                            {/* <Text style={styles.cell}>{item.arrival || '-'}</Text>
                            <Text style={styles.cell}>{item.departure || '-'}</Text> */}
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

            {/* <TouchableOpacity
                style={styles.button}
                onPress={() => setIsModalVisible(true)}
            >
                <Text style={styles.buttonText}>Add to Calendar</Text>
            </TouchableOpacity> */}

            <CustomButton style={styles.button} onPress={() => setIsModalVisible(true)} label={"Add to Calendar"} />

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

                            onPress={handleSave}
                        >
                            <LinearGradient
                                colors={['#8DC5EA', '#5879BC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.modalButton}
                            >
                                <Text style={styles.modalButtonText}>Save</Text>
                            </LinearGradient>

                        </TouchableOpacity>
                        {/* <CustomButton style={styles.modalButton} onPress={handleSave} label={"Save"} /> */}
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
        justifyContent: "space-between",

    },
    header: {
        backgroundColor: '#5779B9',
        padding: 15,
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30
    },
    headerText: {
        color: 'white',
        fontFamily: getFontFamily("bold"),
        fontSize: 23,
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
        color: "black",
        fontFamily: getFontFamily("medium")
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
        color: "white",
        fontFamily: getFontFamily("bold")
    },
    tableContainer: {
        marginTop: 20, // Adjust based on the height of the fixed header
        flex: 1,
    },
    button: {
        marginTop: 20,
        paddingVertical: 15,
        borderRadius: 8,
        margin: 30
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
    },
    text: {
        fontSize: 22,
        fontFamily: getFontFamily("bold"),
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
        marginBottom: 15,
        color: "#5779B9",
        fontFamily: getFontFamily("bold"),
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
        fontFamily: getFontFamily("medium"),
    },
    modalButton: {
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,


    },
    modalButtonText: {
        color: 'white',
        fontFamily: getFontFamily("medium"),
        fontSize: 16,
        marginHorizontal: 45
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80
    },
    flatListContent: {
        paddingTop: 40, // Space for the fixed header
    }
});

export default Itinerary;
