// ProfileScreen.js
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Image, Button} from 'react-native';
import VideoPlayer  from "./FeedPageDiscovery/VideoPlayer";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserProfileScreen from './UserProfileScreen';
import FriendProfileScreen from './FriendProfileScreen';


const Stack = createNativeStackNavigator();

const ProfileScreen = ({userInfo}) => (
 
        <Stack.Navigator initialRouteName = "User">
            <Stack.Screen name="User" component={UserProfileScreen} options={{headerShown: false}} initialParams={userInfo}/>
            <Stack.Screen name="Friend" component={FriendProfileScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    
);

export default ProfileScreen;