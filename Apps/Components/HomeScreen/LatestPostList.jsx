import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'

export default function LatestPostList({latestPostList}) {
  return (
    <View className="mt-3">
      <Text className="font-bold text-[20px]">Latest Posts</Text>
      <FlatList 
        data={latestPostList}
        numColumns={2}
        renderItem={({item, index}) => (
      <TouchableOpacity className="flex-1 m-2 p-2 rounded-lg border-[1px] border-slate-200"> 
        <Image source={{uri: item.image}} 
          className="w-full h-[140px] rounded-lg"
        />
        <View>
          <Text className="text-[12px] font-bold mt-2 bg-sky-300
          rounded-full px-1 p-1 text-center">{item.title}</Text>
        </View> 
      </TouchableOpacity>
      )}
      />
    </View>
  )
}