//使用者登入頁面
import React, { Component } from 'react';
import { Text, View, Alert, AsyncStorage, Image } from 'react-native';

import firebase from 'firebase';

import { SocialIcon } from 'react-native-elements';

import { styles } from './user-login-style';
export default class UserLogin extends Component {
  constructor(props) {
    super(props);
    //初始化firebase的ref位置
    this.fbRef = firebase.database().ref();
    this.state = { isAuth: null };
  }

  //在元件掛載完成要執行的動作
  componentDidMount() {
    //取得使用者個人檔案
    this._getUserProfile();
  }

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

        //登入成功，將isAuth修改為true
        this.setState({
          name: res.val().name,
          isAuth: true
        });

        //登入成功後導頁到主頁面
        this.props.navigation.navigate('Main');
        return;
      }

      //登入失敗，將isAuth修改為false
      this.setState({ isAuth: false });
      Alert.alert(`登入失敗`);
    } catch (err) {
      //捕捉錯誤，若有就使用alert提醒使用者
      Alert.alert(`發生錯誤啦！`);
    }
  };

  /**
   *處理使用者登入
   */
  _logIn = async () => {
    //使用expo進行fb登入
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      '452589141852273',
      {
        permissions: ['public_profile']
      }
    );

    //判斷登入狀態
    if (type === 'success') {
      try {
        //利用臉書api取得user資料
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        //讓登入狀態可以保存起來
        await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL);

        //使用從expo登入取得的credential登入firebase
        let res = await firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential);

        const { user, additionalUserInfo } = res;

        //登入成功，把uid存入手機
        await AsyncStorage.setItem('@user:key', user.uid);

        //使用者的欄位
        let userData = {
          name: user.displayName,
          uid: user.uid,
          avatar: user.photoURL
        };

        //新登入就創建資料
        if (additionalUserInfo.isNewUser) {
          firebase
            .database()
            .ref(`users/${user.uid}`)
            .set(userData);
        }
        //取得使用者資料
        await firebase
          .database()
          .ref(`users/${user.uid}`)
          .once('value');
        //導頁至主畫面
        this.props.navigation.navigate('Main');
      } catch (err) {
        //捕捉錯誤，若有就使用alert提醒使用者
        Alert.alert(`發生錯誤啦！`);
      }
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('../../../assets/intro.png')}
        />
        <Text style={styles.appDescritpion}>
          加入歹霸底底隆，分享你撞車的點點滴滴
        </Text>
        {this.state.isAuth === false && (
          <SocialIcon
            style={{ width: 150, marginTop: 32 }}
            title="使用臉書登入"
            onPress={this._logIn}
            button
            type="facebook"
          />
        )}
      </View>
    );
  }
}
