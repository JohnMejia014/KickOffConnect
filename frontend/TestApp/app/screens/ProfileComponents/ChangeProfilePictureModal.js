import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal as RNModal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient from expo

const ChangeProfilePictureModal = ({ isVisible, onClose, userID }) => {
    const [image, setImage] = useState(userID.profilePic);
    const BASE_URL = 'http://10.155.229.89:5000';

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleUpdateProfilePic = async () => {
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

            onClose();
        } catch (error) {
            console.error('Error updating profile picture:', error.message);
        }
    };

    return (
        <RNModal visible={isVisible} animationType="slide">
            <LinearGradient colors={['#0d47a1', '#156533']} style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Change Profile Picture</Text>
                <TouchableOpacity onPress={pickImage} style={styles.selectButton}>
                    <Text style={styles.selectButtonText}>Select Image</Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.selectedImage} />}
                <TouchableOpacity onPress={handleUpdateProfilePic} style={styles.updateButton}>
                    <Text style={styles.updateButtonText}>Update Profile Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </LinearGradient>
        </RNModal>
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
        backgroundColor: '#4A90E2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
    },
    selectButtonText: {
        fontSize: 18,
        color: '#FFF',
    },
    selectedImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'blue',
    },
    updateButton: {
        backgroundColor: '#22A57E',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
    },
    updateButtonText: {
        fontSize: 18,
        color: '#FFF',
    },
    closeButton: {
        backgroundColor: '#F44336',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#FFF',
    },
});

export default ChangeProfilePictureModal;
