// FeedScreen.js
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Image, Button} from 'react-native';
import {NavigationContainer, useScrollToTop} from "@react-navigation/native";
import Navigation from "./Navigation";
import VideoPlayer  from "./FeedPageDiscovery/VideoPlayer";
import ImageUpload from "./FeedPageDiscovery/ImageUpload";
import {ScreenStack} from "react-native-screens";
import {createNativeStackNavigator} from "react-native-screens/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import FeedList from "./FeedPageDiscovery/FeedList";
import PostObject from "./FeedPageDiscovery/PostObject";


const Stack = createNativeStackNavigator();

const FeedScreen = (userInfo) => (
  

  return(
        <Stack.Navigator>
            <Stack.Screen name="Root" component={FeedList} options={{headerShown: false}} route={{params: {userInfo}}}/>
            <Stack.Screen name="Video" component={VideoPlayer} options={{headerShown: false}}/>
            <Stack.Screen name="Create" component={PostObject} options={{headerShown: false}} route={{params: {userInfo}}}/>
        </Stack.Navigator>
    )
);

export default FeedScreen;
