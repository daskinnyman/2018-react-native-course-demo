//個人檔案頁面
import React, { Component } from 'react';
import { Text, View, AsyncStorage, Alert, Image } from 'react-native';

import firebase from 'firebase';

import { SocialIcon } from 'react-native-elements';

import { styles } from './user-profile-style';
class Profile extends Component {
  constructor(props) {
    super(props);
    //初始化firebase的ref位置
    this.fbRef = firebase.database().ref();

    this.state = {
      name: null, //使用者名稱
      avatar: null //使用者頭像
    };
  }

  //在元件掛載完成要執行的動作
  componentDidMount() {
    //取得使用者個人檔案
    this._getUserProfile();
  }

  /**
   *處理使用者登出
   */
  _handleLogout = async () => {
    try {
      //等待登出成功
      await firebase.auth().signOut();
      //登出成功後刪除儲存在本地的uid
      await AsyncStorage.removeItem('@user:key');
      //成功後導頁到App首頁
      this.props.navigation.navigate('Auth');
    } catch (err) {
      //捕捉錯誤，若有就使用alert提醒使用者
      Alert.alert(`發生錯誤啦！`);
    }
  };

  /**
   *取得使用者檔案
   */
  _getUserProfile = async () => {
    try {
      //從本地端取得使用者uid
      const uid = await AsyncStorage.getItem('@user:key');

      if (uid !== null) {
        //如果uid不為空，拿uid去firebase取得使用者資料
        let res = await this.fbRef.child(`users/${uid}`).once('value');

        this.setState({
          name: res.val().name,
          avatar: res.val().avatar
        });
        return;
      }
    } catch (err) {
      //捕捉錯誤，若有就使用alert提醒使用者
      Alert.alert(`發生錯誤啦！`);
    }
  };

  render() {
    //畫面渲染
    return (
      <View style={styles.container}>
        <View style={styles.userProfileWrapper}>
          {this.state.avatar && (
            <Image style={styles.avatar} source={{ uri: this.state.avatar }} />
          )}
          <Text style={styles.username}>{this.state.name || `無名氏`}</Text>
        </View>
        <SocialIcon
          style={styles.logoutButton}
          title="登出帳號"
          onPress={this._handleLogout}
          button
          type="facebook"
        />
      </View>
    );
  }
}

export default Profile;
