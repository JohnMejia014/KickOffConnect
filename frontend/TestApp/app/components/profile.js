import { Text, View } from 'react-native';
import Button from "./Button";
import route from 'expo-router';
import {useLocation} from "react-router-dom";
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';


import {useState} from "react";


export default function Page() {

    const loc = window.location.search
    const userId = loc.substring(8)
    console.log(userId)

    const[location,setLocation] = useState(null);
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    sendLocationToServer(latitude, longitude);
                },
                (error) => {
                    console.log(error);
                },
                { enableHighAccuracy: true, timout: 20000, maximumAge: 1000 }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    };

    const sendLocationToServer = async (latitude, longitude) => {
        try {
            const response = await fetch('http://192.168.1.14:5000/retrieve-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, latitude, longitude }),
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    return(
        <View>
            <Text>
                Profile page
               <Text> <p>
                   {userId}</p></Text>
                {location && `Latitude: ${location.latitude}, Longitude: ${location.longitude}`}

            </Text>
            <button onClick={getLocation}> Get Location</button>
        </View>
    );
}