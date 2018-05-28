//發文頁面
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import firebase from 'firebase';
import geofire from 'geofire';

class PostCrashInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    console.log(this.props.navigation.state.params);
  }
  
  render() {
    return <View />;
  }
}

export default PostCrashInput;