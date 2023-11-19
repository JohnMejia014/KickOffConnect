// FeedScreen.js
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { AppContext } from '../AppContext';

const FeedScreen = () => {
  const { user } = useContext(AppContext);

  return (
    <View>
      <Text>Welcome to the Feed, {user.name}!</Text>
    </View>
  );
};

export default FeedScreen;