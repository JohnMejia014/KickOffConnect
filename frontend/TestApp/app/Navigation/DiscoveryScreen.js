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

  const circleCoordinates = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
    : {
        latitude: defaultLatitude,
        longitude: defaultLongitude,
      };

  return (
    <View style={{ flex: 1 }}>
      {location && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          provider={MapView.PROVIDER_DEFAULT}
          apiKey="AIzaSyCFFCJXpMpMapumtoVf5Wnzpp1FynKj3iY"
        >
          <Circle
            center={circleCoordinates}
            radius={500}
            fillColor="rgba(255, 0, 0, 0.2)"
            strokeColor="rgba(255, 0, 0, 0.8)"
          />
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description={`Lat: ${location.coords.latitude}, Long: ${location.coords.longitude}`}
          />
        </MapView>
      )}
    </View>
  );
};

export default DiscoveryScreen;