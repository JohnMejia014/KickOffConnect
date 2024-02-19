import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Rating } from 'react-native-ratings';

const EventComponent = ({ eventInfo, onClose, onAddRating }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={eventInfo !== null}>
      <View style={styles.popupContainer}>
        <View style={styles.popupContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.eventName}>{eventInfo?.eventName}</Text>

          {/* Add any other event information you want to display */}
          <Text>{`Description: ${eventInfo?.eventDescription}`}</Text>
          <Text>{`Address: ${eventInfo?.eventAddress}`}</Text>
          {/* ... (Add more event details) */}

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Rating
              type='star'
              ratingCount={5}
              imageSize={20}
              startingValue={eventInfo?.eventRating || 0}
              readonly={true}
              showRating={false}
            />
            <Text style={styles.ratingText}>
              {eventInfo?.eventRating !== null && eventInfo?.eventRating !== undefined
                ? `(${eventInfo?.eventUserRatingsTotal} ratings)`
                : 'No ratings'}
            </Text>
          </View>

          {/* Add Rating Button */}
          <TouchableOpacity
            style={[styles.button, styles.addRatingButton]}
            onPress={onAddRating}
          >
            <Ionicons name="md-star" size={20} color="white" />
            <Text style={styles.buttonText}>Add Rating</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    width: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
  },
  eventName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
    paddingTop: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  ratingText: {
    marginLeft: 8,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRatingButton: {
    backgroundColor: '#4169E1', // Royal Blue color
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default EventComponent;
