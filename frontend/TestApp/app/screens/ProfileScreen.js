// ProfileScreen.js
import React,{useState} from 'react';
import { View, Text, StyleSheet, Image,  TextInput, SafeAreaView, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = ({ route }) => {
    if (!route || !route.params) {
      return (
        <LinearGradient
          colors={['#0d47a1', '#1565c0']}
          style={styles.container}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.container}>
              {/* Error message */}
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Invalid navigation route</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      );
    }
  
    const { userInfo } = route.params;
  
    if (!userInfo) {
      return (
        <LinearGradient
          colors={['#0d47a1', '#1565c0']}
          style={styles.container}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.container}>
              {/* Error message */}
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>User information not available</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      );
    }
    const [postsCount, setPostsCount] = useState(0);
    const [friendsCount, setFriendsCount] = useState(userInfo.friendsCount || 0);
  
  
    const [bio, setBio] = useState(userInfo.bio || '');
    const [isEditingBio, setIsEditingBio] = useState(false);

    const handleEditButtonPress = () => {
      setIsEditingBio(!isEditingBio);
    };
    return (
        <LinearGradient colors={['#0d47a1', '#1565c0']} style={styles.container}>
          <SafeAreaView style={styles.container}>
            <View style={styles.container}>
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
                  <View style={styles.userStats}>
                    <Text style={styles.statsLabel}>Friends </Text>
                    <Text style={styles.statsValue}>{friendsCount}</Text>
                  </View>
                </View>
              </View>
    
              {/* Bio Text or Input */}
              {isEditingBio ? (
                <View style={styles.bioInputContainer}>
                  <TextInput
                    style={styles.bioInput}
                    placeholder="Write your bio here..."
                    multiline
                    numberOfLines={3}
                    value={bio}
                    onChangeText={(text) => setBio(text)}
                  />
                </View>
              ) : (
                <View style={styles.bioTextContainer}>
                  <Text style={styles.bioText}>{bio}</Text>
                </View>
              )}
            
             <View style={styles.blackLine}></View>

    
            {/* Edit Button */}
            <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditButtonPress}
          >
            <Text style={styles.editButtonText}>
              {isEditingBio ? 'Done' : 'Edit'}
            </Text>
          </TouchableOpacity>
    
              {/* Other Sections */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Friends</Text>
                {/* Add content for friends section here */}
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Events</Text>
                {/* Add content for events section here */}
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      );
    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
      },
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
  bioInput: {
    marginTop: 10,
    width: '80%',
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#1565c0',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center'
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
    });

export default ProfileScreen;
