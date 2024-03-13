import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore'
import { app } from '../../firebaseConfig'
import LatestPostList from '../Components/HomeScreen/LatestPostList'

export default function ExploreScreen() {

  const db = getFirestore(app)
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    getAllPosts();
  },[])

  const getAllPosts = async() => {
    setPostList([]);

    const q = query(collection(db, 'UserPost'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      setPostList(postList => [...postList, doc.data()]);
    })

  }

  return (
    <ScrollView className="p-5 py-8 bg-white flex-1">
      <Text className="text-[24px] font-bold">Explore More</Text>
      <LatestPostList latestPostList={postList} />
    </ScrollView>
  )
}