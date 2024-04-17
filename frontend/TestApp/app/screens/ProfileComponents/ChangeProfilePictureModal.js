import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Modal, Button, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from expo


const ChangeProfilePictureModal = ({ isVisible, onClose }) => {
    const [image, setImage] = useState(null); // State to store the selected image
  
    // Function to handle image selection from gallery
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        setImage(result.uri); // Set the selected image URI to the state
      }
    };
  
    return (
      <Modal visible={isVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Change Profile Picture</Text>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.selectButton}>Select Image</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.selectedImage} />}
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profilePicture: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 20,
    },
    modalContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    selectButton: {
      fontSize: 18,
      color: 'blue',
      marginBottom: 20,
    },
    selectedImage: {
      width: 200,
      height: 200,
      marginBottom: 20,
    },
    closeButton: {
      fontSize: 18,
      color: 'red',
    },
  });

  export default ChangeProfilePictureModal;