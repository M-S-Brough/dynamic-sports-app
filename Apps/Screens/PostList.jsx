import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import LatestPostList from '../Components/HomeScreen/LatestPostList';

export default function PostList() {
  const {params} = useRoute();
  const db = getFirestore(app)
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    params&&getPostListByCategory();
  }, [params])

  const getPostListByCategory = async() => {
    setPostList([]);
    const q = query(collection(db, 'UserPost'), where('category', '==', params.category));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      console.log(doc.data())
      setPostList(postList => [...postList, doc.data()])
    })
  }
  return (
    <View className="p-2">
      {postList?.length > 0? <LatestPostList latestPostList={postList} 
      heading={''}
      />
      :<Text className="p-5 text-[20px] mt-24 justify-center text-center text-gray-500">No Posts Found</Text>}
    </View>
  )
}