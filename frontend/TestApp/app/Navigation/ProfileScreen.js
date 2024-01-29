// ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.username}>Your Username</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Set background color to a sports-themed color
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
