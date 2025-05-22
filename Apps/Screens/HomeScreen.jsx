import React, { useEffect, useState } from "react";
import { View, ScrollView, ImageBackground, StyleSheet } from "react-native";
import Header from "../Components/HomeScreen/Header";
import Slider from "../Components/HomeScreen/Slider";
import Categories from "../Components/HomeScreen/Categories";
import LatestPostList from "../Components/HomeScreen/LatestPostList";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { app } from "../../firebaseConfig";

export default function HomeScreen() {
  const db = getFirestore(app);
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latestPostList, setLatestPostList] = useState([]);

  useEffect(() => {
    // Listener for slider items
    const sliderUnsub = onSnapshot(collection(db, "Slider"), (snapshot) => {
      const fetchedSliderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSliderList(fetchedSliderList);
    });

    // Listener for categories
    const categoriesUnsub = onSnapshot(
      collection(db, "Category"),
      (snapshot) => {
        const fetchedCategoryList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          
        }));
        setCategoryList(fetchedCategoryList);
        
      }
    );

    // Listener for latest posts
    const postsUnsub = onSnapshot(
      query(collection(db, "UserPost"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const fetchedLatestPostList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLatestPostList(fetchedLatestPostList);
      }
    );

    // Cleanup function to unsubscribe from the listeners when the component unmounts
    return () => {
      sliderUnsub();
      categoriesUnsub();
      postsUnsub();
    };
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/background.jpg")}
      style={styles.backgroundImage}
    >
      <ScrollView style={styles.scrollViewContent}>
        <Header />
        <Slider sliderList={sliderList} />
        <Categories categoryList={categoryList} />
        <LatestPostList
          latestPostList={latestPostList}
          heading={"Latest Posts"}
        />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 30,
    paddingHorizontal: 6,
    paddingBottom: 60,
  },
});
