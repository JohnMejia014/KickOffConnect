import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, FlatList, CheckBox } from 'react-native';

const FriendsList = ({ friends }) => {
  console.log("Friends: ", friends);
  return (
    <View style={styles.friendsContainer}>
      <Text style={styles.friendsHeaderText}>Friends ({friends.length})</Text>
      <FlatList
        data={friends}
        keyExtractor={(friend, index) => index.toString()} // Use index as key for strings
        renderItem={({ item }) => <Text style={styles.friendText}>{item}</Text>}
      />
    </View>
  );
};
  

const ShareEventComponent = ({ userInfo, eventData, isVisible, onBack, onSubmit, onClose }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [eventVisibility, setEventVisibility] = useState('public'); // Default visibility

  const handleSelectFriend = (friendId) => {
    setSelectedFriends((prevSelectedFriends) => {
      if (prevSelectedFriends.includes(friendId)) {
        return prevSelectedFriends.filter((id) => id !== friendId);
      } else {
        return [...prevSelectedFriends, friendId];
      }
    });
  };

  const handleShareEvent = () => {
    // Update eventData properties based on the selected friends and visibility
    eventData.eventHost = userInfo.userID;
    eventData.eventVisibility = eventVisibility;
    eventData.usersInvited = selectedFriends;
    eventData.usersJoined.push(userInfo.userID);
    console.log(eventData.usersJoined);
    // Call the onSubmit function with the updated eventData
    onSubmit(eventData);
    onClose();
  };

  const handleVisibilityToggle = () => {
    // Toggle between public and private visibility
    setEventVisibility((prevVisibility) =>
      prevVisibility === 'public' ? 'private' : 'public'
    );
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>Share Event</Text>
            <Text style={styles.label}>Select Friends to Share With:</Text>
            <FriendsList
              friends={userInfo.friends}
              selectedFriends={selectedFriends}
              onSelectFriend={handleSelectFriend}
            />
            <Text style={styles.visibilityText}>
              Current Visibility: {eventVisibility}
            </Text>
            <Button title="Toggle Visibility" onPress={handleVisibilityToggle} />
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
    padding: 30,
    marginTop: 50,
  },
  friendsHeader: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingBottom: 5,
  },
  friendsHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    height: '35%',
  },
  modalContent: {
    padding: 20,
    width: '100%',
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
  visibilityText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ShareEventComponent;
