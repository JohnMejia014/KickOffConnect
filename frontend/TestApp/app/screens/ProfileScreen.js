// ProfileScreen.js
import React,{useState, useEffect, useRef} from 'react';
import {Modal, Button, View, Text, StyleSheet, Image,  TextInput, SafeAreaView, TouchableOpacity, FlatList,  ScrollView, ActivityIndicator} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect from React Navigation
import ProfileEventList from './DiscoveryPageComponents/ProfileEventList';
import axios from 'axios';
import { useScrollToTop} from "@react-navigation/native";
import {Video} from "expo-av";
import FriendsList from './ProfileComponents/FriendsList';
import ProfileFeedList from './ProfileComponents/ProfileFeedList';
import ChangeProfilePictureModal from './ProfileComponents/ChangeProfilePictureModal';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
const ProfileScreen = ({route }) => {
  console.log("profilepage route: ", route.params);
  const [friendSelected, setFriendSelected] = useState(null);
  const [index, setIndex] = useState(0); // State for the selected tab index
  const [activeTab, setActiveTab] = useState('joined'); // State for the active tab
  const [postsCount, setPostsCount] = useState(0);
  const BASE_URL = 'http://192.168.1.119:5000';
  console.log(route.params.params.friendStatus);
  if(route.params.params.friendStatus){const initFriend = true}else{ const initFriend = false}
  const [friendPage, setFriendPage] = useState(false);

  const [userInfo, setUserInfo] = useState(
    route.params?.params?.friendInfo !== undefined && Object.keys(route.params?.params?.friendInfo).length !== 0
      ? route.params?.params?.friendInfo
      : route.params?.params?.userInfo || {}
  );  
  const [RealuserInfo, setRealUserInfo] = useState(route.params?.params?.userInfo || {});
   const [eventsJoined, setEventsJoined] = useState(null);
  const [eventsHosted, setEventsHosted] = useState(null);
  const [eventsInvited, setEventsInvited] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendsVisible, setFriendsVisible] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [friendRequests, setFriendRequests] = useState(userInfo.friendRequests);
  const [friendRequestsModalVisible, setFriendRequestsModalVisible] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [feed, setFeed] = useState([]);
  const [imageL, setImageL] = useState([]);
  const [length, setLength] = useState(0)
  const [desc, setDesc] = useState([]);
  const [type, setType] = useState([]);
  const username = userInfo.userID
  const ref = useRef(null);
  const [changePictureModalVisible, setChangePictureModalVisible] = useState(false);

  // Function to toggle the visibility of the change picture modal
  const toggleChangePictureModal = () => {
    fetchUserInfo();
    setChangePictureModalVisible(!changePictureModalVisible);
  };
  useScrollToTop(ref)
  
 
  useEffect(() => {
        
    axios.post(`${BASE_URL}/S3ProfileList`, { user: username })
        .then((response) => {
              
              setFeed(response.data.list);
              setLength(response.data.size);
              setDesc(response.data.text);
              setImageL(response.data.image);
              setPostsCount(response.data.size);
              if(!response.data.size){setPostsCount(0);}
              setType(response.data.type);

          })
  }, []);
  useEffect(() => {
    fetchUserInfo();
    fetchEventsHosted();
    fetchEventsJoined();
    fetchEventsInvited(); 
  
  }, [modalVisible]);
  
  const handleRespondFriendRequest = async (friendID, action) => {
    try {
      const response = await axios.post(`${BASE_URL}/respondFriendRequest`, {
        userID: userInfo.userID,
        friendID,
        action,
      });
      if (response.data.success) {
        // Update the friend requests list based on the response
        fetchUserInfo();
      } else {
        throw new Error('Failed to respond to friend request');
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
      // Handle error if needed
    }
  };

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

  const handleFriendPress = async (friend) => {
    if (friend.userID === RealuserInfo.userID) {
      // If the selected friend is the real user, reset to default view
      setUserInfo(RealuserInfo);
      console.log("making user id friend: ", userInfo.userID);
      fetchFeedData(friend);
      setFriendPage(false);

    } else {
      // Otherwise, set the selected friend's info and navigate to their page\      

      setUserInfo(friend);
      console.log("making user id friend: ", userInfo.userID);
      fetchFeedData(friend);
      setFriendPage(true);

      // Fetch the selected friend's posts and events
    }
    setModalVisible(false);
  };
  const fetchFeedData = (friend) => {
    axios
      .post(`${BASE_URL}/S3ProfileList`, { user: friend.userID })
      .then((response) => {
        setFeed(response.data.list);
        setLength(response.data.size);
        setDesc(response.data.text);
        setImageL(response.data.image);
        setType(response.data.type);
      })

      .catch((error) => {
        console.error('Error fetching datas:', error);
        // Handle error if needed
      });
  };
  const handlePageReset = () => {
    setUserInfo(RealuserInfo);
    setFriendPage(false);
    setModalVisible(false);
  };

    const joinEvent = async (eventID) => {
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
    const getLabelColor = () => (friendPage ? 'black' : '#fff');

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
    const handleFriendRequestsPress = () => {
        setFriendRequestsModalVisible(true); // Set friendRequestsModalVisible to true to open the modal
      };
    const removeFriend = async (friend) => {
      console.log("unadd friend: ", friend);
      try {    
        const response = await fetch(`${BASE_URL}/unaddFriend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID: userInfo.userID, friendID: friend.userID }), // Use userInformation.userID in the request body
        });
        const data = await response.json();
       console.log("succes or not", data.success);
        fetchUserInfo();
        fetchFriends();

      } catch (error) {
        console.error('Error removing friend:', error);
      }
    };
    const fetchUserInfo = async () => {
      try {    
        const response = await fetch(`${BASE_URL}/getUserInfo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userID: userInfo.userID,           }), // Use userInformation.userID in the request body
        });
        const data = await response.json();
       
        setUserInfo(data.userInfo); // Update userInfo state

      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    
    const fetchEventsHosted = async () => {
        console.log("fetchingevents from: ", userInfo.userID);
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

    const fetchEvents = async () =>{
      fetchEventsHosted();
      fetchEventsJoined();
      fetchEventsInvited();
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
      setUserInfo(RealuserInfo);
    setFriendPage(false);
    setModalVisible(false);
    console.log("page reset")
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
          fetchEvents={fetchEvents}
          isFriend={friendPage}
        />
      </View>
    );
  };

   
    return (
        <LinearGradient colors={friendPage ? ['#e3f2fd', '#bbdefb'] : ['#0d47a1', '#1565c0']}
         style={styles.container}>
        <ScrollView contentContainerStyle={[styles.scrollViewContent, { paddingBottom: 100 }]}>

          
        <SafeAreaView style={styles.container}>
            <View style={styles.profileContainer}>
              {/* Profile Picture */}
              <TouchableOpacity onPress={toggleChangePictureModal}>
              <View style={styles.profilePictureContainer}>
                {userInfo.profilePic ? (
                  <Image
                    source={{ uri: userInfo.profilePic }}
                    style={styles.profilePicture}
                  />
                ) : (
                  <View style={styles.placeholderCircle} />
                )}
              </View>
            </TouchableOpacity>

    
              {/* User Information */}
              <View style={styles.header}>
                <Text style={[styles.username, { color: getLabelColor() }]}>{userInfo.userID}</Text>
    
                {/* Number of Posts and Friends in the same horizontal line */}
                <View style={styles.userStatsContainer}>
                  {/* Number of Posts */}
                  <View style={styles.userStatsItem}>
                    <Text style={styles.userStatsLabel}>Posts </Text>
                    <Text style={styles.userStatsValue}>{postsCount}</Text>
                  </View>

                  {/* Number of Friends */}
                  <View style={styles.userStatsItem}>
                    <TouchableOpacity onPress={handleFriendsPress}>
                      <Text style={styles.userStatsLabel}>Friends</Text>
                      <Text style={styles.userStatsValue}>{userInfo.friends.length}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              {/* Friend Requests */}
              {!friendPage && (
                <TouchableOpacity onPress={handleFriendRequestsPress} style={styles.friendRequestsButton}>
                <Feather name="mail" size={24} color="black" style={styles.mailIcon} />
                <Text style={styles.friendRequestsText}>Friend Requests</Text>
                <Text style={styles.friendRequestsCount}>{userInfo.friendRequests.length}</Text>
              </TouchableOpacity>
               )}
               {/* Modal for Friend Requests */}
               <Modal visible={friendRequestsModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalBackground}>
                  <LinearGradient colors={['#e3f2fd', '#bbdefb']} style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Friend Requests:</Text>
                    <ScrollView style={styles.modalContent}>
                      {userInfo.friendRequests.map((request, index) => (
                        <View key={index} style={styles.friendContainer}>
                          <TouchableOpacity onPress={() => handleFriendPress(request)}>
                            <View style={styles.friendInfo}>
                              <Image source={{ uri: request.profilePic }} style={styles.profilePic} />
                              <Text style={styles.friendName}>{request}</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleRespondFriendRequest(request, 'accept')}>
                            <FontAwesome name="check" size={24} color="green" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleRespondFriendRequest(request, 'reject')}>
                            <FontAwesome name="times" size={24} color="red" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setFriendRequestsModalVisible(false)}>
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </Modal>
              {/* Label for Posts */}
              <Text style={[styles.eventsLabel, { color: getLabelColor() }]}>Posts</Text>



                  {/* Display feed items */}
                  <View style={styles.feedContainer}>
                    {loading ? (
                      <ActivityIndicator size="large" />
                    ) : (
                      <ProfileFeedList
                        feed={feed}
                        type={type}
                        imageL={imageL}
                        desc={desc}
                        handleMediaPress={(mediaSource, mediaType) => handleMediaPress(mediaSource, mediaType)}
                      />
                    )}
                  </View>



                  {/* Label for Events */}
                  <Text style={[styles.eventsLabel, { color: getLabelColor() }]}>Events</Text>

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
              {/* Change Profile Picture Modal */}
              {!friendPage && (
              <ChangeProfilePictureModal
                      isVisible={changePictureModalVisible}
                      onClose={toggleChangePictureModal}
                      userID={userInfo.userID}
                    />
              )}
                {/* {renderEventList()} */}
                <FriendsList
              modalVisible={modalVisible}
              friendsList={friendsList}
              handleFriendPress={handleFriendPress}
              closeModal={() => setModalVisible(false)}
              handleRemovePress={removeFriend}
              friendPage={friendPage}
      />
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
    borderWidth: 1, // Add a border
    borderColor: 'lightblue', // Customize border color

  },
  placeholderCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  header: {
    marginBottom: 20,
  },
  username: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    paddingTop: 20,
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
    justifyContent: 'space-around', // Align items on opposite ends of the row
    marginTop: 20,
    borderRadius:12,
marginBottom: 30,
paddingTop: 10,
  },
  userStatsItem: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#1565c0', // Blue background color for the button
    marginBottom: 30,
    paddingVertical: 15, // Adjust vertical padding
    paddingHorizontal: 20, // Adjust horizontal padding
    borderWidth: 0.5, // Add a border
    borderColor: 'lightblue', // Customize border color

    elevation: 3, // For Android elevation
  },
  
      userStatsLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        backgroundColor: '#1565c0', // Blue background color for the button
        textAlign: 'center',
        overflow: 'hidden', // Hide overflow content if any
      },
      
      userStatsValue: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
        padding: 8, // Add padding around the text
        borderRadius: 8, // Add rounded corners
        
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
        fontSize: 30,
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
      friendRequestsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1565c0', // Example background color
        borderWidth: 0.5, // Add a border
        borderColor: 'lightblue', // Customize border color
    
        padding: 10,
        borderRadius: 15,
        marginBottom: 10,
      },
      mailIcon: {
        marginRight: 10,
      },
      friendRequestsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
      },
      friendRequestsCount: {
        marginLeft: 'auto', // Push the count to the right
        fontWeight: 'bold',
      },
      modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Green background color with some transparency
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '80%', // Adjust as needed
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
      },
  
      friendRequestItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'lightblue',
        paddingVertical: 10,
      },
      friendRequestText: {
        fontSize: 16,
        flex: 1, // Take up remaining space in the row
      },
      closeButton: {
        marginTop: 20,
        alignSelf: 'flex-end',
      },
      closeButtonText: {
        fontSize: 16,
        color: '#333',
      },
  
      Heading:{
        fontSize:32,
        marginTop:60,
        marginLeft:15,
        fontWeight:'bold',
    },
    TextInput:{
        height:40,
        width:"85%",
        backgroundColor: '#EBEBEB',
        borderRadius:20,
        paddingLeft:15,
        marginTop:20
    },
    mainPostView: {
        width: "100%",
        marginBottom: 310,

    },
    titleView:{
        marginLeft:15,
    },
    postTitle:{
        width:"90%",
        display:'flex',
        justifyContent:'space-between',
        flexDirection:'row'
    },
    postView:{
        width:'100%',
        alignItems: "center",
        marginTop: 10,
    },
    userPhoto:{
        width: 50,
        height: 50
    },
    imageView:{
        display: "flex",
        flexDirection: "row",
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    postContainer: {
      backgroundColor: 'lightblue', // Light background color for the post container
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
      alignItems: 'center', // Center the content horizontally
    },
    friendContainer: {
      flexDirection: 'row',
      justifyContent: 'right',
      alignItems: 'center',
      marginBottom: 10,
    },
    friendInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingEnd: 220,
    },
    friendName: {
      fontSize: 16,
    },
    
    });
export default ProfileScreen;
