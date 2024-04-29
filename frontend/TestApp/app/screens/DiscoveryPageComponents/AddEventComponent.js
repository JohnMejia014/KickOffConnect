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
import ErrorMessageModal from './ErrorMessageModal';

const AddEventComponent = ({ isVisible, onClose, onSubmit, initialEventData, onBack}) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedSports, setSelectedSports] = useState([]);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [timeRange, setTimeRange] = useState({ start: '', end: '' });
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const defaultEndTime = new Date();
    defaultEndTime.setHours(16, 30);
  const [errorMessage, setErrorMessage] = useState(null);


    useEffect(() => {
      console.log('Initial Data: ' + initialEventData);
      // Check if initialEventData is provided and update the state
      if (initialEventData) {
        setEventName(initialEventData.eventName || '');
        setEventDescription(initialEventData.eventDescription || '');
        setSelectedSports(initialEventData.eventSports || []);
        setSelectedDate(initialEventData.eventDate || '');
        setTimeRange({
          start: initialEventData.eventTime ? initialEventData.eventTime.start : '',
          end: initialEventData.eventTime ? initialEventData.eventTime.end : '',
        });
      }
    }, [initialEventData]);

    const handleAddEvent = () => {
      // Clear any existing error message
      setErrorMessage(null);
    
      // Validate event name
      if (!eventName.trim()) {
        setErrorMessage('Please enter a valid event name.');
        return;
      }
    
      // Validate selected sports
      if (selectedSports.length === 0) {
        setErrorMessage('Please select at least one sport.');
        return;
      }
    
      // Validate selected date
      if (!selectedDate) {
        setErrorMessage('Please select a date.');
        return;
      }
    
      // Check for empty start or end times
      if (!timeRange.start.trim() || !timeRange.end.trim()) {
        setErrorMessage('Start time or End time cannot be empty.');
        return;
      }
    
      // Validate time range
      if (!isValidTimeRange()) {
        setErrorMessage('End time must be greater than Start time.');
        return;
      }
    
      // All validations passed, proceed to the next page
      console.log('Event submitted successfully!');
      onSubmit({
        eventName: eventName,
        eventDescription: eventDescription,
        eventSports: selectedSports,
        eventDate: selectedDate,
        eventTime: { start: timeRange.start, end: timeRange.end },
      });
    };
    
    
    const isValidTimeRange = () => {
      try {
        if (!timeRange.start || !timeRange.end) {
          throw new Error('Start time or end time is missing.');
        }
    
        // Compare time strings directly
        return timeRange.start < timeRange.end;
      } catch (error) {
        console.error('Error in isValidTimeRange:', error.message);
        return false;
      }
    };
    
  const handleBackToChooseLocation = () => {
      // Notify the parent component (CreateEvent) to go back to ChooseLocation
      onBack();
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
  const currentDates = new Date();
    currentDates.setHours(0, 0, 0, 0);
  const currentDate = currentDates.toISOString().split('T')[0];
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
            <ScrollView contentContainerStyle={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome name="times" size={20} color="black" />
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
                style={styles.calendar} // Add this line
              />
                <TouchableOpacity style={styles.inputField} onPress={showStartTimePicker}>
                  <Text>{timeRange.start !== '' ? `Start Time: ${(timeRange.start)}` : 'Select Start Time'}</Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputField} onPress={showEndTimePicker}>
                  <Text>{timeRange.end !== '' ? `End Time: ${(timeRange.end)}` : 'Select End Time'}</Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
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
              </ScrollView>
          {/* Buttons in a row */}
          <View style={styles.buttonContainer}>
              <Button style={styles.ContinueButton} title="Continue" onPress={handleAddEvent} />
              <Button style={styles.BackButton} title="Back" onPress={handleBackToChooseLocation} />
            </View>
            <ErrorMessageModal message={errorMessage} onClose={() => setErrorMessage(null)} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 30, // Add padding to avoid content at the edges
    marginTop: 50,
  },
  modalContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden', // Ensure borderRadius is respected
    height: '96%', // Adjust the height as needed
  },
  modalContent: {
    flex: 1,
    flexDirection: 'column',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  ContinueButton: {
    flex: 1, // Equal flex for both buttons
    marginRight: 10, // Add margin between buttons
  },
  BackButton: {
    flex: 1, // Equal flex for both buttons
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 1,
  },
  calendar: {
    borderRadius: 10, // Add this line
    marginBottom: 15,
    borderWidth: 2.5, // Adjust the borderWidth to make the border bold
    borderColor: '#333', // You can also specify the borderColor
  },
  dropdownArrow: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: 0 }], // Adjust translateY to center the arrow vertically
    fontSize: 16,
  },
  
});

export default AddEventComponent;