import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = ({ route }) => {
  const { eventName, eventDescription, selectedSports } = route.params;
  const [selectedDate, setSelectedDate] = useState('');

  const handleAddEvent = () => {
    // Implement your logic to submit the event details
    // You can use the values from route.params along with selectedDate
    // to submit the complete event details.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select Event Date</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        hideExtraDays={true}
        minDate={new Date().toISOString().split('T')[0]}
        markingType="simple"
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'blue' },
        }}
        enableSwipeMonths={true}
      />
      <Button title="Add Event" onPress={handleAddEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default CalendarScreen;