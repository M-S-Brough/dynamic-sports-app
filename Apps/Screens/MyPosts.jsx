import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { app } from '../../firebaseConfig'
import { useUser } from '@clerk/clerk-expo'
import LatestPostList from '../Components/HomeScreen/LatestPostList'
import { useNavigation } from '@react-navigation/native'

export default function MyPosts() {

  const db = getFirestore(app)
  const {user} = useUser();
  const [postList, setPostList] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    user && getUserPost();
  }, [user])

  useEffect(() => {
    navigation.addListener('focus', (e) => {
      getUserPost();
    })
  },[navigation])

  const getUserPost = async() => {
    setPostList([]);
    const q = query(collection(db, 'UserPost'), where('userEmail', '==', user?.primaryEmailAddress?.emailAddress))
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      
      setPostList(postList => [...postList, doc.data()]);
    })

}

  return (
    <View>
      <LatestPostList latestPostList={postList} 
      
      
      />
    </View>
  )
}