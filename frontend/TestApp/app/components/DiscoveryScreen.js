// DiscoveryScreen.js
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { AppContext } from '../AppContext';

const DiscoveryScreen = () => {
  const { user } = useContext(AppContext);

  return (
    <View>
      <Text>Welcome to the Discovery Page, {user.name}!</Text>
    </View>
  );
};

export default DiscoveryScreen;