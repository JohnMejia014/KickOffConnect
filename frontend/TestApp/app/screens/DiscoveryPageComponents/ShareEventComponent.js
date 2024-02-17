import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const ShareEventComponent = ({ isVisible, onBack }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [postToFeed, setPostToFeed] = useState(true);

  const handleShareEvent = () => {
    // Implement the logic for sharing the event with selected friends and posting to the feed
    // For now, let's just log the selected friends and postToFeed status
    console.log('Selected Friends:', selectedFriends);
    console.log('Post to Feed:', postToFeed);
    // You can add further logic here, such as sending requests to share with selected friends, etc.
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>Share Event</Text>
            {/* Implement your UI for selecting friends */}
            {/* For example, a list of friends with checkboxes */}
            {/* <FriendList selectedFriends={selectedFriends} onSelectFriend={(friend) => {}} /> */}
            <Text style={styles.label}>Select Friends to Share With:</Text>
            <TouchableOpacity
              style={styles.friendButton}
              onPress={() => {} /* Implement logic to open friend selection */}
            >
              <Text>Select Friends</Text>
            </TouchableOpacity>
            {/* Add UI for postToFeed option */}
            <View style={styles.feedOptionContainer}>
              <Text style={styles.label}>Post to Feed:</Text>
              <TouchableOpacity
                style={styles.feedOptionButton}
                onPress={() => setPostToFeed(!postToFeed)}
              >
                <Text>{postToFeed ? 'Yes' : 'No'}</Text>
              </TouchableOpacity>
            </View>
            <Button title="Share Event" onPress={handleShareEvent} />
            <Button title="Back" onPress={onBack} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    padding: 30, // Add padding to avoid content at the edges
    marginTop: 50,
  },
  modalContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden', // Ensure borderRadius is respected
    height: '35%', // Adjust the height as needed
  },
  modalContent: {
    padding: 20,
    width: '100%', // Use 100% width
  },
  modalHeaderText: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  friendButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginBottom: 10,
  },
  feedOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  feedOptionButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
  },
});

export default ShareEventComponent;