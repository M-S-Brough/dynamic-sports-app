import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from '../Screens/ProfileScreen';
import MyPosts from '../Screens/MyPosts';
import PostDetail from '../Screens/PostDetail';

const Stack = createStackNavigator();

export default function ProfileScreenStackNav() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='profile-tab' component={ProfileScreen} 
        options={{
          headerShown: false
        }}
        />
        <Stack.Screen name='my-post' 
        component={MyPosts}
        options={{
          headerStyle: {
              backgroundColor: '#a8dffb'
          },
          headerTitle: 'My Posts'

      }}
      />
      <Stack.Screen name="post-detail"  component={PostDetail} 
        options={{
            headerStyle: {
                backgroundColor: '#a8dffb'
            },
            headerTitle: 'Details'

        }}
        />
    </Stack.Navigator>
  )
}