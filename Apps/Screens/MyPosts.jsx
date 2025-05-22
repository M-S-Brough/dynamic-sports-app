// Importing necessary components and modules from React Native, Firebase, Clerk
import { View, Text, ScrollView, ImageBackground, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import LatestPostList from "../Components/HomeScreen/LatestPostList";
import { useNavigation } from "@react-navigation/native";

export default function MyPosts() {
  const db = getFirestore(app);
  const { user } = useUser();
  const [postList, setPostList] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (user) getUserPost();
  }, [user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUserPost();
    });
    return unsubscribe;
  }, [navigation]);

  const getUserPost = async () => {
    setPostList([]);
    const q = query(
      collection(db, "UserPost"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      setPostList((postList) => [...postList, doc.data()]);
    });
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background.jpg")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <LatestPostList latestPostList={postList} />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  contentContainer: {
    padding: 5,
    paddingTop: 32,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#FFFFFF",
    textAlign: "center", // Center align the text
  },
});
