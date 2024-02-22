// DiscoveryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AddEventComponent from './DiscoveryPageComponents/AddEventComponent';
import CreateEvent from './DiscoveryPageComponents/CreateEvent';

import { ActivityIndicator } from 'react-native';
import PopUpForPlace from './DiscoveryPageComponents/PopUpForPlace';

const DiscoveryScreen = (userInfo) => {
  const [location, setLocation] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isAddEventModalVisible, setAddEventModalVisible] = useState(false);
  const [isMapLoading, setMapLoading] = useState(true);
  const [createEventVisible, setCreateEventVisible] = useState(false);
  const [tempSelectedPlaceLocation, setTempSelectedPlaceLocation] = useState(null);

  const toggleCreateEventVisibility = () => {
    setCreateEventVisible(!createEventVisible);
  };
  const handleMarkerPress = (place) => {
    setSelectedPlace(place);
    console.log('Number of ratings:', place?.userRatingsTotal);
  };

  const handlePlacePopupClose = () => {
    setSelectedPlace(null);
  };


  const handleAddRating = () => {
    console.log('Add Rating');
  };

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
      } finally {
        setMapLoading(false);
      }
    })();
  }, []);


  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
          `location=${latitude},${longitude}&radius=10000&type=park|gym&key=AIzaSyDDVvsCzt1dbSWIIC5wKRji6vW87bGUEcg`
        );
  
        if (!response.ok) {
          throw new Error('Failed to fetch places data');
        }
  
        const data = await response.json();
        console.log(data);
        const placesWithPhotos = await Promise.all(data.results.map(async (place) => {
          if (place.photos && place.photos.length > 0) {
            const photoUrls = place.photos.map(photo => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyDDVvsCzt1dbSWIIC5wKRji6vW87bGUEcg`);
            return {
              ...place,
              photos: photoUrls,
            };
          } else {
            return {
              ...place,
              photos: [], // No photos for this place
            };
          }
        }));
  
        setPlaces(placesWithPhotos);
      } catch (error) {
        console.error('Error getting location/places: ', error);
        setErrorMsg('Error getting location/places: ' + error.message);
      } finally {
        setMapLoading(false);
      }
    })();
  }, [latitude, longitude]);
  
  const handleAddEventButtonPress = () => {
    // Toggle the visibility of CreateEvent
    setTempSelectedPlaceLocation(null);
    setAddEventModalVisible(!isAddEventModalVisible);
    console.log("Creating New Event");
  };

  const handleAddEventPopUpPress = () => {
    // Set temporary location before toggling the visibility of CreateEvent
    setTempSelectedPlaceLocation({
      latitude: selectedPlace.geometry.location.lat,
      longitude: selectedPlace.geometry.location.lng,
    });
    handlePlacePopupClose();
    setAddEventModalVisible(!isAddEventModalVisible);
    console.log("Creating New Event");
  };

  const handleAddEventSubmit = async (eventData) => {
    console.log(eventData);
    try {
      // Assuming your backend endpoint for creating an event is '/api/createEvent'
      const response = await fetch('http://192.168.1.119:5000/addEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You might need to include additional headers, such as authentication headers
        },
        body: JSON.stringify(eventData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit event to the backend');
      }
  
      // Handle the response from the backend if needed
      const responseData = await response.json();
      console.log('Backend Response:', responseData);
  
      // Close the modal or navigate to the EventDetailsScreen
      setAddEventModalVisible(false);
      // setShowEventDetails(true);
    } catch (error) {
      console.error('Error submitting event to the backend:', error);
      // Handle the error, e.g., show an error message to the user
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      {isMapLoading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="blue" />
      ) : (
        <>
          {location && (
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              provider={MapView.PROVIDER_DEFAULT}
              apiKey="AIzaSyDDVvsCzt1dbSWIIC5wKRji6vW87bGUEcg"
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
  
          {isAddEventModalVisible && (
            <CreateEvent
              userInfo={userInfo}
              isVisible={isAddEventModalVisible}
              onClose={() => setAddEventModalVisible(false)}
              onSubmit={handleAddEventSubmit}
              tabBarHeight={1}
              longitude={
                isAddEventModalVisible && tempSelectedPlaceLocation
                  ? tempSelectedPlaceLocation.longitude
                  : location.coords.longitude
              }
              latitude={
                isAddEventModalVisible && tempSelectedPlaceLocation
                  ? tempSelectedPlaceLocation.latitude
                  : location.coords.latitude
              }
            />
          )}

  
          <TouchableOpacity
            style={styles.plusButton}
            onPress={handleAddEventButtonPress}
          >
            <Text style={{ color: 'white', fontSize: 24 }}>+</Text>
          </TouchableOpacity>
        </>
      )}
  
      <PopUpForPlace
        placeInfo={selectedPlace}
        onClose={handlePlacePopupClose}
        onAddEvent={handleAddEventPopUpPress}
        onAddRating={handleAddRating}
      />
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