//發文頁面
import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import firebase from 'firebase';
import geofire from 'geofire';

class PostCrashInput extends Component {
  constructor(props) {
    super(props);
    this.state = { url: this.props.navigation.state.params.url };
  }

  render() {
    return (
      <View>
        <Image style={{width:365,height:200}} source={{ uri: this.state.url }} />
      </View>
    );
  }
}

export default PostCrashInput;
