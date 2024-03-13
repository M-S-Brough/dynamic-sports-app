import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import diary from './../../assets/images/diary.png';
import logout from './../../assets/images/logout.png';
import search from './../../assets/images/search.png';
import logo from './../../assets/images/login.jpg';


export default function ProfileScreen() {

  const {user} = useUser();
  const menuList = [
    {
      id: 1,
      name: 'My Posts',
      icon: diary
    },

    {
      id: 2,
      name: 'Explore',
      icon: search
    },

    {
      id: 3,
      name: 'Undecided',
      icon: logo
    },

    {
      id: 4,
      name: 'Logout',
      icon: logout
    }
  ]

  return (
    <View className="p-5 bg-white flex-1">
      <View className="items-center mt-14">
      <Image source={{uri: user?.imageUrl}} 
      className="w-[100px] h-[100px] rounded-full" /> 
      <Text className="font-bold text-[25px] mt-2" >{user?.fullName}</Text>
      <Text className="text-[18px] text-gray-500 mt-2" >{user?.primaryEmailAddress.emailAddress}</Text>
    </View>

    <FlatList 
      data={menuList}
      numColumns={3}
      style={{marginTop:20}}
      renderItem={({item, index}) => (
        <TouchableOpacity className="flex-1 p-3 border-[1px] items-center 
        mx-2 mt-4 rounded-lg border-sky-500">
          {item.icon&& <Image source={item?.icon} 
          className="w-[50px] h-[50px]" />}
          <Text className="text-[12px] mt-2 ">{item.name}</Text>
        </TouchableOpacity>
      )}
    />

    </View>
  )
}