import React, { useState, useEffect } from 'react';
import { ScrollView,View, Text, TextInput, Button, Modal, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can change the icon set based on your preference
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome } from 'react-native-vector-icons';

const AddEventComponent = ({ isVisible, onClose, onSubmit }) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedSports, setSelectedSports] = useState([]);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [shouldShowShareEventComponent, setShouldShowShareEventComponent] = useState(false);
  const [timeRange, setTimeRange] = useState({ start: '', end: '' });
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const defaultEndTime = new Date();
    defaultEndTime.setHours(16, 30);

    const handleAddEvent = () => {
      // Validate event name
      if (!eventName.trim()) {
        console.log('Please enter a valid event name.');
        return;
      }
    
      // Validate selected sports
      if (selectedSports.length === 0) {
        console.log('Please select at least one sport.');
        return;
      }
    
      // Validate selected date
      if (!selectedDate) {
        console.log('Please select a date.');
        return;
      }
    
      // Validate start and end times
      if (timeRange.start === '' || timeRange.end === '') {
        console.log('Please select both start and end times.');
        return;
      }
    
      const startTime = new Date(`2023-01-01 ${timeRange.start}`);
      const endTime = new Date(`2023-01-01 ${timeRange.end}`);
    
      if (startTime >= endTime) {
        console.log('End time must be after the start time.');
        return;
      }
    
      // All validations passed, proceed to the next page
      console.log('Event submitted successfully!');
      onSubmit({
        eventName: eventName,
        eventDescription: eventDescription,
        sports: selectedSports,
        date: selectedDate,
        timeRange: { start: timeRange.start, end: timeRange.end },
      });
    };
    
  const showStartTimePicker = () => {
    setStartTimePickerVisible(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisible(false);
  };

  const handleStartTimeConfirm = (time) => {
    // Format the selected start time
    const formattedStartTime = time.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
    console.log(formattedStartTime);
    setTimeRange((prev) => ({ ...prev, start: formattedStartTime }));
    hideStartTimePicker();
  };
  const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
  const handleEndTimeConfirm = (time) => {
    // Format the selected end time
    const formattedEndTime = time.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  
    setTimeRange((prev) => ({ ...prev, end: formattedEndTime }));
    hideEndTimePicker();
  };  
  
  const showEndTimePicker = () => {
    setEndTimePickerVisible(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisible(false);
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
    'Football'
    // Add more sports as needed
  ];
  const sportIcons = {
    Soccer: 'football',
    Basketball: 'basketball',
    Tennis: 'tennis-ball',
    Volleyball: 'volleyball',
    Swimming: 'swim',
    Golf: 'golf',
    Baseball: 'baseball-bat',
    Hockey: 'hockey-puck',
    Cricket: 'cricket',
    Rugby: 'rugby',
    Football: 'football'
    // Add more sports and their corresponding icons as needed
  };



  const [modalDimensions, setModalDimensions] = useState({ width: 0, height: 0 });

  const handleOverlayPress = (e) => {
    const { width, height } = modalDimensions;
    const isInsideModal =
      e.nativeEvent.locationX >= 0 &&
      e.nativeEvent.locationX <= width &&
      e.nativeEvent.locationY >= 0 &&
      e.nativeEvent.locationY <= height;
  
    if (!isInsideModal) {
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.overlay}>
            <View
              style={styles.modalContainer}
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setModalDimensions({ width, height });
              }}
            >
            <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome name="times" size={24} color="black" />
            </TouchableOpacity>
              <Text style={styles.modalHeaderText}>Add Event</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Event Name"
                placeholderTextColor={styles.inputPlaceholder.color}
                value={eventName}
                onChangeText={(text) => setEventName(text)}
              />
              <TextInput
                style={[styles.inputField, styles.multilineInput]}
                placeholder="Event Description (max 200 characters)"
                placeholderTextColor={styles.inputPlaceholder.color}
                value={eventDescription}
                onChangeText={(text) => {
                  // Limit text to 200 characters
                  if (text.length <= 200) {
                    setEventDescription(text);
                  }
                }}
                multiline={true}
                numberOfLines={undefined}
                maxLength={200}
              />
              <TouchableOpacity
                style={styles.inputField}
                onPress={() => setShowPickerModal(true)}
              >
                <Text>{selectedSports.length > 0 ? selectedSports.join(', ') : 'Select Sports'}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              <Modal
                visible={showPickerModal}
                transparent={true}
                animationType="slide"
              >
                <View style={styles.pickerModalContainer}>
                  <View style={styles.pickerModalContent}>
                  {sports.map((sport) => (
                    <TouchableOpacity
                      key={sport}
                      style={styles.checkboxContainer}
                      onPress={() => {
                        const updatedSports = selectedSports.includes(sport)
                          ? selectedSports.filter((selectedSport) => selectedSport !== sport)
                          : [...selectedSports, sport];
                        setSelectedSports(updatedSports);
                      }}
                    >
                      <CheckBox
                        checked={selectedSports.includes(sport)}
                        containerStyle={{ marginRight: 10, padding: 0 }}
                        onPress={() => {
                          const updatedSports = selectedSports.includes(sport)
                            ? selectedSports.filter((selectedSport) => selectedSport !== sport)
                            : [...selectedSports, sport];
                          setSelectedSports(updatedSports);
                        }}
                      />
                      <Text style={{ marginLeft: 10 }}>{sport}</Text>
                      {sportIcons[sport] && (
                        <>
                          {(sport === 'Soccer') ? (
                            <Ionicons
                              name={sportIcons[sport]}
                              size={20}
                              color="black"
                              style={{ marginLeft: 10 }}
                            />
                          ) : (
                            <MaterialCommunityIcons
                              name={sportIcons[sport]}
                              size={20}
                              color="black"
                              style={{ marginLeft: 10 }}
                            />
                          )}
                        </>
                      )}
                    </TouchableOpacity>
                  ))}
                    <Button title="Done" onPress={() => setShowPickerModal(false)} />
                  </View>
                </View>
              </Modal>
              <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                hideExtraDays={true}
                minDate={currentDate}
                markingType="simple"
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: 'blue' },
                }}
                enableSwipeMonths={true}
              />
                <TouchableOpacity style={styles.inputField} onPress={showStartTimePicker}>
                  <Text>{timeRange.start !== '' ? `Start Time: ${(timeRange.start)}` : 'Select Start Time'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputField} onPress={showEndTimePicker}>
                  <Text>{timeRange.end !== '' ? `End Time: ${(timeRange.end)}` : 'Select End Time'}</Text>
                </TouchableOpacity>

               <DateTimePickerModal
                    isVisible={isStartTimePickerVisible}
                    mode="time"
                    date={defaultEndTime} // Set default time to 4:30 PM
                    minuteInterval={15} // Set the minute interval to 15 minutes
                    onConfirm={handleStartTimeConfirm}
                    onCancel={hideStartTimePicker}
                  />
              <DateTimePickerModal
                    isVisible={isEndTimePickerVisible}
                    mode="time"
                    date={defaultEndTime} // Set default time to 4:30 PM
                    minuteInterval={15} // Set the minute interval to 15 minutes
                    onConfirm={handleEndTimeConfirm}
                    onCancel={hideEndTimePicker}
                  />
              <Button style={styles.ContinueButton} title="Continue" onPress={handleAddEvent} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    padding: 30, // Add padding to avoid content at the edges
    marginTop: 50,
  },
  modalContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden', // Ensure borderRadius is respected
    height: '95%', // Adjust the height as needed
  },
  modalContent: {
    padding: 20,
    width: '100%', // Use 100% width
  },
  pickerModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  pickerModalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
  },
  modalHeaderText: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  inputField: {
    height: 40,
    borderColor: '#333',
    borderWidth: 2,
    marginBottom: 15,
    padding: 10,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 10, // Add border radius for rounded corners
  },
  inputPlaceholder: {
    color: '#888',
  },
  dropdownArrow: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: 0 }], // Adjust translateY to center the arrow vertically
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeRangeContainer: {
    marginBottom: 15,
  },
  multilineInput: {
    minHeight: 80, // Set a minimum height for the multiline input
    textAlignVertical: 'top', // Start input from the top
  },
  ContinueButton: {
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default AddEventComponent;