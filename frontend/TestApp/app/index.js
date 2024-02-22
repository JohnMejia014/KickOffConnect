// Your navigation file (e.g., Page.js)
import  Welcome  from "./screens/Welcome";  // Correct import statement
import  LoginScreen  from "./screens/LoginScreen";  // Correct import statement
import  FeedScreen  from "./screens/FeedScreen";  // Correct import statement
import  ProfileScreen  from "./screens/ProfileScreen";  // Correct import statement
import  DiscoveryScreen  from "./screens/DiscoveryScreen";  // Correct import statement
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppScreen() {
  const route = useRoute();
  const { userInfo } = route.params || {};
  console.log(userInfo);
  return(
    <Tab.Navigator
    initialRouteName = "Feed"
    screenOptions={{headerShown: false}}
    >
      <Tab.Screen name="Feed">
      {() => <FeedScreen route={{ params: { userInfo } }} />}
        </Tab.Screen> 
      <Tab.Screen name="Discovery">
        {() => <DiscoveryScreen route={{ params: { userInfo } }} />}
        </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => <ProfileScreen route={{ params: { userInfo } }} />}
      </Tab.Screen>
         </Tab.Navigator>
  )
}
export default function Page() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName='Login'
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="AppScreen"
          component={AppScreen}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}