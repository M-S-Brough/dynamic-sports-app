import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'


export default function Categories({categoryList}) {

  const navigation = useNavigation();
  return (

    <View className="mt-3">
      <Text className="font-bold text-[20px] text-white">Categories</Text>
      <FlatList 
        data={categoryList}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        numColumns={4}
        renderItem={({item, index}) => (
          <TouchableOpacity 
          onPress={() => navigation.navigate('post-list', {
            category: item.name
          })}
          className="flex-1 items-center justify-center p-2 
          border-[1px] border-sky-300 m-1 h-[80px] rounded-lg"> 
            <Image source={{uri: item?.icon}}
            className="w-[40px] h-[40px]" />

            <Text className="text-[12px] mt-1  text-white">{item.name}</Text>
            
             </TouchableOpacity>
        )}
      />
    </View>
  )
}