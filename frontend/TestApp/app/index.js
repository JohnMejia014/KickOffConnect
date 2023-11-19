// index.js
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App'; // Your main app component
import { name as appName } from '../app.json';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import { AppProvider } from './AppContext';

const Root = () => {
  return (
    <NavigationContainer>
      <AppProvider>
        <BottomTabNavigator />
      </AppProvider>
    </NavigationContainer>
  );
};

AppRegistry.registerComponent(appName, () => Root);

// The below line is required for the app to work correctly in the Expo client
if (module.hot) {
    module.hot.accept();
  }