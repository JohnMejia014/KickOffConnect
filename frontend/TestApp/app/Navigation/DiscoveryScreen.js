// DiscoveryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native';
import * as Location from 'expo-location';

const DiscoveryScreen = () => {
  const [location, setLocation] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const defaultLatitude = 37.7749;
  const defaultLongitude = -122.4194;
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleMarkerPress = (place) => {
    setSelectedPlace(place);
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
        const lattt = location.coords.latitude
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
        console.log("Response = ")
        console.log(response);

        if (!response.ok) {
          throw new Error('Failed to fetch places data');
        }

        const data = await response.json();
        console.log("Data = ")
        console.log(data);
        console.log("Data.results = ")
        console.log(data.results);
        setPlaces(data.results);
      } catch (error) {
        console.error('Error getting location/places: ', error);
        setErrorMsg('Error getting location/places: ' + error.message);
      }
    })();
  }, [latitude, longitude]);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location.latitude);
    text += JSON.stringify(location.longitude);
    // Log the coordinates
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
  }

  // Set initial region and circle coordinates based on location or defaults
  const initialRegion = {
    latitude: location ? location.coords.latitude : defaultLatitude,
    longitude: location ? location.coords.longitude : defaultLongitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

console.log(places);
  return (
    <View style={{ flex: 1 }}>
      {location && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={initialRegion}
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
              onPress={() => handleMarkerPress(place)} // Handle marker press
            />
          ))}
            {/* Display additional information for the selected place */}
                {selectedPlace && (
           <  View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'white' }}>
             <Text>{selectedPlace.name}</Text>
              <Text>{selectedPlace.vicinity}</Text>
              {/* Add any other information you want to display */}
            </View>
    )}
        </MapView>
      )}
    </View>
  );
};

export default DiscoveryScreen;