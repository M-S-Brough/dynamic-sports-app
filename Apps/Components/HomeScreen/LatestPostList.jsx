import { View, Text, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import Post from './Post';

export default function LatestPostList({ latestPostList, heading }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <FlatList 
        data={latestPostList}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        numColumns={2}
        renderItem={({ item, index }) => <Post item={item} />}
        keyExtractor={(item, index) => index.toString()} // Don't forget the keyExtractor for performance reasons
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingBottom: 100 // Adjust the value as needed
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    marginBottom: 8, // Spacing below the heading
  },
});
