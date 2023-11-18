import React, { useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import * as Location from 'expo-location';

export default function Page() {
  const [location, setLocation] = useState(null);
  //const [userId, setUserId] = useState('');
  const loc = window.location.search
  const userId = loc.substring(8)
  console.log(userId)

  useEffect(() => {
    // Assuming userId is set elsewhere in your component or props
    // setUserId(''); // Set your userId here


    // Request permission to access the user's location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      // Get the user's current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      // You can also watch for location updates if needed
      // let subscription = await Location.watchPositionAsync({}, (newLocation) => {
      //   setLocation(newLocation.coords);
      // });

      // Clean up the subscription when the component unmounts
      // return () => subscription.remove();
    })();
  }, []);

  const sendLocationToServer = async () => {
    try {
      const response = await fetch('http://192.168.18.2:5000/retrieve-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, ...location }),
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Profile page</Text>
      <Text>{userId}</Text>
      {location && <Text>Latitude: {location.latitude}, Longitude: {location.longitude}</Text>}
      <Button title="Get Location" onPress={sendLocationToServer} />
    </View>
  );
}