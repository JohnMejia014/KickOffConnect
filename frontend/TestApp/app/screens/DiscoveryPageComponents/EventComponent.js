import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Rating } from 'react-native-ratings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const EventComponent = ({ eventInfo, onClose, onJoinLeave }) => {
  const isUserJoined = false;
  /* Add logic to determine if the user is joined to the event */
  const eventName = eventInfo?.eventName || 'No Event';
  const eventSport = eventInfo?.eventSport || 'No Sport';
  const eventHost = eventInfo?.eventHost || 'Unknown Host';
  const eventDescription = eventInfo?.eventDescription || 'No Description';
  const eventAddress = eventInfo?.eventAddress || 'No Address';
  const handleJoinLeave = () => {
    // Handle the logic for joining or leaving the event
    console.log("Pressed");
    onJoinLeave(!isUserJoined); // Pass the opposite value to toggle join/leave
  };
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
  const renderIcon = (sport) => {
    return (
      <>
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
      </>
    );
  };
  

  return (
    <Modal transparent={true} animationType="slide" visible={eventInfo !== null}>
      <View style={styles.popupContainer}>
      <View style={styles.popupContent}>
  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
    <FontAwesome name="times" size={20} color="black" />
  </TouchableOpacity>
  <Text style={styles.eventName}>{eventInfo?.eventName}</Text>

  {/* Sport with Icon */}
  <View style={styles.sportContainer}>
    {renderIcon(eventInfo?.eventSport)}
    <Text style={styles.sportText}>{eventInfo?.eventSport}</Text>
  </View>

  {/* Add any other event information you want to display */}
  <Text>{`Hosted by: ${eventInfo?.eventHost}`}</Text>
  <Text>{`Description: ${eventInfo?.eventDescription}`}</Text>
  <Text>{`Address: ${eventInfo?.eventAddress}`}</Text>

  {/* User Profile and Users Joined Row */}
  <View style={styles.rowContainer}>
    {/* User Profile Section */}
    <View style={styles.commonContainer}>
      {/* User Profile Picture (Placeholder) */}
      <View style={styles.profilePictureContainer}>
        <Image
          source={{uri: 'https://via.placeholder.com/50'}}
          style={styles.profilePicture}
        />
      </View>

      {/* User Name */}
      <Text style={styles.profileName}>{eventInfo.eventHost}</Text>
    </View>

    {/* Number of Users Joined */}
    <Text style={styles.commonText}>{`${eventInfo?.usersJoined || 0} users joined`}</Text>
  </View>

  {/* Join/Leave Button */}
  <TouchableOpacity
    style={[styles.button, isUserJoined ? styles.leaveButton : styles.joinButton]}
    onPress={handleJoinLeave}
  >
    <Ionicons name={isUserJoined ? 'md-exit' : 'md-log-in'} size={20} color="white" />
    <Text style={styles.buttonText}>{isUserJoined ? 'Leave' : 'Join'}</Text>
  </TouchableOpacity>
</View>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    popupContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popupContent: {
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 10,
      width: '80%',
    },
    closeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 10,
    },
    eventName: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 8,
      textAlign: 'center',
      paddingTop: 10,
    },
    sportContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
      justifyContent: 'center',
    },
    sportText: {
      marginLeft: 0,
      fontSize: 35,
    },
    button: {
      padding: 10,
      borderRadius: 5,
      marginVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    joinButton: {
      backgroundColor: '#32CD32', // Green color
    },
    leaveButton: {
      backgroundColor: 'red',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 10,
      paddingTop: 30,
    },
    commonContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    profilePictureContainer: {
      borderRadius: 50,
      overflow: 'hidden',
      marginRight: 10,
    },
    profilePicture: {
      width: 40,
      height: 40,
    },
    profileName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    commonText: {
      textAlign: 'right',
      marginTop: 10,
      fontSize: 14,
      color: 'gray',
    },
  });
  

export default EventComponent;
