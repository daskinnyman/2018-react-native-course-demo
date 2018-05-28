//使用者登入頁面
import React from 'react';
import { Text, View, Alert, Button } from 'react-native';
import firebase from 'firebase';
import { styles } from './user-login-style';
export default class UserLogin extends React.Component {
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
      //利用臉書api取得user資料
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`
      );
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      //讓登入狀態可以保存起來
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          //利用credential登入firebase
          firebase
            .auth()
            .signInAndRetrieveDataWithCredential(credential)
            .then(res => {
              //登入成功的邏輯
              const { user, additionalUserInfo } = res;
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
              //取得資料，成功後導頁
              firebase
                .database()
                .ref(`users/${user.uid}`)
                .once('value')
                .then(()=> {
                  this.props.navigation.navigate('Main');
                });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(error => {
          // Handle Errors here.
        });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Button title="fb login" onPress={this._logIn} />
      </View>
    );
  }
}
