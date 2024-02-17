// ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = ({ route }) => {
    
  // Check if route and route.params are available
  if (!route || !route.params) {
    // Handle the case where route or route.params is not available
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid navigation route</Text>
      </View>
    );
  }

  // Destructure userInfo from route.params
  const { userInfo } = route.params;

  // Check if userInfo is available
  if (!userInfo) {
    // Handle the case where userInfo is not available
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User information not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{userInfo.username}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friends</Text>
        {/* Add content for friends section here */}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Events</Text>
        {/* Add content for events section here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Set background color to a sports-themed color
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  header: {
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Set text color to a contrasting color
  },
  section: {
    marginVertical: 10,
    width: '80%',
    backgroundColor: '#fff', // Set background color for sections
    padding: 15,
    borderRadius: 10,
    elevation: 3, // Add some elevation for a card-like effect
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Set text color for section titles
  },
});

export default ProfileScreen;