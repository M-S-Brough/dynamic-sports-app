import { View, Text, Image, ScrollView, TouchableOpacity, Share, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { useUser } from '@clerk/clerk-expo';
import { collection, deleteDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

export default function PostDetail({navigation}) {
    const {params} = useRoute();
    const [post, setPost] = useState([]);
    const {user} = useUser();
    const db  = getFirestore(app)
    const nav = useNavigation();

    useEffect(() => {
        params&&setPost(params.post);
        shareButton();
    }, [params, navigation])

    const shareButton = ()=> {
        navigation.setOptions({
            headerRight: () => (
                
                <Ionicons onPress={() => sharePost()} 
                name="share-social-outline" size={24} color="black"
                style={{marginRight: 15}}
                />
                
            ),
          });

    }

    const sharePost = async() => {
        const content = {
            message: post?.title + "\n" + post?.desc, 

        }
        Share.share(content).then(resp => {
            console.log(resp);
        }, (error) => {
            console.log(error);
        })
    }

    const deleteUserPost = () => {
      Alert.alert('WARNING!!', 'You are about to delete your post...', [{
        text: 'Confirm',
        onPress: () => deleteFromFirestore()
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'

      }
         
      ])
    }

    const deleteFromFirestore = async() => {
      console.log('Delete post')
      const q = query(collection(db, 'UserPost'), where('title', '==', post.title))
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => {
        deleteDoc(doc.ref).then(resp => {
          console.log("Deleted doc...");
          nav.goBack();
        })
      })

    }

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
{user?.primaryEmailAddress.emailAddress == post.userEmail?
  <TouchableOpacity 
  onPress={() => deleteUserPost()}
  className="z-40 bg-red-500 rounded-full p-4 m-2" >
    <Text className="text-center text-white">Delete Post</Text>

</TouchableOpacity>
:
<Text></Text>
}
  
</ScrollView>


  )
}