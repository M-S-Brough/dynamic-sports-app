import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../Screens/HomeScreen';
import PostList from '../Screens/PostList';
import PostDetail from '../Screens/PostDetail';

const Stack = createStackNavigator();

export default function HomeScreenStackNav() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='home' component={HomeScreen} 
        options={{
            headerShown: false
        }} />
        <Stack.Screen name='post-list' 
        component={PostList} 
        options={({ route }) => ({ title: route.params.category, 
        headerStyle: {
            backgroundColor: '#a8dffb'
        },
        
        })}
        />

<Stack.Screen name='post-detail' 
        component={PostDetail} 
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