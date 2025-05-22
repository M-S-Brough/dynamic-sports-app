import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ExploreScreen from '../Screens/ExploreScreen';
import PostDetail from '../Screens/PostDetail';

const Stack = createStackNavigator();

export default function ExploreScreenStackNav() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="explore"  component={ExploreScreen} 
        options={{
            headerShown: false
        }}
        />
        <Stack.Screen name="post-detail"  component={PostDetail} 
        options={{
            headerStyle: {
                backgroundColor: '#00008b'
                
            },
            headerTitle: 'Details',
            headerTitleStyle: {
              color: '#fff'
            },
            headerTintColor: '#fff'

        }}
        />
    </Stack.Navigator>
  )
}