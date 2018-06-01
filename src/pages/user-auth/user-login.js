//使用者登入頁面
import React from 'react';
import { Text, View, Alert, AsyncStorage, Image } from 'react-native';

import firebase from 'firebase';

import { SocialIcon } from 'react-native-elements';

import { styles } from './user-login-style';
export default class UserLogin extends React.Component {
  constructor(props) {
    super(props);
    this.fbRef = firebase.database().ref();
    this.state = {
      isAuth: null
    };
  }

  componentDidMount() {
    this._getUserProfile();
  }

  _getUserProfile = async () => {
    try {
      const uid = await AsyncStorage.getItem('@user:key');
      if (uid !== null) {
        // We have data!!
        this.fbRef
          .child(`users/${uid}`)
          .once('value')
          .then(snapshot => {
            this.setState({
              name: snapshot.val().name,
              isAuth: true
            });
            this.props.navigation.navigate('Main');
          });
        return;
      }
      this.setState({
        isAuth: false
      });
    } catch (err) {
      Alert.alert(`發生錯誤啦！`);
    }
  };
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
        let res = await firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential);

        const { user, additionalUserInfo } = res;

        await AsyncStorage.setItem('@user:key', user.uid);
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
        await firebase
          .database()
          .ref(`users/${user.uid}`)
          .once('value');
        this.props.navigation.navigate('Main');
      } catch (err) {
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
