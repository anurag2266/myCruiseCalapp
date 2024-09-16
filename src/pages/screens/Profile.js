import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import axiosInstance from '../../api/axiosInstance';

const Profile = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCruise, setSelectedCruise] = useState(null);
  const [selectedShip, setSelectedShip] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ships, setShips] = useState([]);
  const [selectedTourCode, setSelectedTourCode] = useState(null);

  useEffect(() => {
    if (selectedCruise) {
      fetchShips(selectedCruise?.cruiseline_code, selectedCruise?.ship_code);

    }
    console.log(selectedCruise?.cruiseline_code, selectedCruise?.ship_code)
  }, [selectedCruise]);


  const handleNavigateToItinerary = () => {
    if (selectedTourCode) {
      navigation.navigate('Itinerary', { tourCode: selectedTourCode });
    } else {
      Alert.alert('No Tour Selected', 'Please select a tour before continuing.');
    }
  };


  const filterCruiseLines = async (text) => {
    setQuery(text);
    if (text) {
      try {
        setLoading(true);  // Start loading
        const response = await axiosInstance.post('/autocomplete', {
          searchText: text,
        });

        // Ensure response.data is an array
        if (Array.isArray(response.data.data)) {
          // Create objects including cruise line name, code, and ship code
          const cruiseLineObjects = response.data.data.map((item, index) => ({
            id: index.toString(),  // Ensure unique IDs
            title: item.cruiseline_name,
            cruiseline_code: item.cruiseline_code,
            ship_code: item.ship_code,
            ship_name:item.ship_name
          }));

          // Remove duplicates based on cruiseline_code and ship_code
          const uniqueCruiseLines = Array.from(new Set(cruiseLineObjects.map(item => `${item.cruiseline_code}-${item.ship_code}`)))
            .map(code => {
              return cruiseLineObjects.find(item => `${item.cruiseline_code}-${item.ship_code}` === code);
            });

          setFilteredData(uniqueCruiseLines);
          console.log("--->", filteredData);
        } else {
          console.log('Unexpected response structure:', response.data);
          setFilteredData([]);
        }
        setLoading(false);  // Stop loading
      } catch (error) {
        console.error('Error fetching cruise lines:', error);
        setLoading(false);
      }
    } else {
      setFilteredData([]);
    }
  };

  // const fetchShips = async (cruiselineCode, shipCode) => {
  //   try {
  //     const response = await axiosInstance.post('/cruise_list', {
  //       cruiseline_code: cruiselineCode,
  //       ship_code: shipCode,
  //     });
  //     console.log("Fetched ship data--->", response.data); // Log fetched data
  //     setShips(response.data.data);
  //   } catch (error) {
  //     console.error('Error fetching ships:', error);
  //   }
  // };

  const fetchShips = async (cruiselineCode, shipCode) => {
    try {
      const response = await axiosInstance.post('/cruise_list', {
        cruiseline_code: cruiselineCode,
        ship_code: shipCode,
      });
      console.log("Fetched ship data--->", response.data); // Log fetched data
      setShips(response.data.data);

      // Assuming response.data.data contains an array of ships, each with a tour code
      if (response.data.data.length > 0) {
        setSelectedTourCode(response.data.data[0].tour_code);
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

        {/* Display Filtered Cruise Lines */}
        {filteredData.length > 0 && (
          <FlatList
            data={filteredData}
            style={styles.shadowEffect}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.item]}
                onPress={() => {
                  setSelectedCruise(item);
                  setFilteredData([]);
                  setQuery(item.title);
                }}
              >
                 <Text style={{ fontSize: 16, color: "black" }}>{item.ship_name}</Text>
                <Text style={{ fontSize: 16, color: "black" }}>{item.title}</Text>
               
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
              {selectedShip ? selectedShip.cruise_name : `Select a Ship for ${selectedCruise.title}`}
            </Text>
          </TouchableOpacity>
        )}

        {/* Modal for Dropdown */}
        {selectedCruise && (
          <Modal
            visible={isDropdownVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsDropdownVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setIsDropdownVisible(false)}
            >
              <View style={styles.modalContainer}>
                {ships.length > 0 ? (
                  <FlatList
                    data={ships}
                    keyExtractor={(item) => item.tour_code} // Ensure unique key
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          setSelectedShip(item);
                          setIsDropdownVisible(false);
                        }}
                      >
                        <Text style={{ color: "black" }}>{item.cruise_name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <Text>No ships available</Text>
                )}
              </View>
            </TouchableOpacity>
          </Modal>
        )}

      </View>

      {/* Show Itinerary Button */}
      {selectedShip && (
        <TouchableOpacity
          style={styles.button}
          onPress={handleNavigateToItinerary}
        >
          <Text style={styles.buttonText}>Show Itinerary</Text>
        </TouchableOpacity>
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
    fontWeight: '800',
    fontSize: 24,
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
    color: "black"
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection:"row",
    justifyContent:"space-between",
    backgroundColor:"#fff",
  },
  shadowEffect: {
    // For iOS shadow
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    // For Android elevation
    elevation: 5,
},
  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#668EA9',
    borderRadius: 8,
    marginBottom: 20,
    height: 65,
    justifyContent: "center"
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
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
    overflow: 'hidden',

  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#5779B9',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
});
