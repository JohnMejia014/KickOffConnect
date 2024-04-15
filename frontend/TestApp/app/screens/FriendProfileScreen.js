// Import necessary modules
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const FriendProfileScreen = ({ navigation, route }) => {
  const [friendInfo, setFriendInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = 'http://your_api_base_url'; // Update with your API base URL

  useEffect(() => {
    // Fetch friend's profile information based on friendId parameter
    const fetchFriendInfo = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/getFriendInfo`, {
          friendId: route.params.friendId,
        });
        setFriendInfo(response.data.friendInfo);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching friend info:', error);
        setLoading(false);
      }
    };

    fetchFriendInfo(); // Call the fetchFriendInfo function
  }, [route.params.friendId]); // Include friendId in the dependency array

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!friendInfo) {
    return (
      <View style={styles.container}>
        <Text>No friend information available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.friendName}>{friendInfo.name}</Text>
      <Text style={styles.friendBio}>{friendInfo.bio}</Text>
      {/* Display other friend information as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendBio: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default FriendProfileScreen;
