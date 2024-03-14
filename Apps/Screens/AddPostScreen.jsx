// Importing necessary components and modules from React Native, Firebase, Formik, ImagePicker, and Clerk
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { app } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";

// Define the AddPostScreen functional component
export default function AddPostScreen() {
  // State hooks for managing the image, category list, and loading state
  const [image, setImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Firebase Firestore and Storage initialization
  const db = getFirestore(app);
  const storage = getStorage();
  const { user } = useUser(); // Using Clerk to get the current user's information

  // Effect hook to fetch the category list from Firestore on component mount
  useEffect(() => {
    getCategoryList();
  }, []);

  // Function to fetch categories from Firestore and update state
  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, "Category"));
    querySnapshot.forEach((doc) => {
      console.log("Docs: ", doc.data());
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  // Function to allow the user to pick an image from their device
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to handle form submission
  const onSubmitMethod = async (value, actions) => {
    setLoading(true);
    const resp = await fetch(image);
    const blob = await resp.blob();
    const storageRef = ref(storage, "allPosts/" + Date.now() + ".jpg");

    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
      })
      .then((resp) => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          console.log(downloadUrl);
          // Setting additional post information before saving to Firestore
          value.image = downloadUrl;
          value.userName = user.fullName;
          value.userEmail = user.primaryEmailAddress.emailAddress;
          value.userImage = user.imageUrl;

          // Adding the new post to Firestore
          const docRef = await addDoc(collection(db, "UserPost"), value);
          if (docRef.id) {
            setLoading(false);
            Alert.alert("Post has been added");
            actions.resetForm();
            setImage(null);
          }
        });
      });
  };

  // The component's render method returns the UI for adding a new post
  return (
    <KeyboardAvoidingView>
      <ScrollView className="p-10 bg-white">
        {/* Form for adding a new post */}
        <Text className="text-[27px] font-bold">Add New Post</Text>
        <Formik
          initialValues={{
            title: "",
            desc: "",
            category: "",
            image: "",
            userName: "",
            userEmail: "",
            userImage: "",
            createdAt: Date.now(),
          }}
          onSubmit={(value, actions) => onSubmitMethod(value, actions)}
          validate={(values) => {
            const errors = {};
            if (!values.title) {
              ToastAndroid.show("Title Required", ToastAndroid.SHORT);
              errors.name = "Title is required";
            }
            return errors;
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
            errors,
          }) => (
            <View>
              {/* Image picker section */}
              <TouchableOpacity onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 100, height: 100, borderRadius: 15 }}
                  />
                ) : (
                  <Image
                    source={require("./../../assets/images/placeholder.jpg")}
                    style={{ width: 100, height: 100, borderRadius: 15 }}
                  />
                )}
              </TouchableOpacity>

              {/* Input fields for title and description */}
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={values?.title}
                onChangeText={handleChange("title")}
              />

              <TextInput
                style={styles.input}
                placeholder="Description"
                value={values?.desc}
                numberOfLines={5}
                onChangeText={handleChange("desc")}
              />

              {/* Category picker */}
              <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 15 }}>
                <Picker
                  selectedValue={values?.category}
                  style={styles.input}
                  onValueChange={(itemValue) =>
                    setFieldValue("category", itemValue)
                  }
                >
                  {categoryList.length > 0 &&
                    categoryList?.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item?.name}
                        value={item?.name}
                      />
                    ))}
                </Picker>
              </View>

              {/* Submit button */}
              <TouchableOpacity
                style={{ backgroundColor: loading ? "#ccc" : "#007BFF" }}
                disabled={loading}
                className="p-4 bg-blue-500 rounded-full mt-10"
                onPress={handleSubmit}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center text-[16px]">
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// StyleSheet for the component
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 17,
    textAlignVertical: "top",
    fontSize: 17,
  },
});
