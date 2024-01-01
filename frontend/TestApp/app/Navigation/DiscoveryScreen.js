// DiscoveryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AddingEventComponent from './AddingEventComponent';
import AddEventComponent from './AddEventComponent';
import CreateEvent from './CreateEvent';

import { ActivityIndicator } from 'react-native';
import PopUpForPlace from './PopUpForPlace';
import { useNavigation } from '@react-navigation/native';

const DiscoveryScreen = () => {
  const [location, setLocation] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isAddEventModalVisible, setAddEventModalVisible] = useState(false);
  const [isMapLoading, setMapLoading] = useState(true);
 
  const handleMarkerPress = (place) => {
    setSelectedPlace(place);
    console.log('Number of ratings:', place?.userRatingsTotal);
  };

  const handlePlacePopupClose = () => {
    setSelectedPlace(null);
  };

  const handleAddEvent = (address) => {
    console.log('Create Event at:', address);
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
          `location=${latitude},${longitude}&radius=10000&type=park|gym&key=AIzaSyCFFCJXpMpMapumtoVf5Wnzpp1FynKj3iY`
        );
  
        if (!response.ok) {
          throw new Error('Failed to fetch places data');
        }
  
        const data = await response.json();
        console.log(data);
        const placesWithPhotos = await Promise.all(data.results.map(async (place) => {
          if (place.photos && place.photos.length > 0) {
            const photoUrls = place.photos.map(photo => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyCFFCJXpMpMapumtoVf5Wnzpp1FynKj3iY`);
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
    setAddEventModalVisible(!isAddEventModalVisible);
  };

  const handleAddEventSubmit = (eventData) => {
    console.log('Submitted Event:', eventData);
    setAddEventModalVisible(false);
    onClose(); // Add this line to close the modal
    // If needed, you can navigate to the EventDetailsScreen here
    // setShowEventDetails(true);
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

            {isAddEventModalVisible && (
            <CreateEvent
              isVisible={isAddEventModalVisible}
              onClose={() => setAddEventModalVisible(false)}
              onSubmit={handleAddEventSubmit}
              tabBarHeight={1}
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
        onAddEvent={(address) => handleAddEvent(address)}
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