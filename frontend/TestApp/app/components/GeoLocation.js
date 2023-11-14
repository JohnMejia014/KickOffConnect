import {Alert, SafeAreaView, TextInput} from "react-native";
import {Platform, StyleSheet, Text, View} from "react-native";
import React, { useEffect, useState } from 'react';
import Button from "./Button";
import {RectButton} from "react-native-gesture-handler";
import axios from 'axios';
import {router} from "expo-router";
import Geolocation from '@react-native-community/geolocation'


export default function getGeolocation(){

    const [location, setLocation] = useState(null);
    
    useEffect(() =>{
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
              },
              error => console.log('Error getting location:', error),
              { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

          // Set up a watch for continuous location updates
        const watchId = Geolocation.watchPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        error => console.log('Error getting location:', error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 }
      );
       // Clean up the watch when the component unmounts
       return () => Geolocation.clearWatch(watchId);
    }, []);

        return (
            <View>
              {location ? (
                <Text>
                  Latitude: {location.latitude}, Longitude: {location.longitude}
                </Text>
              ) : (
                <Text>Loading location...</Text>
              )}
            </View>
          );
};

