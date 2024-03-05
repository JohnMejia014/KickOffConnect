import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, FlatList, CheckBox } from 'react-native';

const FriendsList = ({ friends, selectedFriends, onSelectFriend }) => {
  return (
    <FlatList
      data={friends}
      keyExtractor={(friend) => friend.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.friendItem}>
          <CheckBox
            value={selectedFriends.includes(item.id)}
            onValueChange={() => onSelectFriend(item.id)}
          />
          <Text>{item.name}</Text>
        </View>
      )}
    />
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
    eventData.eventHost = userInfo.route.params.userInfo.userID;
    eventData.eventVisibility = eventVisibility;
    eventData.usersInvited = selectedFriends;
    eventData.usersJoined.push(userInfo.route.params.userInfo.userID);
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
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    padding: 30,
    marginTop: 50,
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
