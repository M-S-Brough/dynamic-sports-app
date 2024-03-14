// Importing necessary React Native components for UI layout
import { View, Text, ScrollView } from "react-native";
// Importing React hooks for managing state and side effects
import React, { useEffect, useState } from "react";
// Importing custom components to be used in the home screen
import Header from "../Components/HomeScreen/Header";
import Slider from "../Components/HomeScreen/Slider";
import Categories from "../Components/HomeScreen/Categories";
import LatestPostList from "../Components/HomeScreen/LatestPostList";
// Importing Firestore utilities to interact with Firebase database
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  orderBy,
} from "firebase/firestore";
// Importing the Firebase app configuration
import { app } from "../../firebaseConfig";

// Defining the HomeScreen functional component
export default function HomeScreen() {
  // Initializing Firestore with the app configuration
  const db = getFirestore(app);
  // State hooks for managing the lists of slider items, categories, and latest posts
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latestPostList, setLatestPostList] = useState([]);

  // Effect hook to fetch data when the component mounts
  useEffect(() => {
    getSlider();
    getCategoryList();
    getLatestPostList();
  }, []); // The empty dependency array means this effect runs only once after the initial render

  // Async function to fetch slider items from Firestore
  const getSlider = async () => {
    setSliderList([]); // Clearing the existing slider list
    const querySnapshot = await getDocs(collection(db, "Slider"));
    querySnapshot.forEach((doc) => {
      // Adding each document's data to the sliderList state
      setSliderList((sliderList) => [...sliderList, doc.data()]);
    });
  };

  // Async function to fetch category list from Firestore
  const getCategoryList = async () => {
    setCategoryList([]); // Clearing the existing category list
    const querySnapshot = await getDocs(collection(db, "Category"));
    querySnapshot.forEach((doc) => {
      // Adding each document's data to the categoryList state
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  // Async function to fetch the latest posts from Firestore
  const getLatestPostList = async () => {
    setLatestPostList([]); // Clearing the existing latest post list
    // Fetching posts ordered by 'createdAt' in descending order
    const querySnapshot = await getDocs(
      collection(db, "UserPost"),
      orderBy("createdAt", "desc")
    );
    querySnapshot.forEach((doc) => {
      // Adding each document's data to the latestPostList state
      setLatestPostList((latestPostList) => [...latestPostList, doc.data()]);
    });
  };

  // Rendering the HomeScreen component
  return (
    <ScrollView className="py-8 px-6 bg-white flex-1">
      {/* Render the Header component */}
      <Header />
      {/* Render the Slider component, passing the sliderList as props */}
      <Slider sliderList={sliderList} />
      {/* Render the Categories component, passing the categoryList as props */}
      <Categories categoryList={categoryList} />
      {/* Render the LatestPostList component, passing the latestPostList as props */}
      <LatestPostList
        latestPostList={latestPostList}
        heading={"Latest Posts"}
      />
    </ScrollView>
  );
}
