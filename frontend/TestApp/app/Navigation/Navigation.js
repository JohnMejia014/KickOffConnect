// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import {View} from 'react-native'
const Navigation = () => (
    <NavigationContainer independent={true}>
        <BottomTabNavigator />
    </NavigationContainer>
);

export default Navigation;