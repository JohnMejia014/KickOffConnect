import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FriendsList = ({ modalVisible, friendsList, handleFriendPress, handleRemovePress, closeModal, friendPage }) => {
    
  if (!modalVisible) {
    return null;
  }

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
      <LinearGradient colors={['#e3f2fd', '#bbdefb'] } style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Friends:</Text>
          <ScrollView style={styles.modalContent}>
            {friendsList.map((friend, index) => (
              <View key={index} style={styles.friendContainer}>
                <TouchableOpacity onPress={() => handleFriendPress(friend)}>
                  <Text style={styles.friendName}>{friend.userID}</Text>
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
