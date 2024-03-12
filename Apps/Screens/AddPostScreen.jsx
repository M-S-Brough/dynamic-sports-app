import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';

export default function AddPostScreen() {

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
  return (
    <View className="p-10">
      <Text className='text-[27px] font-bold'>Add New Post</Text>
      <Formik 
      initialValues={{title:'', name:'', desc:'', category:'', image:''}}
      onSubmit={value => console.log(value)}
      >
      {({handleChange, handleBlur, handleSubmit, values, setFieldValue}) => (
        <View>
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