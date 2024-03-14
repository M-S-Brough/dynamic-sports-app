// Importing necessary React Native and React components
import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
// Importing Firestore functions to interact with the database
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
// Importing the Firebase configuration from a local file
import { app } from "../../firebaseConfig";
// Importing a custom component to display the list of latest posts
import LatestPostList from "../Components/HomeScreen/LatestPostList";

// Defining the ExploreScreen functional component
export default function ExploreScreen() {
  // Initialize Firestore with the Firebase app configuration
  const db = getFirestore(app);
  // State hook to store and manage the list of posts
  const [postList, setPostList] = useState([]);

  // Effect hook to fetch all posts from Firestore when the component mounts
  useEffect(() => {
    getAllPosts();
  }, []); // The empty dependency array means this effect runs only once after the initial render

  // Async function to fetch all posts from Firestore
  const getAllPosts = async () => {
    // Clearing the existing posts list
    setPostList([]);

    // Creating a query to fetch posts from the 'UserPost' collection, ordered by 'createdAt' field in descending order
    const q = query(collection(db, "UserPost"), orderBy("createdAt", "desc"));
    // Executing the query and storing the result in 'snapshot'
    const snapshot = await getDocs(q);

    // Iterating over each document in the snapshot and adding its data to the postList state
    snapshot.forEach((doc) => {
      setPostList((postList) => [...postList, doc.data()]);
    });
  };

  // Rendering the component UI
  return (
    // Using ScrollView to allow scrolling through the content
    <ScrollView className="p-5 py-8 bg-white flex-1">
      {/* Displaying a heading */}
      <Text className="text-[24px] font-bold">Explore More</Text>
      {/* Rendering the LatestPostList component and passing the postList as props */}
      <LatestPostList latestPostList={postList} />
    </ScrollView>
  );
}
