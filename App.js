// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchAll from './Screens/SearchAll';
import Location from './Screens/Location';
import SearcheBar from './Screens/SearcheBar';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="SearcheBar" component={SearcheBar} />
        <Stack.Screen name="SearchAll" component={SearchAll} />
        <Stack.Screen name="Location" component={Location} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}