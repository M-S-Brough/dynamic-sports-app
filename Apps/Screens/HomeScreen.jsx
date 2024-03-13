import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Components/HomeScreen/Header'
import Slider from '../Components/HomeScreen/Slider'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { app } from '../../firebaseConfig'
import Categories from '../Components/HomeScreen/Categories'

export default function HomeScreen() {

  const db = getFirestore(app);
  const [sliderList, setSliderList] = useState([]);
  const [categoryList ,setCategoryList] = useState([]);

  useEffect(() => {
      getSlider();
      getCategoryList();
  },[])

  const getSlider = async () => {
    setSliderList([])
    const querySnapshot = await getDocs(collection(db, "Slider"));
    querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  
  setSliderList(sliderList => [...sliderList, doc.data()]);

});

  }

  const getCategoryList = async() => {
    setCategoryList([]);
      const querySnapshot = await getDocs(collection(db, 'Category'));
      querySnapshot.forEach((doc) => {
        console.log("Docs2: ", doc.data());
        setCategoryList(categoryList => [...categoryList, doc.data()])
      })
  }

  return (
    <View className="py-8 px-6 bg-white flex-1">
      <Header />
      <Slider sliderList={sliderList}/>
      <Categories categoryList={categoryList} />
    </View>
  )
}