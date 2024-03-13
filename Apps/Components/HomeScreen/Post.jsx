import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

export default function Post({item}) {
  return (
    <TouchableOpacity className="flex-1 m-2 p-2 rounded-lg border-[1px] border-slate-200"> 
        <Image source={{uri: item.image}} 
          className="w-full h-[140px] rounded-lg"
        />
        <View>
          <Text className="text-[12px] font-bold mt-2 bg-sky-300
          rounded-full px-1 p-1 text-center">{item.title}</Text>
        </View> 
      </TouchableOpacity>
  )
}