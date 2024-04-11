// FeedScreen.js
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Image, Button} from 'react-native';
import VideoPlayer  from "./FeedPageDiscovery/VideoPlayer";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedList from "./FeedPageDiscovery/FeedList";
import PostObject from "./FeedPageDiscovery/PostObject";


const Stack = createNativeStackNavigator();

const FeedScreen = ({navigation, route}) => (




    <Stack.Navigator
        initialRouteName={"Root"}
    >
        <Stack.Screen name="Root" component={FeedList} options={{headerShown: false}} initialParams={{params: route.params.userInfo}} />
        <Stack.Screen name="Video" component={VideoPlayer} options={{headerShown: false}}/>
        <Stack.Screen name="Create" component={PostObject} options={{headerShown: false}}/>
    </Stack.Navigator>


    
);


export default FeedScreen;