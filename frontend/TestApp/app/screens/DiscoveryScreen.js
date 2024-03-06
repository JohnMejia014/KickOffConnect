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

const DiscoveryScreen = (userInfo) => {
const BASE_URL = 'http://192.168.1.119:5000';

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
  const [eventAddresses, setEventAddresses] = useState([])
  const [eventsInArea, setEventsInArea] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(true);


  
  const [selectedFilters, setSelectedFilters] = useState({
    selectedSports: [],
    showPublicEvents: true,
    showPrivateEvents: true,
    // Add more filter options here
  });
  const handleEventListClose = () => {
    setEventListVisible(false);
  };
  const joinEvent = async (eventID) => {
    try {
      const response = await axios.post(`${BASE_URL}/joinEvent`, {
        eventID: eventID,
        userID: userInfo.route.params.userInfo.userID,
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
        userID: userInfo.route.params.userInfo.userID,
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
  const handleMarkerPress = (place) => {
    setSelectedPlace(place);
  };
  const handleEventMarkerPress = (inputAddress) => {
    console.log("Setting event list ");
    if (Array.isArray(events[inputAddress])) {
      setEventsList(events[inputAddress]);
      // Set isModalVisible to true when an event marker is pressed
      setEventListVisible(true);
      setIsModalVisible(true); // Add this line to set isModalVisible to true
      setSelectedAddress(inputAddress); // Set the selected address for event list
    } else {
      console.error('Invalid events data:', events);
    }
  };
  

  const handlePlacePopupClose = () => {
    setSelectedPlace(null);
  };
 
  const handleGetEvents = async (eventFilters) => {
    console.log("filters from discovery page ", eventFilters);
    setSelectedFilters(eventFilters);
    try {
      // Make an API call to fetch events
      const response = await axios.post(`${BASE_URL}/getEvents`, {
        latitude: latitude,
        longitude: longitude,
        filters: eventFilters,
      });
  
      // Process the response and update state
      const eventsRetrieved = response.data.events;
      setEvents(eventsRetrieved);
  
      // Update this line to use eventAddresses instead of Object.keys(events)
      const addresses = Object.keys(eventsRetrieved);
      setEventAddresses(addresses);
      setEventsInArea(addresses.length > 0);
      setFilterModalVisible(false);
      console.log('Events Retrieved:', eventsRetrieved);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
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
        setLatitude1(currentLocation.coords.latitude);
        setLongitude1(currentLocation.coords.longitude);
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
        // Fetch location/places data
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
                photos: [], // No photos for this place
              };
            }
          })
        );
  
        setPlaces(placesWithPhotos);
  
        // Fetch events data using fetch
      
      } catch (error) {
        console.error('Error getting location/places or events:', error);
        setErrorMsg('Error getting location/places or events: ' + error.message);
      } finally {
        setMapLoading(false);
      }
    };
  
    // Only fetch data when latitude or longitude changes
    fetchData();
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
      const response = await fetch(`${BASE_URL}/addEvent`, {
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
  
    } catch (error) {
      console.error('Error submitting event to the backend:', error);
      // Handle the error, e.g., show an error message to the user
    }
  };
  
  
  const displayMarkers = () => {
    const markers = places.map((place) => (
      <Marker
        key={`place_${place.place_id}`}
        coordinate={{
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        }}
        title={place.name}
        description={place.vicinity}
        onPress={() => handleMarkerPress(place)}
        pinColor="red"
      />
    ));
  
    const eventMarkers = Object.entries(events).flatMap(([address, eventData]) => {
      const latitude = parseFloat(eventData[0].eventLat);
      const longitude = parseFloat(eventData[0].eventLong);
  
      if (!isNaN(latitude) && !isNaN(longitude)) {
        // Render event marker
        return (
          <Marker
            key={`event_${address}`}
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            onPress={() => handleEventMarkerPress(address)}
            pinColor="blue"
          />
        );
      } else {
        console.error('Invalid coordinates for event:', eventData);
        return null; // Skip rendering this marker
      }
    });
  
    return [...markers, ...eventMarkers];
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
            
            {/* Display markers for events */}
            {displayMarkers()}


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

            {/* Display the retrieved events on the map */}
        
        <TouchableOpacity
            style={styles.getEventsButton}  
           onPress={() => setFilterModalVisible(true)}
              >
           <Text style={{ color: 'black', fontSize: 16 }}>Filter Events</Text>
         </TouchableOpacity>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={handleAddEventButtonPress}
          >
            <Text style={{ color: 'white', fontSize: 24 }}>+</Text>
          </TouchableOpacity>
        </>
      )}

       {isEventListVisible && (
        <EventListComponent events={events[selectedAddress]}
          isModalVisible={isEventListVisible}
          userInfo={userInfo}
          onClose={handleEventListClose}
          leaveEvent={leaveEvent}
          joinEvent={joinEvent}
          />
        )}
        <EventFilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleGetEvents}
        />
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
  getEventsButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'green',  // Set your desired color
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 1,
  },
});

export default DiscoveryScreen;