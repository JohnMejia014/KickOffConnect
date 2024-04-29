// DiscoveryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AddEventComponent from './DiscoveryPageComponents/AddEventComponent';
import CreateEvent from './DiscoveryPageComponents/CreateEvent';
import EventListComponent from './DiscoveryPageComponents/EventListComponent';
import { ActivityIndicator } from 'react-native';
import PopUpForPlace from './DiscoveryPageComponents/PopUpForPlace';
import axios from 'axios';
import EventFilterModal from './DiscoveryPageComponents/EventFilterModal';
import EventParkMarkers from './DiscoveryPageComponents/EventParkMarkers';
import { useIsFocused } from '@react-navigation/native'; // Import useIsFocused hook

const DiscoveryScreen = ({route}) => {
  const BASE_URL = 'http://192.168.1.119:5000';
  const [userInfo, setUserInfo] = useState(route.params?.userInfo || {});
  const [location, setLocation] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [longitude1, setLongitude1] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [latitude1, setLatitude1] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isAddEventModalVisible, setAddEventModalVisible] = useState(false);
  const [isMapLoading, setMapLoading] = useState(true);
  const [createEventVisible, setCreateEventVisible] = useState(false);
  const [tempSelectedPlaceLocation, setTempSelectedPlaceLocation] = useState(null);
  const [events, setEvents] = useState({});
  const [eventsList, setEventsList] = useState([]);
  const [isEventListVisible, setEventListVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [eventAddresses, setEventAddresses] = useState([]);
  const [eventsInArea, setEventsInArea] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedPlaceEvent, setSelectedPlaceEvent] = useState(null);
  const [placesByAddress, setPlacesByAddress] = useState({});
  const [eventsByAddress, setEventsByAddress] = useState({});
  const [placesFetched, setPlacesFetched] = useState(false);
  const [plusORAddButton, setPlusORAddButton] = useState(null);
  const [eventAdded, setEventAdded] = useState(false);
  const isFocused = useIsFocused(); // Hook to check if the screen is focused

  const currentDate = new Date().toISOString().slice(0, 10); // Get current date in "YYYY-MM-DD" format

const [selectedFilters, setSelectedFilters] = useState({
  selectedStartDate: currentDate,
  selectedEndDate: currentDate,
  selectedSports: [],
  selectedVisibility: 'both',
  showPublicEvents: true,
  showPrivateEvents: true,
  // Add more filter options here
});
// Assuming 'isFocused', 'selectedFilters', 'handleGetEvents', and 'userInfo' are defined in your component's state
// Also assuming 'BASE_URL' is defined elsewhere in your code
console.log("userInfo: ", userInfo);
useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getUserInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userInfo.userID }), // Use userInformation.userID in the request body
      });
      const data = await response.json();

      console.log("data: ", data);
      setUserInfo(data.userInfo); // Update userInfo state
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  // Fetch user info when component mounts
  fetchUserInfo();
}, [isFocused]);

