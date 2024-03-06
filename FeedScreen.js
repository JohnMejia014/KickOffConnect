// FeedScreen.js
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Image, Button} from 'react-native';
import {NavigationContainer, useScrollToTop} from "@react-navigation/native";
import {Link} from "expo-router";
import Navigation from "./Navigation";
import VideoPlayer  from "./FeedPageDiscovery/VideoPlayer";
import ImageUpload from "./FeedPageDiscovery/ImageUpload";
import StackNavigator from "@react-navigation/stack/src/navigators/createStackNavigator";
import {ScreenStack} from "react-native-screens";
import {createNativeStackNavigator} from "react-native-screens/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import FeedList from "./FeedPageDiscovery/FeedList";
import PostObject from "./FeedPageDiscovery/PostObject";

<<<<<<< HEAD
=======
const FeedScreen = (userInfo) => (
  <View>
    <Text>Feed Screen</Text>
  </View>
);
>>>>>>> f1202e7f456ea3d88c4d4cb7938c4954fefd3758


const Stack = createNativeStackNavigator();

const FeedScreen = ({navigation}) => {

    return(


        <Stack.Navigator>
            <Stack.Screen name="Root" component={FeedList} options={{headerShown: false, }}/>
            <Stack.Screen name="Video" component={VideoPlayer} options={{headerShown: false }}/>
            <Stack.Screen name="Create" component={PostObject} options={{headerShown: false}}/>
        </Stack.Navigator>

    )
};



export default FeedScreen;
