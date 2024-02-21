import React, { useState } from 'react';
import { View, ScrollView, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import EventPreviewComponent from './EventPreviewComponent';
import EventComponent from './EventComponent';

const EventListComponent = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isListModalVisible, setIsListModalVisible] = useState(false);
    const [isEventModalVisible, setIsEventModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleListModal = () => {
      setIsListModalVisible(!isListModalVisible);
    };
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
      };
      
    const toggleEventModal = () => {
      setIsEventModalVisible(!isEventModalVisible);
    };
  // Sample event data, replace it with your own data
  const events = [
    {
      id: 1,
      eventName: 'Sample Event',
    eventDescription: 'This is a sample event description.',
    eventAddress: '123 Sample St, Sample City',
    eventLat: 37.7749,
    eventLong: -122.4194,
    eventTime: '18:00',
    eventDate: '2024-02-19',
    eventSport: 'Soccer',
    eventHost: 'John Doe',
    eventVisibility: 'Public',
    usersInvited: 50,
    usersJoined: 20,
    },
    {
      id: 2,
      eventName: 'Sample Event',
      eventDescription: 'This is a sample event description.',
      eventAddress: '123 Sample St, Sample City',
      eventLat: 37.7749,
      eventLong: -122.4194,
      eventTime: '18:00',
      eventDate: '2024-02-19',
      eventSport: 'Volleyball',
      eventHost: 'John Doe',
      eventVisibility: 'Public',
      usersInvited: 50,
      usersJoined: 12,
    },
    {
      id: 3,
      eventName: 'Sample Event',
    eventDescription: 'This is a sample event description.',
    eventAddress: '123 Sample St, Sample City',
    eventLat: 37.7749,
    eventLong: -122.4194,
    eventTime: '18:00',
    eventDate: '2024-02-19',
    eventSport: 'Swimming',
    eventHost: 'John Doe',
    eventVisibility: 'Public',
    usersInvited: 50,
    usersJoined: 14,
    },
    // Add more events as needed
  ];

   const handleEventSelection = (event) => {
    // Set the selected event when a preview is clicked
    setSelectedEvent(event);
    toggleEventModal(); // Open the EventComponent modal
  };

  return (
    <View>
      {/* Button to trigger the modal */}
      <TouchableOpacity onPress={toggleModal}>
        <Text>Show Events</Text>
      </TouchableOpacity>

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
      {events.map((event) => (
        <EventPreviewComponent
          key={event.id}
          eventInfo={event}
          onPress={() => handleEventSelection(event)}
        />
      ))}

      {/* Conditionally render EventComponent if an event is selected */}
      {selectedEvent && (
        <EventComponent
          eventInfo={selectedEvent}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedEvent(null); // Reset selected event when modal is closed
          }}
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

export default EventListComponent;

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
    marginBottom: 100
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});


