import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for soccer icon

const CustomIcon = ({ markerInfo }) => {
  const sportIcons = {
    Soccer: 'football',
    Basketball: 'basketball',
    Tennis: 'tennis-ball',
    Volleyball: 'volleyball',
    Swimming: 'swim',
    Golf: 'golf',
    Baseball: 'baseball-bat',
    Hockey: 'hockey-puck',
    Cricket: 'cricket',
    Rugby: 'rugby',
    Football: 'football'
    // Add more sports and their corresponding icons as needed
  };

  const isPark = markerInfo?.park === true;

  return (
    <View style={styles.iconContainer}>
      {isPark ? (
        <FontAwesome name="tree" size={24} color="green" /> // Park icon using FontAwesome
      ) : (
        <>
          {markerInfo.icon === 'Soccer' ? ( // Check if icon is Soccer
            <Ionicons name={sportIcons[markerInfo.icon]} size={24} color="black" /> // Soccer icon using Ionicons
          ) : (
            <MaterialCommunityIcons name={sportIcons[markerInfo.icon]} size={24} color="black" /> // Other sport icons
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 5,
  },
});

export default CustomIcon;
