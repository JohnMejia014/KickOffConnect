import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Rating } from 'react-native-ratings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ErrorMessageModal from './ErrorMessageModal';

const EventComponent = ({ initialEventInfo, onClose, userInfo, joinEvent, leaveEvent, isProfilePage, isFriend }) => {
   const [showParticipantsModal, setShowParticipantsModal] = useState(false);
   const [isUserJoined, setIsUserJoined] = useState(initialEventInfo?.usersJoined?.includes(userInfo.userID));
   /* Add logic to determine if the user is joined to the event */
  const eventName = eventInfo?.eventName || 'No Event';
  const eventSport = eventInfo?.eventSport || 'No Sport';
  const eventHost = eventInfo?.eventHost || 'Unknown Host';
  const eventDescription = eventInfo?.eventDescription || 'No Description';
  const eventAddress = eventInfo?.eventAddress || 'No Address';
  const [eventInfo, setEventInfo] = useState(initialEventInfo);
  console.log("isUserJoined: ",isUserJoined);
 
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    // This effect will run whenever eventInfo changes
    setIsUserJoined(eventInfo?.usersJoined?.includes(userInfo.userID));
  }, [eventInfo, userInfo.userID]);
  console.log("isFriend:", isFriend);
  const handleJoinLeave = async () => {
    console.log("is profile page:  ", isProfilePage);
    if (eventInfo.eventHost === userInfo.userID) {
      // Display a message that the host cannot leave their own event
      setErrorMessage('You are the host. You cannot leave your own event.');
    } else {
      try {
        if (isUserJoined) {
          // User is already joined, so leave the event
          const updatedEventInfo = await leaveEvent(eventInfo.eventID); // Pass the eventID or any unique identifier
          if (isProfilePage){onClose(); return null;}
          setEventInfo(updatedEventInfo);          
        } else {
          // User is not joined, so join the event
          const updatedEventInfo = await joinEvent(eventInfo.eventID); // Pass the eventID or any unique identifier
          if (isProfilePage){onClose(); return null;}
          setEventInfo(updatedEventInfo);          
        }
        // Update isUserJoined state after successful join/leave
        setIsUserJoined(!isUserJoined);
      } catch (error) {
        console.error('Error joining/leaving event:', error);
        // Handle error, e.g., show an error message
      }
    }
  };
  
  
  
  const toggleParticipantsModal = () => {
    setShowParticipantsModal(!showParticipantsModal);
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
  const renderIcons = (sports) => {
    console.log("Sports: ", sports);
    return (
      <View style={styles.sportContainer}>
        {sports?.map((sport, index) => (
          <View key={index} style={styles.iconContainer}>
            {sportIcons[sport] && (
              <>
                {sport === 'Soccer' ? (
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
        ))}
      </View>
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
            {renderIcons(eventInfo?.eventSports)}
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
                  source={{ uri: 'https://via.placeholder.com/50' }}
                  style={styles.profilePicture}
                />
              </View>
  
              {/* User Name */}
              <Text style={styles.profileName}>{eventInfo.eventHost}</Text>
            </View>
  
            {/* Number of Users Joined (Touchable to display participants) */}
            <TouchableOpacity onPress={toggleParticipantsModal}>
              <Text style={styles.commonText}>{`${eventInfo.usersJoined.length} users joined`}</Text>
            </TouchableOpacity>

          </View>
  
          {/* Conditionally render Join/Leave Button */}
          {!isFriend && (
            <TouchableOpacity
              style={[styles.button, isUserJoined ? styles.leaveButton : styles.joinButton]}
              onPress={handleJoinLeave}
            >
              <Ionicons name={isUserJoined ? 'md-exit' : 'md-log-in'} size={20} color="white" />
              <Text style={styles.buttonText}>{isUserJoined ? 'Leave' : 'Join'}</Text>
            </TouchableOpacity>
          )}
  
          {/* Participants Modal */}
          <Modal transparent={true} animationType="slide" visible={showParticipantsModal}>
            <View style={styles.popupContainer}>
              <View style={styles.popupContent}>
                <TouchableOpacity style={styles.closeButton} onPress={toggleParticipantsModal}>
                  <FontAwesome name="times" size={20} color="black" />
                </TouchableOpacity>
                <Text style={styles.modalHeaderText}>Participants</Text>
                {/* Display the list of participants using FlatList */}
                <FlatList
                  data={eventInfo?.usersJoined || []}
                  keyExtractor={(item, index) => index.toString()}  // Ensure each item has a unique key
                  renderItem={({ item }) => (
                    <View style={styles.participantItem}>
                      <Text>{item}</Text>
                    </View>
                  )}
                />
              </View>
            </View>
          </Modal>
          <ErrorMessageModal
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />

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
    iconContainer: {
      marginRight: 10, // Add any desired margin
    },
    sportContainer: {
      flexDirection: 'row', // Set flexDirection to 'row'
      alignItems: 'center',
      marginVertical: 8,
      justifyContent: 'center',
    },
    sportText: {
      marginLeft: 0,
      fontSize: 20, // Adjust font size as needed
      textAlign: 'center',
    },
    participantItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    modalHeaderText: {
      fontSize: 24,
      marginBottom: 10,
      textAlign: 'center',
    },
  });
  

export default EventComponent;
