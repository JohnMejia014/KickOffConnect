import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Platform } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { FontAwesome } from 'react-native-vector-icons';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import _debounce from 'lodash/debounce';

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
  Football: 'football',
  // Add more sports and their corresponding icons as needed
};

const EventFilterModal = ({ isVisible, onClose, onApplyFilters }) => {
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date()); // Initialize with the current date
  const [selectedEndDate, setSelectedEndDate] = useState(new Date()); // Initialize with the current date
  const [showStartDatePicker, setShowStartDatePicker] = useState(true);
  const [showEndDatePicker, setShowEndDatePicker] = useState(true);
  const [selectedVisibility, setSelectedVisibility] = useState('both'); // 'private', 'public', or 'both'
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
   const handleApplyFilters = () => {
    const formattedStartDate = formatDate(selectedStartDate);
    const formattedEndDate = formatDate(selectedEndDate);

    const filters = {
        selectedSports,
        selectedStartDate: formattedStartDate,
        selectedEndDate: formattedEndDate,
        selectedVisibility,
        // Add more filter options here if needed
      };
    // Call the onApplyFilters callback with the selected filters
    onApplyFilters(filters);
    onClose();
  };

  const renderIcon = (sport) => {
    return (
      <View style={styles.iconContainer}>
        {sportIcons[sport] && (
          <>
            {sport === 'Soccer' ? (
              <Ionicons
                name={sportIcons[sport]}
                size={30}
                color="black"
              />
            ) : (
              <MaterialCommunityIcons
                name={sportIcons[sport]}
                size={30}
                color="black"
              />
            )}
          </>
        )}
      </View>
    );
  };

  const renderIcons = () => {
    return sports.map((sport, index) => (
      <React.Fragment key={index}>
        {renderIcon(sport)}
      </React.Fragment>
    ));
  };

  const onChangeStartDate = (selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    setSelectedStartDate(selectedDate); // Use selectedDate directly
  };
  
  const onChangeEndDate = (selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    setSelectedEndDate(selectedDate); // Use selectedDate directly
  };
  

  const showStartDatepicker = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatepicker = () => {
    setShowEndDatePicker(true);
  };

  return (
    <Modal transparent animationType="slide" visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.filterContainer}>
          <ScrollView>
            <Text style={styles.filterHeaderText}>Select Sports</Text>
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
                {sportIcons[sport] && renderIcon(sport)}
              </TouchableOpacity>
            ))}
            <Text style={styles.filterHeaderText}>Date Range</Text>
            <View style={styles.dateRangeContainer}>
                         
            {showStartDatePicker && (
                <DateTimePicker
                    value={selectedStartDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => onChangeStartDate(selectedDate)}
                />
                )}
                <Text style={styles.dateRangeSeparator}>-</Text>
                {showEndDatePicker && (
                <DateTimePicker
                    value={selectedEndDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => onChangeEndDate(selectedDate)}
                />
                )}

            </View>
            <Text style={styles.filterHeaderText}>Visibility</Text>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setSelectedVisibility('public')}
            >
              <CheckBox
                checked={selectedVisibility === 'public'}
                containerStyle={{ marginRight: 10, padding: 0 }}
                onPress={() => setSelectedVisibility('public')}
              />
              <Text style={{ marginLeft: 10 }}>Public</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setSelectedVisibility('private')}
            >
              <CheckBox
                checked={selectedVisibility === 'private'}
                containerStyle={{ marginRight: 10, padding: 0 }}
                onPress={() => setSelectedVisibility('private')}
              />
              <Text style={{ marginLeft: 10 }}>Private</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setSelectedVisibility('both')}
            >
              <CheckBox
                checked={selectedVisibility === 'both'}
                containerStyle={{ marginRight: 10, padding: 0 }}
                onPress={() => setSelectedVisibility('both')}
              />
              <Text style={{ marginLeft: 10 }}>Both</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
              <Text style={{ color: 'white' }}>Apply Filters</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%', // Set a maximum height for the modal
  },
  filterHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: 'lightgray',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  dateRangeSeparator: {
    fontSize: 20,
    marginHorizontal: 5,
  },
});

export default EventFilterModal;
