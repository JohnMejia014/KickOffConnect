// ProfileScreen.js
import React,{useState, useEffect} from 'react';
import {Modal, Button, View, Text, StyleSheet, Image,  TextInput, SafeAreaView, TouchableOpacity, FlatList,  ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect from React Navigation
import { TabView, TabBar } from 'react-native-tab-view'; // Import TabView and TabBar components
import ProfileEventList from './DiscoveryPageComponents/ProfileEventList';
import axios from 'axios';

const ProfileScreen = ({ route }) => {
  const [index, setIndex] = useState(0); // State for the selected tab index
  const [activeTab, setActiveTab] = useState('joined'); // State for the active tab
  const [postsCount, setPostsCount] = useState(0);
  const BASE_URL = 'http://192.168.1.119:5000';
  const [userInfo, setUserInfo] = useState(route.params?.userInfo || {});
  const [eventsJoined, setEventsJoined] = useState(null);
  const [eventsHosted, setEventsHosted] = useState(null);
  const [eventsInvited, setEventsInvited] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendsVisible, setFriendsVisible] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [friendsCount, setFriendsCount] = useState(userInfo.friends.length);
  console.log("UserInfo: ",userInfo);

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getFriends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userInfo.userID }), // Send userID to fetch friends
      });
      const data = await response.json();
      console.log("friend data: ",data.friends);
      setFriendsList(data.friends); // Update friendsList state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleFriendsPress = () => {
    fetchFriends(); // Fetch friends when expanding the friends list
    setModalVisible(!modalVisible); // Toggle modal visibility
  };

  const handleFriendPress = (friend) =>{
    console.log("Friend :", friend);
  }

  const renderFriendsList = () => {
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Friends:</Text>
            <ScrollView style={styles.modalContent}>
              {friendsList.map((friend, index) => (
                <TouchableOpacity key={index} onPress={() => handleFriendPress(friend)}>
                  <Text style={styles.friendName}>
                    {friend.userID}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  
    const [bio, setBio] = useState(userInfo.bio || '');
    const [isEditingBio, setIsEditingBio] = useState(false);
    const joinEvent = async (eventID) => {
      console.log("eventID: ", eventID, "userID", userInfo.userID);
      try {
        const response = await axios.post(`${BASE_URL}/joinEvent`, {
          eventID: eventID,
          userID: userInfo.userID,
        });
  
        if (response.data.success) {
          console.log(response.data.message);
        } else {
          throw new Error('Failed to join the event');
        }
      } catch (error) {
        console.error('Error joining event:', error);
        throw new Error('Failed to join the event');
      }
    };
  
    const leaveEvent = async (eventID) => {
      console.log("eventID: ", eventID, "userID", userInfo.userID);

      try {
        const response = await axios.post(`${BASE_URL}/leaveEvent`, {
          eventID: eventID,
          userID: userInfo.userID,
        });
  
        if (response.data.success) {
          //will only get here when leaving join tab
            setEventsJoined(prevEvents => prevEvents.filter(event => event.eventID !== eventID));
        } else {
          throw new Error('Failed to leave the event');
        }
      } catch (error) {
        console.error('Error leaving event:', error);
        throw new Error('Failed to leave the event');
      }
    };
  
    const fetchUserInfo = async () => {
      try {    
        const response = await fetch(`${BASE_URL}/getUserInfo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID: userInfo.userID }), // Use userInformation.userID in the request body
        });
        const data = await response.json();
       
        console.log("data: ", data);
        setUserInfo(data.userInfo); // Update userInfo state

      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    
    const fetchEventsHosted = async () => {
      try {
        const response = await fetch(`${BASE_URL}/getEventInfo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventIDs: userInfo.eventsHosted }),
        });
        const data = await response.json();
        setEventsHosted(data.events);
        setLoading(false);
        console.log("event data: ", data.events);
      } catch (error) {
        console.error('Error fetching hosted events:', error);
      }
    };
    const fetchEventsJoined = async () => {
      try {
        const response = await fetch(`${BASE_URL}/getEventInfo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventIDs: userInfo.eventsJoined }),
        });
        const data = await response.json();
        setEventsJoined(data.events);
        setLoading(false);
        console.log("event data joined: ", data.events);
      } catch (error) {
        console.error('Error fetching hosted events:', error);
      }
    };
    const fetchEventsInvited = async () => {
      try {
        const response = await fetch(`${BASE_URL}/getEventInfo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventIDs: userInfo.eventsInvited }),
        });
        const data = await response.json();
        setEventsInvited(data.events);
        setLoading(false);
        console.log("event data invited: ", data.events);
      } catch (error) {
        console.error('Error fetching hosted events:', error);
      }
    };
    
    const handleTabPress = (tab) => {
      fetchUserInfo();
      fetchEventsHosted();
      fetchEventsJoined();
      fetchEventsInvited();
      setActiveTab(tab);
    };
  
  
  // Use useEffect to fetch user info on component mount
  useEffect(() => {
    fetchUserInfo(); // Fetch user info when component mounts
    fetchEventsHosted();
    fetchEventsJoined();
    fetchEventsInvited();
  }, []);

  // Use useFocusEffect to refetch user info when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo(); // Fetch user info when screen is focused
    }, [])
  );
 

  const [routes] = useState([
    { key: 'hosted', title: 'Events Hosted' },
    { key: 'joined', title: 'Events Joined' },
    { key: 'invited', title: 'Events Invited' },
  ]);
  const renderContent = () => {
    switch (activeTab) {
      case 'joined':
        return (
          <View style={styles.contentContainer}>
            {/* Content for 'Joined' tab */}
            {renderEventList(eventsJoined)}
          </View>
        );
      case 'hosted':
        return (
          <View style={styles.contentContainer}>
            {/* Content for 'Hosted' tab */}
            {renderEventList(eventsHosted)}
          </View>
        );
      case 'invited':
        return (
          <View style={styles.contentContainer}>
            {/* Content for 'Invited' tab */}
            {renderEventList(eventsInvited)}
          </View>
        );
      default:
        return null;
    }
  };
 
  const renderEventList = (events) => {
    if(events === null){
      return null;
    }
    console.log("events: ", events);
    return (
      <View>
        <ProfileEventList
          events={events}
          isModalVisible={true}
          onClose={() => {}}
          userInfo={userInfo}
          leaveEvent={leaveEvent}
          joinEvent={joinEvent}
          isProfilePage={true}
        />
      </View>
    );
  };

    const handleEditButtonPress = () => {
      setIsEditingBio(!isEditingBio);
    };
    return (
        <LinearGradient colors={['#0d47a1', '#1565c0']} style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>

          <SafeAreaView style={styles.container}>
            <View style={styles.profileContainer}>
              {/* Profile Picture */}
              <View style={styles.profilePictureContainer}>
                {/* Placeholder circle */}
                <View style={styles.placeholderCircle}></View>
              </View>
    
              {/* User Information */}
              <View style={styles.header}>
                <Text style={styles.username}>{userInfo.userID}</Text>
    
                {/* Number of Posts and Friends in the same horizontal line */}
                <View style={styles.userStatsContainer}>
                  {/* Number of Posts */}
                  <View style={styles.userStats}>
                    <Text style={styles.statsLabel}>Posts </Text>
                    <Text style={styles.statsValue}>{postsCount}</Text>
                  </View>
    
                  {/* Number of Friends */}
                <TouchableOpacity onPress={handleFriendsPress}>
                  <Text style={styles.statsLabel}>Friends</Text>
                  <Text style={styles.statsValue}>{userInfo.friends.length}</Text>
                </TouchableOpacity>
                  
                </View>   
                  {/* Label for Events */}
                  <Text style={styles.eventsLabel}>Events</Text>

                 {/* Tab Buttons */}
            <View style={styles.tabButtonContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'joined' && styles.activeTabButton]}
                onPress={() => handleTabPress('joined')}
                >
                <Text style={[styles.tabButtonText, activeTab === 'joined' && styles.activeTabButtonText]}>
                  Joined
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'hosted' && styles.activeTabButton]}
                onPress={() => handleTabPress('hosted')}
                >
                <Text style={[styles.tabButtonText, activeTab === 'hosted' && styles.activeTabButtonText]}>
                  Hosted
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'invited' && styles.activeTabButton]}
                onPress={() => handleTabPress('invited')}
                >
                <Text style={[styles.tabButtonText, activeTab === 'invited' && styles.activeTabButtonText]}>
                  Invited
                </Text>
              </TouchableOpacity>
            </View>
          </View>

                {/* Render Content */}
                {renderContent()}
                {/* View for EventListComponent */}
                {renderFriendsList()}

                {/* {renderEventList()} */}

          </View>
          </SafeAreaView>
          </ScrollView>
        </LinearGradient>
      );
    };

