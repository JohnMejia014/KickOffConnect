import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Modal, Button, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from expo

const ChangeProfilePictureModal = ({ isVisible, onClose, userID }) => {
    const [image, setImage] = useState(null); // State to store the selected image
    const BASE_URL = 'http://192.168.1.119:5000';

    // Function to handle image selection from gallery
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Set the selected image URI to the state

        }
    };

    // Function to handle updating the profile picture
    const handleUpdateProfilePic = async () => {
      console.log(image);
      console.log(userID);
        if (!userID || !image) {
            console.error('Missing user ID or image');
            return;
        }

        const formData = new FormData();
        formData.append('user', userID);
        formData.append('file', { uri: image, name: 'profile.jpg', type: 'image/jpeg' });

        try {
            const response = await fetch(`${BASE_URL}/updateProfilePic`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update profile picture');
            }

            // Profile picture updated successfully
            onClose(); // Close the modal or perform any other action
        } catch (error) {
            console.error('Error updating profile picture:', error.message);
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
                <TouchableOpacity onPress={handleUpdateProfilePic}>
                    <Text style={styles.updateButton}>Update Profile Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButton}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
      borderRadius: 100, // Apply circular border to the selected image
      borderWidth: 2, // Optional: Add a border width
      borderColor: 'blue', // Optional: Border color
  },
    updateButton: {
        fontSize: 18,
        color: 'green',
        marginBottom: 20,
    },
    closeButton: {
        fontSize: 18,
        color: 'red',
    },
});

export default ChangeProfilePictureModal;
