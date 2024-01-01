import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const EventDetailsScreen = ({ navigation }) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedSports, setSelectedSports] = useState([]);

  const handleContinue = () => {
    navigation.navigate('CalendarScreen', {
      eventName,
      eventDescription,
      selectedSports,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputField}
        placeholder="Event Name"
        value={eventName}
        onChangeText={(text) => setEventName(text)}
      />
      <TextInput
        style={styles.inputField}
        placeholder="Event Description"
        value={eventDescription}
        onChangeText={(text) => setEventDescription(text)}
      />
      {/* Add your sport selection here */}
      <Button title="Continue" onPress={handleContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputField: {
    height: 40,
    borderColor: '#333',
    borderWidth: 2,
    marginBottom: 15,
    padding: 10,
    color: '#000',
    backgroundColor: '#fff',
  },
});

export default EventDetailsScreen;