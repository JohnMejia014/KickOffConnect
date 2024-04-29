import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FriendsList = ({ modalVisible, friendsList, handleFriendPress, handleRemovePress, closeModal, friendPage }) => {
    useEffect(() => {
        fetchProfiles();
      }, []);
    
      const fetchProfiles = async () => {
        try {
          const response = await fetch('http://192.168.1.119:5000/SearchUsers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: 'your_user_id_here',
              query: 'friend_id_or_username_here',
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch profiles');
          }
    
          const data = await response.json();
          setFriendProfiles(data.profile);
        } catch (error) {
          console.error('Error fetching profiles:', error);
        }
      };

  if (!modalVisible) {
    return null;
  }

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <LinearGradient colors={['#e3f2fd', '#bbdefb']} style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Friends:</Text>
          <ScrollView style={styles.modalContent}>
            {friendsList.map((friend, index) => (
              <View key={index} style={styles.friendContainer}>
                <TouchableOpacity onPress={() => handleFriendPress(friend)}>
                  <View style={styles.friendInfo}>
                    <Image source={{ uri: friendProfiles[friend.userID] || 'default_profile_image_url_here' }} style={styles.profilePic} />
                    <Text style={styles.friendName}>{friend.userID}</Text>
                  </View>
                </TouchableOpacity>
                {!friendPage && (
                  <TouchableOpacity onPress={() => handleRemovePress(friend)} style={styles.unaddButton}>
                    <Text style={styles.unaddButtonText}>remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = {
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    maxHeight: '50%',
  },
  friendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendName: {
    fontSize: 16,
  },
  unaddButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  unaddButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
  },
};

export default FriendsList;
