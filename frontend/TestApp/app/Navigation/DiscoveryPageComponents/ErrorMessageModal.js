// ErrorModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ErrorMessageModal = ({ message, onClose }) => (
  <Modal transparent={true} visible={!!message} animationType="fade">
    <View style={styles.modalContainer}>
      {/* Semi-transparent overlay */}
      <View style={styles.overlay}></View>
      {/* Error message content */}
      <View style={styles.errorMessageContainer}>
        <View style={styles.circle}>
          <Text style={styles.errorMessage}>{message}</Text>
        </View>
      </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
      </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
  },
  errorMessageContainer: {
    zIndex: 1, // Ensure the message is above the overlay
  },
  circle: {
    backgroundColor: 'white', // Set the background color to white
    borderRadius: 50, // Make it circular
    padding: 10,
    marginBottom: 10, // Add some margin to separate the X button
  },
  closeButton: {
    backgroundColor: 'white', // Set the background color to white
    borderRadius: 50, // Make it circular
    padding: 8, // Adjust the padding for a smaller circle
    align: 'center',
    width: '7%',
    height: '4%',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    fontSize: 16,
    color: '#FF6347', // Warning color
    textAlign: 'center',
    fontWeight: 'bold'
  },
});

export default ErrorMessageModal;
