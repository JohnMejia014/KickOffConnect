import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import EventPreviewComponent from './EventPreviewComponent';
import EventComponent from './EventComponent';

const ProfileEventList = ({ events, userInfo, leaveEvent, joinEvent, isProfilePage }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventSelection = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseEvent = () => {
    setSelectedEvent(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Display a list of events */}
      {events.length > 0 ? (
        events.map((event) => (
          <EventPreviewComponent
            key={event.eventName}
            eventInfo={event}
            onPress={() => handleEventSelection(event)}
          />
        ))
      ) : (
        <View style={[styles.eventPreviewContainer, styles.noEventsContainer]}>
          <Text style={styles.noEventsText}>No events available</Text>
        </View>
      )}

      {/* Conditionally render EventComponent if an event is selected */}
      {selectedEvent && (
        <EventComponent
          initialEventInfo={selectedEvent}
          onClose={handleCloseEvent}
          userInfo={userInfo}
          leaveEvent={leaveEvent}
          joinEvent={joinEvent}
          onJoinLeave={(isJoined) => {
            // Handle join/leave logic here
            console.log('Join/Leave event:', isJoined);
          }}
          isProfilePage={isProfilePage}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
  },
  eventPreviewContainer: {
    width: '80%', // Adjust width as needed
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  noEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%', // Adjust width as needed
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  noEventsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
});

export default ProfileEventList;
