import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { LoginScreen } from "./Navigation/LoginScreen";
import React from 'react';
const Stack = createNativeStackNavigator();

export default function Page() {
  
  return (
  <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName='LoginScreen'
      >
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}