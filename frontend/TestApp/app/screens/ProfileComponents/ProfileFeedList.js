// FeedList.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';

const ProfileFeedList = ({ feed, type, imageL, desc, handleMediaPress }) => {
  if (!feed || feed.length === 0) {
    return null;
  }

  return (
    <View>
      {feed.map((item, index) => (
        <View key={index} style={styles.postContainer}>
          <TouchableOpacity onPress={() => handleMediaPress(imageL[index], type[index])}>
            {type[index] === 'mp4' ? (
              <Video style={styles.imageView} source={{ uri: imageL[index] }} />
            ) : (
              <Image style={styles.imageView} source={{ uri: imageL[index] }} />
            )}
          </TouchableOpacity>
          <Text>{desc[index]}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#1565c0', // Example background color
    borderWidth: 0.5, // Add a border
    borderColor: 'lightblue', // Customize border color
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center', // Center the content horizontally
  },
  imageView: {
    display: 'flex',
    flexDirection: 'row',
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  // You can add more styles here as needed
});

export default ProfileFeedList;
