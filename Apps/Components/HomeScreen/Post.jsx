import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Post({ item }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() => navigation.push('post-detail', { post: item })}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View>
        <Text style={styles.postTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    margin: 15,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'white', // slate-200 is not a color in React Native. Adjust as needed.
  },
  postImage: {
    width: '100%',
    height: 140,
    borderRadius: 6,
  },
  postTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    backgroundColor: 'skyblue', // Adjust color as needed. 'sky-300' is a TailwindCSS class, not a React Native color.
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
});
