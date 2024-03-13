import { View, Text, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'

export default function PostDetail() {
    const {params} = useRoute();
    const [post, setPost] = useState([]);

    useEffect(() => {
        params&&setPost(params.post);
    }, [params])
  return (
    <ScrollView className="bg-white">
  <Image 
    source={{uri: post.image}} 
    className="h-[320px] w-full object-cover" 
  />
  <View className="px-4 py-3">
    <View className="border-b border-gray-200 pb-3">
      <Text className="text-[24px] font-bold text-gray-800">{post?.title}</Text>
    </View>
    <Text className="mt-4 font-bold text-[20px] text-gray-900">Description</Text>
    <Text className="mt-2 text-[16px] text-gray-600">{post?.desc}</Text>
  </View>

  <View className="p-4 flex flex-row items-center gap-4 bg-sky-50 rounded-lg mx-4 my-4">
    <Image 
      source={{uri: post.userImage}} 
      className="w-12 h-12 rounded-full border-2 border-sky-200"
    />
    <View>
      <Text className="font-bold text-[18px] text-gray-900">{post.userName}</Text>
      <Text className="text-[14px] text-gray-500">Posted on: {new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}</Text>
    </View>
  </View>
</ScrollView>


  )
}