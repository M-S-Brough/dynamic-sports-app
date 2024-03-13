import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Image, ToastAndroid, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig';
import { collection, getDocs, getFirestore, doc, setDoc, addDoc } from "firebase/firestore";
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useUser } from '@clerk/clerk-expo';

export default function AddPostScreen() {
  const [image, setImage] = useState(null);

  // Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const [categoryList, setCategoryList] = useState([]);
const storage = getStorage();
const {user} = useUser();
const [loading, setLoading] = useState(false);

useEffect(() => {
getCategoryList();
}, [])
  const getCategoryList = async() => {
    setCategoryList([]);
      const querySnapshot = await getDocs(collection(db, 'Category'));
      querySnapshot.forEach((doc) => {
        console.log("Docs: ", doc.data());
        setCategoryList(categoryList => [...categoryList, doc.data()])
      })
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmitMethod = async(value, actions) => {
    setLoading(true);
    const resp = await fetch(image);
    const blob = await resp.blob();
    const storageRef = ref(storage, 'allPosts/' + Date.now() + ".jpg");

    // 'file' comes from the Blob or File API
uploadBytes(storageRef, blob).then((snapshot) => {
  console.log('Uploaded a blob or file!');
}).then((resp) => {
  getDownloadURL(storageRef).then(async(downloadUrl) => {
    console.log(downloadUrl);
    value.image = downloadUrl;
    value.userName = user.fullName;
    value.userEmail = user.primaryEmailAddress.emailAddress;
    value.userImage = user.imageUrl;

    const docRef = await addDoc(collection(db, "UserPost"), value)
    if(docRef.id)
    {
      setLoading(false);
      Alert.alert("Post has been added");
      actions.resetForm();
      setImage(null);
    }
  })
});

  }
  return (

    <KeyboardAvoidingView>

    <ScrollView className="p-10">
      <Text className='text-[27px] font-bold'>Add New Post</Text>
      <Formik 
      initialValues={{title:'', desc:'', category:'', image:'', userName: '', userEmail: '', userImage: '', createdAt: Date.now()}}
      onSubmit={(value, actions) => onSubmitMethod(value, actions)}
      validate={(values) => {
        const errors = {}
        if(!values.title) 
        {
          console.log("No title");
          ToastAndroid.show('Title Required', ToastAndroid.SHORT)
          errors.name = "Title is required"
        }
        return errors
      }}  
      >
      {({handleChange, handleBlur, handleSubmit, values, setFieldValue, errors}) => (
        <View>

        <TouchableOpacity onPress={pickImage}>
          {image? 
          <Image source={{uri: image}} style={{width: 100, height: 100, borderRadius: 15}} />
            :
        <Image source={require('./../../assets/images/placeholder.jpg')} 
        style={{width: 100, height: 100, borderRadius: 15}} />
          }
        </TouchableOpacity>

        <TextInput 
        style={styles.input}
        placeholder='Title'
        value={values?.title}
        onChangeText={handleChange('title')}
        />

        <TextInput 
        style={styles.input}
        placeholder='Description'
        value={values?.desc}
        numberOfLines={5}
        onChangeText={handleChange('desc')}
        />

        

      <View style={{borderWidth: 1, borderRadius: 10, marginTop: 15}}>

         <Picker
        selectedValue={values?.category}
        className='border-2'
        style={styles.input}
        onValueChange={itemValue => setFieldValue('category', itemValue)}
        >
          {categoryList.length > 0 && categoryList?.map((item, index) => (
              <Picker.Item key={index} label={item?.name} value={item?.name}  />
          ))}
          
        </Picker> 

        </View>
        <TouchableOpacity 
        style={{
          backgroundColor: loading? '#ccc' : '#007BFF'
        }}
        disabled={loading}
        className='p-4 bg-blue-500 rounded-full mt-10'
        onPress={handleSubmit}>
          {loading?
          <ActivityIndicator color='#fff' />
          :
          <Text className='text-white text-center text-[16px]'>Submit</Text>
        }
          
        </TouchableOpacity>

      
        </View>
      )}

      </Formik>
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 17,
    textAlignVertical: 'top',
    fontSize: 17
  }
})