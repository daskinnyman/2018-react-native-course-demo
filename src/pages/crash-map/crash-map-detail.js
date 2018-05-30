//撞車地圖的細節頁面
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { styles } from './crash-map-style';
import firebase from 'firebase';
import geofire from 'geofire';

class CrashDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
        console.log(this.props.navigation.state.params.data)
    }
    render() {
        return (
          <View style={{ flex: 1, backgroundColor: 'white' }}>
          </View>  
        );
    }
}

export default CrashDetail;