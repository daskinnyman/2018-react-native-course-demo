//撞車地圖的細節頁面
import React, { Component } from 'react';
import { Text, View, Dimensions, Image } from 'react-native';
import { styles } from './crash-map-style';
const { width } = Dimensions.get('window');
class CrashDetail extends Component {
  constructor(props) {
    super(props);
    this.data = this.props.navigation.state.params.data;
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', padding: 12 }}>
        <Image
          style={{ width: width - 24, height: width - 24, borderRadius: 4 }}
          source={{ uri: this.data.photo }}
        />
        <Text style={{ marginTop:12,marginBottom: 4, fontSize: 18, fontWeight: 'bold' }}>
          {this.data.name}説:
        </Text>
        <Text>{this.data.MREASON}</Text>
      </View>
    );
  }
}

export default CrashDetail;
