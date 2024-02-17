import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FontAwesome } from 'react-native-vector-icons';

Geocoder.init('AIzaSyDDVvsCzt1dbSWIIC5wKRji6vW87bGUEcg');

const ChooseLocation = ({ onCloseMod, isVisible, onClose, onSelectLocation, longitude, latitude, eventData, setCurrentStep }) => {
  const [selectedLatitude, setSelectedLatitude] = useState(latitude);
  const [selectedLongitude, setSelectedLongitude] = useState(longitude);
  const [selectedAddress, setSelectedAddress] = useState(eventData?.address || ''); // Set initial value

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await Geocoder.from({ latitude: lat, longitude: lng });
      const { results } = response;
      if (results.length > 0) {
        const address = results[0].formatted_address;
        return address;
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      throw error; // Re-throw the error to propagate it
    }
  };
  useEffect(() => {
    // Making sure selected address is saved
    console.log('Initial Data:', eventData);
    // Check if initialEventData is provided and update the state
    if (eventData) {
      setSelectedAddress(eventData.address);
    }

    // Fetch the address from coordinates and log it
    const fetchAddress = async () => {
      try {
        const address = await getAddressFromCoordinates(selectedLatitude, selectedLongitude);
        setSelectedAddress(address);
        console.log(address);
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };

    fetchAddress();
  }, [eventData, selectedLatitude, selectedLongitude]);

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLatitude(latitude);
    setSelectedLongitude(longitude);
    try {
      const address = await getAddressFromCoordinates(latitude, longitude);
      setSelectedAddress(address);
    } catch (error) {
      console.log('Failed to fetch address:', error);
      // Reset selectedAddress on failure
      setSelectedAddress('');
    }
  };

  const handleSaveLocation = () => {
    onSelectLocation({
      latitude: selectedLatitude,
      longitude: selectedLongitude,
      address: selectedAddress,
    });
    onClose(); // Close the modal
    // Move to the next step (2 in this case)
    setCurrentStep(2);
  };

  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.innerContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onCloseMod}>
            <FontAwesome name="times" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Choose Location</Text>
          <View style={styles.searchContainer}>
            <GooglePlacesAutocomplete
              placeholder="Enter address or place"
              minLength={2}
              autoFocus={false}
              returnKeyType={'search'}
              listViewDisplayed="auto" // true/false/undefined
              fetchDetails={true}
              onPress={(data, details = null) => {
                const { geometry } = details;
                const { location } = geometry;
                setSelectedLatitude(location.lat);
                setSelectedLongitude(location.lng);
                setSelectedAddress(data.description);
              }}
              query={{
                key: 'AIzaSyDDVvsCzt1dbSWIIC5wKRji6vW87bGUEcg',
                language: 'en',
              }}
              styles={{
                textInputContainer: {
                  width: '100%',
                  backgroundColor: 'transparent',
                },
                description: {
                  fontWeight: 'bold',
                },
              }}
              currentLocation={false}
            />
          </View>

          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={{
                latitude: selectedLatitude || 0,
                longitude: selectedLongitude || 0,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={handleMapPress}
            >
              <Marker coordinate={{ latitude: selectedLatitude || 0, longitude: selectedLongitude || 0 }} />
            </MapView>
          </View>

          <View style={styles.addressContainer}>
            {selectedAddress ? (
              <Text style={styles.address}>{selectedAddress}</Text>
            ) : null}
          </View>
            <View style={styles.buttonContainer}>
              <Button title="Save Location" onPress={handleSaveLocation} />
            </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  innerContainer: {
    width: '80%', // Adjust the width as needed
    height: '70%', // Adjust the height as needed
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20, // Add padding to create a margin around the modal content
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    marginBottom: 10, // Add margin at the bottom
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  address: {
    fontSize: 16,
    margin: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 1,
  },
  addressContainer: {
    alignItems: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold', // Add this line to make the text bold
    margin: 10,
    textAlign: 'center', // Center the text horizontally
  },
});

export default ChooseLocation;