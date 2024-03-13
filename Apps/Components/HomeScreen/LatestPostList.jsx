import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Post from './Post'

export default function LatestPostList({latestPostList}) {
  return (
    <View className="mt-3">
      <Text className="font-bold text-[20px]">Latest Posts</Text>
      <FlatList 
        data={latestPostList}
        numColumns={2}
        renderItem={({item, index}) => (
      <Post item={item} />
      )}
      />
    </View>
  )
}