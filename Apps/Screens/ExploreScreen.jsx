// Importing necessary React Native and React components
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
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
      console.log(doc);
    });
  };

  // Rendering the component UI
  return (
    <ImageBackground
      source={require("./../../assets/images/background.jpg")} // Make sure to use the correct path
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Displaying a heading */}
        <Text style={styles.headerText}>Explore More</Text>
        {/* Rendering the LatestPostList component and passing the postList as props */}
        <LatestPostList latestPostList={postList} />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // This will ensure the image covers the whole screen
  },
  contentContainer: {
    padding: 5, // Adjusted padding; ensure it matches your design needs
    paddingTop: 32, // Additional padding at the top for aesthetic spacing
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16, // Add some space below the header text
    color: "#FFFFFF", // Ensure text color contrasts well with your background
  },
});
