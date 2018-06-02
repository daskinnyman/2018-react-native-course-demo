//發文頁面
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  ScrollView,
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
    //初始化firebase的ref位置
    this.fbRef = firebase.database().ref();
    this.state = {
      photo: this.props.navigation.state.params.url, //從上一頁傳來的照片位置
      latitude: null, //目前的經度
      longitude: null, //目前的緯度
      MREASON: '啊就撞車', //預設的車禍描述
      permissions: null, //是否有location的權限
      place: null, //geocode回來的地址
      name: null //發文者的名稱
    };
  }

  //在元件掛載完成要執行的動作
  async componentDidMount() {
    //等待取得location的權限
    await this._getPermissions();
    //取得目前位置
    this._getGeolocation();
    //取得個人檔案
    this._getUserProfile();
  }
  /**
   *取得location的使用權限
   */
  _getPermissions = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      //跳出alert提醒使用者沒有權限
      Alert.alert('Permission to access location was denied');
      return;
    }
    //將權限設為true
    this.setState({ permissions: true });
  };

  /**
   *取得個人檔案
   */
  _getUserProfile = async () => {
    try {
      const uid = await AsyncStorage.getItem('@user:key');
      if (uid !== null) {
        //從本地端取得使用者uid
        let res = await this.fbRef.child(`users/${uid}`).once('value');
        //把發文者名稱存入state
        this.setState({ name: res.val().name });
      }
    } catch (err) {
      //捕捉錯誤，若有就使用alert提醒使用者
      Alert.alert('發生錯誤啦');
    }
  };
  /**
   *取得目前地理位置
   */
  _getGeolocation = async () => {
    //如果有權限
    if (this.state.permissions) {
      //取得目前地理位置
      let location = await Location.getCurrentPositionAsync({});
      //把取得的位置轉換為地址
      let place = await Expo.Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      //把經緯度，地址存入state
      this.setState({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        place: place[0].name
      });
    }
  };
  /**
   *處理發文
   */
  _handlePost = async () => {
    //指定geofire的位置
    let geoRef = this.fbRef.child('_GEOFIRE');
    //初始一個geofire的實體
    let geoFire = new GeoFire(geoRef);
    //把今天的日期轉換為字串，大概會像2018/6/2
    let d = new Date().toLocaleDateString();
    //把2018/6/2轉換為2018-6-2，因為geofire的key值不能有/
    let geofireIdx = d.replace(/\//g, '-');
    //以日期儲存方便繪製圖表
    let key = this.fbRef
      .child(`posts/${d}`)
      //_.omit是lodash的函式庫提供的函式，
      //可以返回從原物件刪除指定key值的全新物件
      .push(_.omit(this.state, 'permissions')).key;
    //提供geofire作為索引
    try {
      //設定geofire的位置
      await geoFire.set(`${geofireIdx}|${key}`, [
        this.state.latitude,
        this.state.longitude
      ]);
      //完成發文，回到主畫面
      this.props.navigation.navigate('Home');
    } catch (err) {
      //捕捉錯誤，若有就使用alert提醒使用者
      Alert.alert('發生錯誤啦');
    }
  };

  /**
   * 處理輸入
   * @param text:輸入的文字
   */
  _handleChange = text => {
    this.setState({ MREASON: text });
  };

  render() {
    return (
      <ScrollView style={styles.scrollView}>
        <KeyboardAvoidingView
          style={styles.inputContainer}
          behavior="position"
          enabled
        >
          <Image
            style={styles.previewImage}
            source={{ uri: this.state.photo }}
          />
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
      </ScrollView>
    );
  }
}

export default PostCrashInput;
