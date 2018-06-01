//發文頁面
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { Location, Permissions } from 'expo';

import _ from 'lodash';
import firebase from 'firebase';
import GeoFire from 'geofire';

import { Icon, FormLabel, FormInput } from 'react-native-elements';

import { styles } from './post-crash-style';

class PostCrashInput extends Component {
  constructor(props) {
    super(props);
    this.fbRef = firebase.database().ref();
    this.suscribedSevice = null;
    this.state = {
      photo: this.props.navigation.state.params.url,
      latitude: null,
      longitude: null,
      MREASON: '啊就撞車',
      permissions: null,
      place: null,
      postBy: null
    };
  }

  async componentDidMount() {
    await this._getPermissions();
    this._getGeolocation();
    this._getUserProfile();
  }

  _getPermissions = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState(
        {
          Error: 'Permission to access location was denied'
        },
        () => {
          Alert.alert('Permission to access location was denied');
        }
      );
      return;
    }
    this.setState({ permissions: true });
  };

  _getUserProfile = async () => {
    try {
      const uid = await AsyncStorage.getItem('@user:key');
      if (uid !== null) {
        // We have data!!
        let res = await this.fbRef.child(`users/${uid}`).once('value');

        this.setState({ name: res.val().name });
      }
    } catch (err) {
      Alert.alert('發生錯誤啦');
    }
  };

  _getGeolocation = async () => {
    if (this.state.permissions) {
      let location = await Location.getCurrentPositionAsync({});
      let place = await Expo.Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      this.setState({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        place: place[0].name
      });
    }
  };

  _handlePost = async () => {
    let geoRef = this.fbRef.child('_GEOFIRE');
    let geoFire = new GeoFire(geoRef);
    let d = new Date().toLocaleDateString();
    let geofireIdx = d.replace(/\//g, '-');
    //以日期儲存方便繪製圖表
    let key = this.fbRef
      .child(`posts/${d}`)
      .push(_.omit(this.state, 'permissions')).key;
    //提供geofire作為索引
    try {
      await geoFire.set(`${geofireIdx}|${key}`, [
        this.state.latitude,
        this.state.longitude
      ]);

      this.props.navigation.navigate('Home');
    } catch (err) {
      console.log(err);
      Alert.alert('發生錯誤啦');
    }
  };

  _handleChange = text => {
    this.setState({ MREASON: text });
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.inputContainer}
        behavior="position"
        enabled
      >
        <Image style={styles.previewImage} source={{ uri: this.state.photo }} />
        <FormLabel>位置</FormLabel>
        <FormInput
          value={this.state.place || `正在抓取位置`}
          editable={false}
          onChangeText={this._handleChange}
        />
        <FormLabel>描述</FormLabel>
        <FormInput
          placeholder={this.state.MREASON}
          onChangeText={this._handleChange}
        />
        <View style={styles.postContainer}>
          <TouchableOpacity
            style={styles.postButton}
            onPress={this._handlePost}
          >
            <Icon type="ionicon" size={35} color="#4A4A4A" name="ios-add" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default PostCrashInput;
