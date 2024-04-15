import React, { useState, useEffect } from 'react';
import { View, ScrollView, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import EventPreviewComponent from './EventPreviewComponent';
import EventComponent from './EventComponent';

const EventListComponent = ({ events, isModalVisible, onClose, userInfo, leaveEvent, joinEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const toggleModal = () => {
    onClose();  // Close the modal when needed
    setSelectedEvent(null);  // Reset selected event when modal is closed
  };

  const handleEventSelection = (event) => {
    setSelectedEvent(event);
  };
  const handleCloseEvent = () =>{
      setSelectedEvent(null);

  }
    // Function to handle closing the event list modal
    const handleEventListClose = () => {
      setEventListVisible(false);
    };

  useEffect(() => {
    // Reset selected event when modal visibility changes
    if (!isModalVisible) {
      setSelectedEvent(null);
    }
  }, [isModalVisible]);

  return (
    <View>
      {/* Modal for displaying the list of events */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => {
          toggleModal();
        }}
      >
        <View style={styles.modalContainer}>
          {/* Close button at the top-right corner */}
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text>Close</Text>
          </TouchableOpacity>

          <ScrollView>
            {/* Display a list of events in the modal */}
            {events.length > 0 ? (
              events.map((event) => (
                <EventPreviewComponent
                  key={event.eventID}
                  eventInfo={event}
                  onPress={() => handleEventSelection(event)}
                />
              ))
            ) : (
              <Text>No events available</Text>
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
      </Modal>
      {/* EventComponent displayed within the modal when an event is selected */}
    </View>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop: 100,
    width: '90%', // Adjust the width as needed
    alignSelf: 'center',
    borderRadius: 10, // Adjust the borderRadius as needed
    overflow: 'hidden',
    marginBottom: 100,
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});
export default EventListComponent;
