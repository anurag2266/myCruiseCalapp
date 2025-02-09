import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axiosInstance from '../../api/axiosInstance';
import { getFontFamily } from '../../utils/fontFamily';
import CustomButton from '../../components/CustomButton';

const Profile = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCruise, setSelectedCruise] = useState(null);
  const [selectedShip, setSelectedShip] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ships, setShips] = useState([]);
  const [selectedTourCode, setSelectedTourCode] = useState(null);
  const [date, setDate] = useState(null);
  const [heading, setHeading] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (selectedCruise) {
      fetchShips(selectedCruise?.cruiseline_code, selectedCruise?.ship_code);
    }
  }, [selectedCruise]);

  const handleNavigateToItinerary = () => {
    if (selectedTourCode) {
      navigation.navigate('Itinerary', {
        tourCode: selectedTourCode,
        date: date,
        heading1: heading,
        duration1: duration
      });
    } else {
      Alert.alert('No Tour Selected', 'Please select a tour before continuing.');
    }
  };

  const filterCruiseLines = async (text) => {
    setQuery(text);
    if (text) {
      try {
        setLoading(true);
        const response = await axiosInstance.post('/autocomplete', { searchText: text });

        if (Array.isArray(response.data.data)) {
          const cruiseLineObjects = response.data.data.map((item, index) => ({
            id: index.toString(),
            title: item.cruiseline_name,
            cruiseline_code: item.cruiseline_code,
            ship_code: item.ship_code,
            ship_name: item.ship_name,
          }));

          const uniqueCruiseLines = Array.from(new Set(cruiseLineObjects.map(item => `${item.cruiseline_code}-${item.ship_code}`)))
            .map(code => {
              return cruiseLineObjects.find(item => `${item.cruiseline_code}-${item.ship_code}` === code);
            });

          setFilteredData(uniqueCruiseLines);
        } else {
          setFilteredData([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching cruise lines:', error);
        setLoading(false);
      }
    } else {
      setFilteredData([]);
      setSelectedShip(null)
      setSelectedCruise(null);
    }
  };

  const fetchShips = async (cruiselineCode, shipCode) => {
    try {
      const response = await axiosInstance.post('/cruise_list', {
        cruiseline_code: cruiselineCode,
        ship_code: shipCode,
      });
      setShips(response.data.data);
      console.log(response.data.data);

      if (response.data.data.length > 0) {
        setSelectedTourCode(response.data.data[0].tour_code);
        setHeading(response.data.data[0].cruise_name);
        setDuration(response.data.data[0].duration);
      }
    } catch (error) {
      console.error('Error fetching ships:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View>

        <Text style={styles.text}>The easy way to add your cruise itinerary to your calendar</Text>

        {/* Searchable Text Input */}
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={filterCruiseLines}
          placeholder="Search cruise lines..."
        />
        {loading && <ActivityIndicator size="large" color="#5779B9" />}
        {/* Display Filtered Cruise Lines */}
        {filteredData.length > 0 && (
          <FlatList
            data={filteredData}
            style={styles.shadowEffect}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setSelectedCruise(item);
                  setFilteredData([]);
                  setQuery(item.ship_name + " " + item.title);
                }}
              >
                <Text style={styles.itemText}>{item.ship_name}</Text>
                <Text style={styles.itemText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Dropdown for Ships */}
        {selectedCruise && (
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setIsDropdownVisible(!isDropdownVisible)}
          >
            <Text style={styles.dropdownText}>
              {selectedShip
                ? `${selectedShip.formatted_date} - ${selectedShip.cruise_name.replace(
                  "from/to",
                  selectedShip.from_port_code === selectedShip.to_port_code
                    ? "Round Trip"
                    : `${selectedShip.from_port_code}/${selectedShip.to_port_code}`
                )} - (${selectedShip.duration} Nights)`
                : 'Select a Ship'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Dropdown Items for Ships */}
        {isDropdownVisible && ships.length > 0 && (
          <View style={styles.dropdownItemsContainer}>
            <FlatList
              data={ships}
              keyExtractor={(item) => item.tour_code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedShip(item);
                    setDate(item.departure_date)
                    setHeading(item.cruise_name);
                    setDuration(item.duration);
                    setIsDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>
                    {item?.formatted_date} - {item?.cruise_name.replace(
                      "from/to",
                      item?.from_port_code === item?.to_port_code
                        ? "Round Trip"
                        : `${item?.from_port_code}/${item?.to_port_code}`
                    )} - ({item?.duration} Nights)
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Show Itinerary Button */}
      {selectedShip && (
        <CustomButton onPress={handleNavigateToItinerary} label={"Show Itinerary"} />
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: "space-between"
  },
  text: {
    fontFamily: getFontFamily('bold'),
    fontSize: 20,
    marginBottom: 20,
    color: '#5779B9',
    textAlign: 'center',
  },
  input: {
    height: 55,
    borderColor: '#668EA9',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    color: 'black',
    fontFamily: getFontFamily('medium'),
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    flexDirection: "row",
    justifyContent: "space-between"
  },
  itemText: {
    fontSize: 16,
    color: 'black',
    fontFamily: getFontFamily('medium'),
  },
  shadowEffect: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#668EA9',
    borderRadius: 8,
    marginBottom: 5,
    height: 65,
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    fontFamily: getFontFamily('medium'),
  },
  dropdownItemsContainer: {
    borderRadius: 2,
    maxHeight: 300,  // Set max height for dropdown
    backgroundColor: 'white',
    elevation: 5
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 16,
    color: 'black',
    fontFamily: getFontFamily('medium'),
  },
});