useEffect(() => {
  const fetchData = async () => {
    // Fetch data again when the component is focused
    if (isFocused && placesFetched ) {
      console.log("selectedFilters: ", selectedFilters);
      const response = await fetch(`${BASE_URL}/getEvents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters: selectedFilters }),
      });
      const eventData = await response.json();
      //handleGetEvents(eventData); // Update events state or handle the data as needed
    }
  };

  fetchData(); // Initial fetch when component mounts

  // Cleanup function
  return () => {
    // Optionally perform cleanup or clear any subscriptions
  };
}, [isFocused]);

// Render your component content here

  useEffect(() => {
    if (eventAdded) {
      handleGetEvents(selectedFilters);
      setEventAdded(false); // Reset eventAdded after calling handleGetEvents
    }
  }, [eventAdded]);

  const handleEventListClose = () => {
    setEventListVisible(false);
  };

  const joinEvent = async (eventID) => {
    try {
      const response = await axios.post(`${BASE_URL}/joinEvent`, {
        eventID: eventID,
        userID: userInfo.userID,
      });

      if (response.data.success) {
        console.log(response.data.message);
        const updatedEventInfo = response.data.event;
        await handleGetEvents(selectedFilters); // Assuming getEvents is updated to handle the filters
        return updatedEventInfo;
      } else {
        throw new Error('Failed to join the event');
      }
    } catch (error) {
      console.error('Error joining event:', error);
      throw new Error('Failed to join the event');
    }
  };

  const leaveEvent = async (eventID) => {
    try {
      const response = await axios.post(`${BASE_URL}/leaveEvent`, {
        eventID: eventID,
        userID: userInfo.userID,
      });

      if (response.data.success) {
        console.log(response.data.message);
        const updatedEventInfo = response.data.event;
        await handleGetEvents(selectedFilters); // Assuming getEvents is updated to handle the filters
        return updatedEventInfo;
      } else {
        throw new Error('Failed to leave the event');
      }
    } catch (error) {
      console.error('Error leaving event:', error);
      throw new Error('Failed to leave the event');
    }
  };

  const toggleCreateEventVisibility = () => {
    setCreateEventVisible(!createEventVisible);
  };

  
  const handleMarkerPress = (placeData) => {
    setSelectedPlaceEvent(placeData);
    //console.log("place data: ", placeData);
  };

//   const handleEventMarkerPress = (inputAddress) => {
//     if (Array.isArray(events[inputAddress])) {
//       setEventsList(events[inputAddress]);
//       setEventListVisible(true);
//       setIsModalVisible(true);
//       setSelectedAddress(inputAddress);
//     } else {
//       console.error('Invalid events data:', events);
//     }
//   };

  const handleGetEvents = async (eventFilters) => {
    console.log("event filters: ", eventFilters);
    setSelectedFilters(eventFilters);
    try {
      const response = await axios.post(`${BASE_URL}/getEvents`, {
        userID: userInfo.userID,
        latitude: latitude,
        longitude: longitude,
        filters: eventFilters,
        places: places
      });

      const eventsRetrieved = response.data.events;
      setEvents(eventsRetrieved);
      setPlacesByAddress(eventsRetrieved);
      // Combine events with existing places data
      console.log("Events retrieved: ", eventsRetrieved);
      if (eventsRetrieved && typeof eventsRetrieved === 'object') {
      } else {
        console.log('No events retrieved or eventsRetrieved is not an array');
      }
     
      const addresses = Object.keys(eventsRetrieved);
      setEventAddresses(addresses);
      setEventsInArea(addresses.length > 0);
      setFilterModalVisible(false);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
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
    const fetchData = async () => {
      try {
        const placesResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
          `location=${latitude},${longitude}&radius=10000&type=park|gym&key=AIzaSyDDVvsCzt1dbSWIIC5wKRji6vW87bGUEcg`
        );

        if (!placesResponse.ok) {
          throw new Error('Failed to fetch places data');
        }

        const placesData = await placesResponse.json();
        const placesWithPhotos = await Promise.all(
          placesData.results.map(async (place) => {
            if (place.photos && place.photos.length > 0) {
              const photoUrls = await Promise.all(
                place.photos.map(async (photo) => {
                  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyDDVvsCzt1dbSWIIC5wKRji6vW87bGUEcg`;
                })
              );
              return {
                ...place,
                photos: photoUrls,
              };
            } else {
              return {
                ...place,
                photos: [],
              };
            }
          })
        );
        setPlaces(placesWithPhotos);
        console.log("placesWithPhotos", placesWithPhotos);
        setPlacesFetched(true);
        setFilterModalVisible(true);

        // Update the state with combined data
        console.log("fetching places done");
    } catch (error) {
        console.error('Error getting location/places or events:', error);
        setErrorMsg('Error getting location/places or events: ' + error.message);
      } finally {
        setMapLoading(false);
      }
    };

    fetchData();
    console.log("Finished fetching places");
  }, [latitude, longitude, isFocused]);
  
  const handleAddEventButtonPress = () => {
    setTempSelectedPlaceLocation(null);
    setSelectedPlaceEvent(null);
    setAddEventModalVisible(!isAddEventModalVisible);
    console.log("Creating New Event");
    console.log("Setting temp and modal visibility: ", tempSelectedPlaceLocation, isAddEventModalVisible);
  };

