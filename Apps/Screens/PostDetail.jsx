// Importing necessary React Native components and APIs for UI, effects, sharing, and navigation
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";

export default function PostDetail({ navigation }) {
  // State and hooks initialization
  const { params } = useRoute();
  const [post, setPost] = useState([null]);
  const { user } = useUser();
  const db = getFirestore(app);
  const nav = useNavigation();

  // useEffect to set the post data from navigation params and set up the share button
  useEffect(() => {
    console.log(params.post);
    if (params?.post) {
      setPost(params.post);
    } else {
      console.error("No post data found in navigation parameters!");
    }
    shareButton();
  }, [params]);

  // Function to dynamically add a share button to the navigation header
  const shareButton = () => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          onPress={() => sharePost()}
          name="share-social-outline"
          size={24}
          color="white"
          style={{ marginRight: 15 }}
        />
      ),
    });
  };

  const sharePost = async () => {
    // Constructing the message to share
    const message = `Check out this post: ${post.title}`;

    try {
      const result = await Share.share({
        message,
        // This is mostly used by email
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log("Shared with activity type: ", result.activityType);
        } else {
          // shared
          console.log("Shared");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("Dismissed");
      }
    } catch (error) {
      console.error("Error while sharing the post:", error.message);
    }
  };

  // Function to confirm post deletion by the user
  const deleteUserPost = () => {
    Alert.alert("WARNING!!", "You are about to delete your post...", [
      {
        text: "Confirm",
        onPress: () => deleteFromFirestore(),
      },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
    ]);
  };

  // Function to delete the post from Firestore
  const deleteFromFirestore = async () => {
    console.log("Delete post");
    const q = query(
      collection(db, "UserPost"),
      where("title", "==", post.title)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      deleteDoc(doc.ref).then((resp) => {
        console.log("Deleted doc...");
        nav.goBack();
      });
    });
  };

  // Component's UI
  return (
    <ImageBackground
      source={require("../../assets/images/background.jpg")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={{ uri: post.image }} style={styles.postImage} />
        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{post?.title}</Text>
          </View>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{post?.desc}</Text>
        </View>

        <View style={styles.userContainer}>
          <Image source={{ uri: post.userImage }} style={styles.userImage} />
          <View>
            <Text style={styles.postedBy}>Posted by:</Text>
            <Text style={styles.userName}>{post.userName}</Text>
          </View>
        </View>

        {user?.primaryEmailAddress.emailAddress === post.userEmail && (
          <TouchableOpacity
            onPress={() => deleteUserPost()}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Delete Post</Text>
          </TouchableOpacity>
        )}
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
    paddingBottom: 60, // Add padding to avoid content being hidden by the navigation bar
  },
  postImage: {
    height: 320,
    width: "100%",
    resizeMode: "cover",
    borderRadius: 20, // Adjust the borderRadius as needed
  },
  textContainer: {
    padding: 12,
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  descriptionTitle: {
    marginTop: 16,
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  descriptionText: {
    marginTop: 8,
    fontSize: 16,
    color: "white",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "white",
    marginRight: 8,
  },
  postedBy: {
    color: "white",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 20,
    padding: 12,
    margin: 8,
    alignItems: "center", // To center the text inside the TouchableOpacity
  },
  deleteButtonText: {
    color: "white",
    textAlign: "center",
  },
});
