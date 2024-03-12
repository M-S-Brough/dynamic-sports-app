import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Image, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

export default function AddPostScreen() {
  const [image, setImage] = useState(null);

  // Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const [categoryList, setCategoryList] = useState([]);

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

  const onSubmitMethod = (value) => {
    value.image = image;
    console.log(value)

  }
  return (
    <View className="p-10">
      <Text className='text-[27px] font-bold'>Add New Post</Text>
      <Formik 
      initialValues={{title:'', name:'', desc:'', category:'', image:''}}
      onSubmit={value => onSubmitMethod(value)}
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
              <Picker.Item key={index} label={item?.name} value={item?.name} />
          ))}
          
        </Picker> 

        </View>
        <TouchableOpacity className='p-4 bg-blue-500 rounded-full mt-10'
        onPress={handleSubmit}>
          <Text className='text-white text-center text-[16px]'>Submit</Text>
        </TouchableOpacity>

      
        </View>
      )}

      </Formik>
    </View>
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