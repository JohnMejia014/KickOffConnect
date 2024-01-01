import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

const AddingEventComponent = ({ isVisible, onClose, onSubmit }) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [timeRange, setTimeRange] = useState({ start: '', end: '' });
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleAddEvent = () => {
    // Handle form submission logic
    if (
      eventName.trim() !== '' &&
      eventDescription.trim() !== '' &&
      selectedDate !== '' &&
      timeRange.start.trim() !== '' &&
      timeRange.end.trim() !== ''
    ) {
      onSubmit({
        eventName: eventName,
        eventDescription: eventDescription,
        sports: selectedSports,
        date: selectedDate,
        timeRange: timeRange,
        isPublic: isPublic,
      });
      onClose();
    } else {
      // Display an error or prompt the user to fill in all required fields
    }
  };

  const sports = [
    'Soccer',
    'Basketball',
    'Tennis',
    'Volleyball',
    'Swimming',
    'Golf',
    'Baseball',
    'Hockey',
    'Cricket',
    'Rugby',
    'Football',
  ];

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              scrollEventThrottle={200}
              decelerationRate="fast"
              onScroll={(event) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                const newIndex = Math.round(offsetX / 200); // Assuming a fixed width of 200
                setCurrentScreen(newIndex);
              }}
            >
              {/* First Screen */}
              <View style={styles.modalContent}>
                <Text style={styles.modalHeaderText}>Basic Information</Text>
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
                <TouchableOpacity
                  style={styles.inputField}
                  onPress={() => setShowPickerModal(true)}
                >
                  <Text>{selectedSports.length > 0 ? selectedSports.join(', ') : 'Select Sports'}</Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
                <Button title="Next" onPress={() => setCurrentScreen(1)} />
              </View>

              {/* Second Screen */}
              <View style={styles.modalContent}>
                <Text style={styles.modalHeaderText}>Date and Time</Text>
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
                <TextInput
                  style={styles.inputField}
                  placeholder="Start Time"
                  value={timeRange.start}
                  onChangeText={(text) => setTimeRange({ ...timeRange, start: text })}
                />
                <TextInput
                  style={styles.inputField}
                  placeholder="End Time"
                  value={timeRange.end}
                  onChangeText={(text) => setTimeRange({ ...timeRange, end: text })}
                />
                <Button title="Previous" onPress={() => setCurrentScreen(0)} />
                <Button title="Add Event" onPress={handleAddEvent} />
                <Button title="Cancel" onPress={onClose} />
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  scrollView: {
    flexDirection: 'row',
    width: '200%', // Set the total width of both screens
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%', // Adjusted to take the full width of the ScrollView
  },
  modalHeaderText: {
    fontSize: 24,
    marginBottom: 10,
  },
  inputField: {
    height: 40,
    borderColor: '#333',
    borderWidth: 2,
    marginBottom: 15,
    padding: 10,
    color: '#000',
    backgroundColor: '#fff',
    position: 'relative', // Ensure relative positioning for the dropdown arrow
  },
  dropdownArrow: {
    position: 'absolute',
    right: 10, // Adjust the position as needed
    top: '50%', // Adjust the position as needed
    transform: [{ translateY: -10 }], // Adjust the translateY to center the arrow vertically
    fontSize: 16,
  },
});

export default AddingEventComponent;
