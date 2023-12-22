import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can change the icon set based on your preference
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';

const AddEventComponent = ({ isVisible, onClose, onSubmit }) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedSports, setSelectedSports] = useState([]);
  const [eventTime, setEventTime] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [showPickerModal, setShowPickerModal] = useState(false);

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

  const handleAddEvent = () => {
    if (eventName.trim() !== '' && eventDescription.trim() !== '' && eventTime.trim() !== '') {
      onSubmit({
        eventName: eventName,
        eventDescription: eventDescription,
        sports: selectedSports,
        time: eventTime,
        isPublic: isPublic,
      });
      onClose();
    } else {
      // Display an error or prompt the user to fill in all required fields
    }
  };

  const handleOverlayPress = (e) => {
    const isInsideModal =
      e.nativeEvent.locationX >= 0 &&
      e.nativeEvent.locationX <= 300 && // Adjust 300 to the width of your modal
      e.nativeEvent.locationY >= 0 &&
      e.nativeEvent.locationY <= 300; // Adjust 300 to the height of your modal

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
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeaderText}>Add Event</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Event Name"
                placeholderTextColor={styles.inputPlaceholder.color}
                value={eventName}
                onChangeText={(text) => setEventName(text)}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Event Description"
                placeholderTextColor={styles.inputPlaceholder.color}
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
              <TextInput
                style={styles.inputField}
                placeholder="Event Time"
                placeholderTextColor={styles.inputPlaceholder.color}
                value={eventTime}
                onChangeText={(text) => setEventTime(text)}
              />
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={isPublic}
                  onValueChange={() => setIsPublic(!isPublic)}
                />
                <Text>Public Event</Text>
              </View>
              <Button title="Add Event" onPress={handleAddEvent} />
              <Button title="Cancel" onPress={onClose} />
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
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%', // Adjust the width as needed
  },
  pickerModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModalContent: {
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
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
  // Set placeholder color for better visibility
  inputPlaceholder: {
    color: '#888',
  },
  dropdownArrow: {
    position: 'absolute',
    right: 10, // Adjust the position as needed
    top: '50%', // Adjust the position as needed
    transform: [{ translateY: 0 }], // Adjust the translateY to center the arrow vertically
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default AddEventComponent;