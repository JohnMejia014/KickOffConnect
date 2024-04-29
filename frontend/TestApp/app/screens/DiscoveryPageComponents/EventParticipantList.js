import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const EventParticipantList = ({ participants, modalVisible, closeModal }) => {
  const BASE_URL = 'http://10.155.229.89:5000';
  const [participantsProfilePic, setParticipantsProfilePic] = useState([])
  useEffect(() => {
    const fetchParticipantsProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/GetFriendsProfileURLs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            friendList: participants,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setParticipantsProfilePic(data.friend_urls);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (modalVisible) {
      fetchParticipantsProfile();
    }
  }, [modalVisible, participants]); // Only run the effect when modalVisible or participants change

  if (!modalVisible) {
    return null;
  }

    
  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <LinearGradient colors={['#e3f2fd', '#bbdefb']} style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Participants:</Text>
          <ScrollView style={styles.modalContent}>
            {participants.map((participant, index) => (
              <View key={index} style={styles.participantContainer}>
                <View style={styles.participantInfo}>
                  <Image source={{ uri: participantsProfilePic[participant] || 'default_profile_image_url_here' }} style={styles.profilePic} />
                  <Text style={styles.participantName}>{participant}</Text>
                </View>
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    maxHeight: '50%',
  },
  participantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  participantName: {
    fontSize: 16,
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

export default EventParticipantList;
