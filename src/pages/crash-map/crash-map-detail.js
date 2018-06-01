//撞車地圖的細節頁面
import React, { Component } from 'react';
import { Text, View, Dimensions, Image } from 'react-native';
import { styles } from './crash-map-style';
const { width } = Dimensions.get('window');

const CrashDetail = props => {
  const data = props.navigation.state.params.data;
  return (
    <View style={styles.detailContainer}>
      <Image style={styles.detailImage} source={{ uri: data.photo }} />
      <Text style={styles.detailText}>{data.name}説:</Text>
      <Text>{data.MREASON}</Text>
    </View>
  );
};

export default CrashDetail;
