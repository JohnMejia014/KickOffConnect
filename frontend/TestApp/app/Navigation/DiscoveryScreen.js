// DiscoveryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AddEventComponent from './AddEventComponent';
import { ActivityIndicator } from 'react-native';
const DiscoveryScreen = () => {
  const [location, setLocation] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const defaultLatitude = 37.7749;
  const defaultLongitude = -122.4194;
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isAddEventModalVisible, setAddEventModalVisible] = useState(false);
  const [isMapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setLatitude(currentLocation.coords.latitude);
        setLongitude(currentLocation.coords.longitude);
      } catch (error) {
        console.error('Error getting location: ', error);
        setErrorMsg('Error getting location: ' + error.message);
      }
      finally{
        setMapLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {

      try {
        // ... (existing location request)
        // Fetch nearby places using the Google Places API
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
            `location=${latitude},${longitude}&radius=10000&type=park|gym&key=AIzaSyCFFCJXpMpMapumtoVf5Wnzpp1FynKj3iY`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch places data');
        }

        const data = await response.json();
        setPlaces(data.results);
      } catch (error) {
        console.error('Error getting location/places: ', error);
        setErrorMsg('Error getting location/places: ' + error.message);
      }
      finally{
        setMapLoading(false);
      }
    })();
  }, [latitude, longitude]);

  const handleMarkerPress = (place) => {
    setSelectedPlace(place);
  };

  const handleAddEventButtonPress = () => {
    setAddEventModalVisible(true);
  };

  const handleAddEventSubmit = (eventData) => {
    // Handle the submitted event data (e.g., send it to a server)
    console.log('Submitted Event:', eventData);
    // Close the modal
    setAddEventModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
       {isMapLoading && (
        // Show the activity indicator while the map is loading
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="blue"
        />
      )}
      {location && !isMapLoading &&(
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          provider={MapView.PROVIDER_DEFAULT}
          apiKey="AIzaSyCFFCJXpMpMapumtoVf5Wnzpp1FynKj3iY"
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description={`Lat: ${location.coords.latitude}, Long: ${location.coords.longitude}`}
          />
          {places.map((place) => (
            <Marker
              key={place.place_id}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              description={place.vicinity}
              onPress={() => handleMarkerPress(place)}
            />
          ))}
        </MapView>
      )}

      {/* Add Event Modal */}
      <AddEventComponent
          isVisible={isAddEventModalVisible}
          onClose={() => setAddEventModalVisible(false)}
          onSubmit={handleAddEventSubmit}
          tabBarHeight={1}
/>

      {/* Plus sign button */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={handleAddEventButtonPress}
      >
        <Text style={{ color: 'white', fontSize: 24 }}>+</Text>
      </TouchableOpacity>

      {/* Display additional information for the selected place */}
      {selectedPlace && (
        <View style={styles.selectedPlaceInfo}>
          <Text>{selectedPlace.name}</Text>
          <Text>{selectedPlace.vicinity}</Text>
          {/* Add any other information you want to display */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  plusButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'blue',
    borderRadius: 25,
    padding: 16,
    zIndex: 1,
  },
  selectedPlaceInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    zIndex: 1,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 1,
  },
});

export default DiscoveryScreen;