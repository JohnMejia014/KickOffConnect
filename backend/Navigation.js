// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../frontend/TestApp/app/Navigation/LoginScreen';
import FeedScreen from '../frontend/TestApp/app/Navigation/FeedScreen';
import DiscoveryScreen from '../frontend/TestApp/app/Navigation/DiscoveryScreen';
import ProfileScreen from '../frontend/TestApp/app/Navigation/ProfileScreen';
// index.js

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainAppNavigator = () => (
  <Tab.Navigator independent = {true}>
    <Tab.Screen name="Feed" component={FeedScreen} />
    <Tab.Screen name="Discovery" component={DiscoveryScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login" headerMode="none" independent={true}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainApp" component={MainAppNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigation;