const styles = StyleSheet.create({
    
      errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      errorText: {
        fontSize: 18,
        color: 'red',
      },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  profilePictureContainer: {
    marginTop: 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc', // Placeholder color for the circle
    overflow: 'hidden',
  },
  placeholderCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: 'gray', // Color for the placeholder circle
  },
  header: {
    marginBottom: 20,
  },
  username: {
    paddingTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  section: {
    marginVertical: 10,
    width: '80%',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    paddingHorizontal: 10, // Adjust padding as needed
    borderRadius: 5, // Adjust border radius as needed
    backgroundColor: '#1565c0',
    padding: 5,
    borderRadius: 50,
  },
  editButtonText: {
    color: '#fff',
    // Add black border around the text
    borderWidth: 1,
    borderColor: 'black',
    padding: 5, // Adjust padding as needed
    borderRadius: 5, // Adjust border radius as needed
  },
  blackLine: {
    width: '80%',
    height: 1,  // Adjust this value as needed
    backgroundColor: 'black',  // Use backgroundColor instead of borderBottomColor
    marginVertical: 10,   // Adjust this value as needed
  },
  userStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    
  },
  userStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginHorizontal: 10,
      },
      statsLabel: {
        fontSize: 16,
        color: '#333',
      },
      statsValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
      eventItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      eventName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      eventDate: {
        fontSize: 14,
        color: '#888',
      },
      tabButtonContainer: {
        flexDirection: 'row',
        alignContent:'center',
        marginTop: 20,
        width: '80%',
      },
      tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#1565c0',
        marginHorizontal: 10, // Add margin between each button

      },
      tabButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
      },
      activeTabButton: {
        backgroundColor: '#0d47a1',
      },
      activeTabButtonText: {
        color: '#ff0',
      },
      contentContainer: {
        marginTop: 20,
        alignItems: 'center',
      },
      eventsLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        paddingTop: 50,
      },
      container: {
        flex: 1,
        width: '100%',
        alignItems: 'center', // Align content at the top
        justifyContent: 'flex-start', // Align content at the top

      },
      profileContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start', // Align content at the top
        marginTop: 20, // Adjust the marginTop as needed
      },
      // Other styles remain unchanged
      eventListComponentContainer: {
        marginBottom: 20, // Adjust the marginBottom to create space at the bottom
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      friendsContainer: {
        marginTop: 20,
        alignItems: 'center',
      },
      friendsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      friendName: {
        fontSize: 16,
        marginBottom: 5,
      },
      modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        //justifyContent: 'flex-end', // Modal will appear at the bottom
      },
      modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 100,
        paddingHorizontal: 20,
        paddingBottom: 10,
        maxHeight: '80%', // Adjust as needed
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      modalContent: {
       // minHeight: 20, // Example height, adjust as needed
      },
      closeButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
      },
      closeButtonText: {
        fontSize: 16,
        color: '#333',
      },
    });
export default ProfileScreen;
