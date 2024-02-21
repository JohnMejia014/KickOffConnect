import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import EventComponent from './screens/DiscoveryPageComponents/EventComponent'; // Make sure to adjust the import path
import EventListComponent from './screens/DiscoveryPageComponents/EventListComponent';
export default function Page() {
  const [eventInfo, setEventInfo] = useState({
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
  });

  const handleJoinLeave = (isUserJoined) => {
    // Handle logic for joining or leaving the event
    console.log(isUserJoined ? 'User left the event' : 'User joined the event');
    // Update the state or perform other actions as needed
  };
  return (
    <View style={styles.container}>
      {/* Render the EventListComponent */}
      <EventListComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // Add more styles as needed
  },
});