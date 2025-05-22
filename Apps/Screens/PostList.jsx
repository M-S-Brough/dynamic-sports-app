import {
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import LatestPostList from "../Components/HomeScreen/LatestPostList";

export default function PostList() {
  const { params } = useRoute();
  const db = getFirestore(app);
  const [postList, setPostList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    params && getPostListByCategory();
  }, [params]);

  const getPostListByCategory = async () => {
    setPostList([]);
    setLoading(true);
    const q = query(
      collection(db, "UserPost"),
      where("category", "==", params.category)
    );
    const snapshot = await getDocs(q);
    setLoading(false);
    snapshot.forEach((doc) => {
      console.log(doc.data());
      setPostList((postList) => [...postList, doc.data()]);
      setLoading(false);
    });
  };
  return (
    <ImageBackground
      source={require("../../assets/images/background.jpg")}
      style={styles.backgroundImage}
    >
      <ScrollView style={styles.scrollViewContent}>
        <View className="p-2">
          {loading ? (
            <ActivityIndicator size={"large"} color={"#000"} />
          ) : postList?.length > 0 ? (
            <LatestPostList latestPostList={postList} />
          ) : (
            <Text className="p-5 text-[20px] mt-24 justify-center text-center text-gray-500">
              No Posts Found
            </Text>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // Ensure the image covers the whole screen
  },
  scrollViewContent: {
    paddingVertical: 30,
    paddingHorizontal: 6,
  },
});
