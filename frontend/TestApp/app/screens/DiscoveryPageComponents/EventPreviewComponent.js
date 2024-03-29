import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
const EventPreviewComponent = ({ eventInfo, onPress, userInfo }) => {
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

  const renderIcons = (sports) => {
    return sports.map((sport, index) => (
      <View key={index} style={styles.iconContainer}>
        {sportIcons[sport] && (
          <>
            {(sport === 'Soccer') ? (
              <Ionicons
                name={sportIcons[sport]}
                size={50}
                color="black"
              />
            ) : (
              <MaterialCommunityIcons
                name={sportIcons[sport]}
                size={50}
                color="black"
              />
            )}
          </>
        )}
      </View>
    ));
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };
  return (
    <TouchableOpacity style={styles.eventPreview} onPress={onPress}>
      {/* Sport Icon */}
      <View style={styles.iconContainer}>
        {renderIcons(eventInfo?.eventSports)}
      </View>

      {/* Event Time and Date */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>{`Start:`}</Text>
        <Text>{`${eventInfo?.eventTime?.start}`}</Text>
        <Text style={styles.label}>{`End:`}</Text>
        <Text>{`${eventInfo?.eventTime?.end}`}</Text>
        <Text>{`${eventInfo?.eventDate}`}</Text>
      </View>

      {/* Users Participating */}
      <View style={styles.usersContainer}>
       <Text style={styles.label}>{`Joined:`}</Text>
        <Text>{`${eventInfo.usersJoined.length}`}</Text>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'lightgray',
    borderRadius: 8,
    marginBottom: 8,
    width: '90%',
    alignSelf: 'center',
    marginTop:16
  },
  iconContainer: {
    flex: 1,
  },
  infoContainer: {
    flex: 2,
    alignItems: 'center',
  },
  usersContainer: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
  },
});

export default EventPreviewComponent;
