import React, {useState, useEffect} from 'react';
import { View, ScrollView, Modal, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Rating } from 'react-native-ratings';
import EventPreviewComponent from './EventPreviewComponent';
import EventComponent from './EventComponent';
import CreateEvent from './CreateEvent';
const PopUpForPlace = ({ placeInfo, onClose, onAddRating, userInfo, joinEvent, leaveEvent, submitEvent }) => {
  const place = placeInfo.places[0]
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page index
  const events = placeInfo.events
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const latitude = place.geometry.location.lat || 0;
  const longitude = place.geometry.location.lng || 0;
 
  const onAddEvent = () => {
    setShowCreateEvent(true);
  };
  const onSubmitEvent = (eventData) => {
    handleCloseModal();
    onClose();
    submitEvent(eventData);
  };
  const handleCloseModal = () => {
    setShowCreateEvent(false); // Reset state to hide the CreateEvent component
    setSelectedEvent(null); // Reset selected event
  };
  const toggleModal = () => {
    onClose();  // Close the modal when needed
    setSelectedEvent(null);  // Reset selected event when modal is closed
  };
  const handleCloseEvent = () =>{
    setSelectedEvent(null);

}
  const goToNextPage = () => {
    setCurrentPage(2); // Navigate to the second page
  };

  const goToPreviousPage = () => {
    setCurrentPage(1); // Navigate back to the first page
  };
  const handleEventSelection = (event) => {
    setSelectedEvent(event);
  };
  return (
    <Modal transparent={true} animationType="slide" visible={place !== null}>
    <View style={styles.popupContainer}>
      <View style={styles.popupContent}>
      {currentPage === 1 ? (
        <>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome name="times" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.placeName}>{place?.name}</Text>

        {place?.photos && place?.photos.length > 0 && (
          <Image
            source={{ uri: place.photos[0] }}
            style={styles.placePhoto}
            resizeMode="cover"
            onError={(error) => console.error('Image load error:', error)}
          />
        )}

        <Text style ={styles.addressName}>{place?.vicinity}</Text>
        <View style={styles.ratingContainer}>
          <Rating
            type='star'
            ratingCount={5}
            imageSize={20}
            startingValue={place?.rating || 0}
            readonly={true}
            showRating={false}
          />
          <Text style={styles.ratingText}>
            {place?.rating !== null && place?.rating !== undefined
              ? `(${place?.user_ratings_total} ratings)`
              : 'No ratings'}
          </Text>
        </View>
        {/* Create Event Button */}
        <TouchableOpacity
          style={[styles.button, styles.createEventButton]}
          onPress={() => onAddEvent()}
          >
          <Ionicons name="md-add-circle" size={20} color="white" />
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>

        {/* Add Rating Button */}
        {/* <TouchableOpacity
          style={[styles.button, styles.addRatingButton]}
          onPress={onAddRating}
        >
          <Ionicons name="md-star" size={20} color="white" />
          <Text style={styles.buttonText}>Add Rating</Text>
        </TouchableOpacity> */}
         {/* Button to navigate to the next page */}
         <TouchableOpacity style={styles.nextPageButton} onPress={goToNextPage}>
         <Text style={styles.buttonText}>
            View Events ({events.length})
          </Text>

          </TouchableOpacity>



       {showCreateEvent && (
         <CreateEvent
         userInfo={userInfo}
         isVisible={true}
         onClose={() => handleCloseModal()}
         onSubmit={(eventData) => onSubmitEvent(eventData)}
         longitude={longitude}
         latitude={latitude}
        />
)}

     </>
   ) : (
     // Second Page: Additional Content
     <>
       <TouchableOpacity style={styles.closeButton} onPress={onClose}>
         <FontAwesome name="times" size={20} color="black" />
       </TouchableOpacity>
       <View style={styles.eventContainer}>
          

        <ScrollView>
            {/* Display a list of events in the modal */}
            {events.length > 0 ? (
              events.map((event, index) => (
                <EventPreviewComponent
                  key={index.toString()} // Use index as a key (ensure it's unique)
                  eventInfo={event}
                  onPress={() => handleEventSelection(event)}
                />
              ))
            ) : (
              <Text style={styles.noEventsText}>No events</Text>
            )}

            {/* Conditionally render EventComponent if an event is selected */}
            {selectedEvent && (
              <EventComponent
                initialEventInfo={selectedEvent}
                onClose={() => {
                  handleCloseEvent();
                }}
                userInfo ={userInfo}
                leaveEvent={leaveEvent}
                joinEvent={joinEvent}
                onJoinLeave={(isJoined) => {
                  // Handle join/leave logic here
                  console.log('Join/Leave event:', isJoined);
                }}
              />
            )}
          </ScrollView>

        </View>
       {/* Button to navigate back to the first page */}
       <TouchableOpacity style={styles.nextPageButton} onPress={goToPreviousPage}>
         <Text style={styles.buttonText}>Back</Text>
       </TouchableOpacity>
     </>
   )}
      </View>
    </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  popupContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    width: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
  },
  placeName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
    paddingTop: 10,
  },
  placePhoto: {
    width: '100%',
    height: 200, // Adjust the height based on your design
  },
  addressName: {
    fontSize: 13,
    paddingTop: 10,
    fontStyle: 'italic'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  ratingText: {
    marginLeft: 8,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createEventButton: {
    backgroundColor: '#32CD32', // Green color
  },
  addRatingButton: {
    backgroundColor: '#4169E1', // Royal Blue color
  },
  nextPageButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6347', // Tomato color
    alignSelf: 'center',
    paddingHorizontal: 90, // Adjust horizontal padding to match the Create Event button
    paddingVertical:20,
    borderRadius: 5,
    marginTop: 10,
    flexDirection: 'row', // Align text and icon in a row
  },
  
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  noEventsText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonTextWithCount: {
    flexWrap: 'nowrap', // Prevent text wrapping
    overflow: 'hidden', // Hide overflow text if it exceeds the container width
  },
  
  
});

export default PopUpForPlace;
