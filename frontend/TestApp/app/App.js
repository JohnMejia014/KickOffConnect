// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';
import { AppProvider } from './AppContext';

const App = () => {
  return (
    <NavigationContainer>
      <AppProvider>
        <BottomTabNavigator />
      </AppProvider>
    </NavigationContainer>
  );
};

export default App;