
import { StyleSheet, Button, Text, View, FlatList } from 'react-native';
import React from 'react'


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createNativeStackNavigator();



function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Anasayfa" >

        <Stack.Screen name="Anasayfa" component={HomeScreen} options={{
            headerShown: false,
          }}/>
        <Stack.Screen name="ChatEkrani" component={ChatScreen} options={{
            headerShown: false,
          }}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
