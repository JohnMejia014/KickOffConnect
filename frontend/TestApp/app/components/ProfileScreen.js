// ProfileScreen.js
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { AppContext } from '../AppContext';

const ProfileScreen = () => {
  const { user } = useContext(AppContext);

  return (
    <View>
      <Text>Welcome to the ProfilePage, {user.name}!</Text>
    </View>
  );
};

export default ProfileScreen;