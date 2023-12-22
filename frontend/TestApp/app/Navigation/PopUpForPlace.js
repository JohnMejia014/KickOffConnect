import React from 'react';
import { View, Text, Button, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Svg, { Path } from 'react-native-svg';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Rating } from 'react-native-ratings';

const PopUpForPlace = ({ placeInfo, onClose, onAddEvent, onAddRating }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={placeInfo !== null}>
      <View style={styles.popupContainer}>
        <View style={styles.popupContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text>X</Text>
          </TouchableOpacity>
          <Text style={styles.placeName}>{placeInfo?.name}</Text>

          {placeInfo?.photos && placeInfo?.photos.length > 0 && (
            <Image
              source={{ uri: placeInfo.photos[0] }}
              style={styles.placePhoto}
              resizeMode="cover"
              onError={(error) => console.error('Image load error:', error)}
            />
          )}

          <Text style ={styles.addressName}>{placeInfo?.vicinity}</Text>
          <View style={styles.ratingContainer}>
            <Rating
              type='star'
              ratingCount={5}
              imageSize={20}
              startingValue={placeInfo?.rating || 0}
              readonly={true}
              showRating={false}
            />
            <Text style={styles.ratingText}>
              {placeInfo?.rating !== null && placeInfo?.rating !== undefined
                ? `(${placeInfo?.user_ratings_total} ratings)`
                : 'No ratings'}
            </Text>
          </View>
          {/* Create Event Button */}
          <TouchableOpacity
            style={[styles.button, styles.createEventButton]}
            onPress={() => onAddEvent(placeInfo?.formatted_address)}
          >
            <Ionicons name="md-add-circle" size={20} color="white" />
            <Text style={styles.buttonText}>Create Event</Text>
          </TouchableOpacity>

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
  placeName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
    paddingTop: 10,
  },
  placePhoto: {
    width: '100%',
    height: 200, // Adjust the height based on your design
  },
  addressName: {
    fontSize: 13,
    paddingTop: 10,
    fontStyle: 'italic'
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
  createEventButton: {
    backgroundColor: '#32CD32', // Green color
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

export default PopUpForPlace;
