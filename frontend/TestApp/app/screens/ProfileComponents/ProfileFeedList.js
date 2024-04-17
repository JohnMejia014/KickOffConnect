// FeedList.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

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

export default ProfileFeedList;