//   const handleAddEventPopUpPress = () => {
  
//     setTempSelectedPlaceLocation({
//       latitude: selectedPlaceEvent.places[0].geometry.location.lat,
//       longitude: selectedPlaceEvent.places[0].geometry.location.lng,
//     });
//     console.log("TempSelectedPlaceLocation: ", tempSelectedPlaceLocation);
//     setSelectedPlaceEvent(null);
//     console.log("isAddEvenModalVisible: ", isAddEventModalVisible);
//     setAddEventModalVisible(!isAddEventModalVisible);
//     console.log("isAddEvenModalVisible: ", isAddEventModalVisible);
//   };

  const handleAddEventSubmit = async (eventData) => {
    console.log(eventData);
    try {
      const response = await fetch(`${BASE_URL}/addEvent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit event to the backend');
      }

      const responseData = await response.json();
      setEventAdded(true); // Reset eventAdded after calling handleGetEvents
      console.log('Backend Response:', responseData);
    } catch (error) {
      console.error('Error submitting event to the backend:', error);
    }
  };
  const handleAddEventSubmit2 = async (selectedFriends, eventID) => {
    console.log("selected friends in discovery: ", selectedFriends);
    try {
        const dataToSend = {
            selectedFriends: selectedFriends,
            eventID: eventID
        };

        const response = await fetch(`${BASE_URL}/inviteFriends`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            throw new Error('Failed to invite friends to the backend');
        }

        // Handle successful response here
    } catch (error) {
        // Handle error here
        console.error('Error inviting friends:', error);
    }
}


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
               {/* Render EventMarkers component */}
               {Object.keys(placesByAddress).map((address) => (
            <Marker
              key={address}
              coordinate={{
                latitude:
                  placesByAddress[address].places[0]?.geometry?.location.lat ||
                  placesByAddress[address].events[0]?.eventLat ||
                  0,
                longitude:
                  placesByAddress[address].places[0]?.geometry?.location.lng ||
                  placesByAddress[address].events[0]?.eventLong ||
                  0,
              }}
              title={address}
              onPress={() => handleMarkerPress(placesByAddress[address])}
              // Set marker color based on the condition
              pinColor={placesByAddress[address].places.length > 0 ? 'red' : 'blue'}
            />
          ))}

              </MapView>
          )}

          {/* Render the EventParkMarkers component when a marker is selected */}
            {selectedPlaceEvent && (
                <EventParkMarkers
                isVisible={true} // Set this to true when the component should be visible
                placeInfo={selectedPlaceEvent}
                onClose={() => setSelectedPlaceEvent(null)} // Close the component when needed
                joinEvent ={joinEvent}
                leaveEvent={leaveEvent}
                userInfo={userInfo}
                addEvent={() => handleAddEventButtonPress()}
                handleAddEventSubmit={handleAddEventSubmit}
                submitEvent={handleAddEventSubmit}
                />
            )}



          { isAddEventModalVisible && (
            <CreateEvent
              userInfo={userInfo}
              isVisible={isAddEventModalVisible}
              onClose={() => setAddEventModalVisible(false)}
              onSubmit={handleAddEventSubmit}
              onSubmit2={handleAddEventSubmit2}
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
            style={styles.getEventsButton}
            onPress={() => {
              if (placesFetched) {
                setFilterModalVisible(true);
              } else {
                console.log('Places data not fetched yet.');
              }
            }}
          >
            <Text style={{ color: 'black', fontSize: 16 }}>Filter Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={handleAddEventButtonPress}
          >
            <Text style={{ color: 'black', fontSize: 24 }}>+</Text>
          </TouchableOpacity>
        </>
      )}
      <EventFilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleGetEvents}
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
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 1,
  },
  getEventsButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 1,
  },
});

export default DiscoveryScreen;
