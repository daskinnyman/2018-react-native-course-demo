import React from 'react';
import { Text, View, Alert, Button } from 'react-native';
import { styles } from './user-login-style';
import firebase from 'firebase';
export default class UserLogin extends React.Component {
  _logIn = async () => {
    console.log(123);
    //使用expo進行fb登入
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      '452589141852273',
      {
        permissions: ['public_profile']
      }
    );
    if (type === 'success') {
      //利用臉書api取得user資料
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`
      );
      // Alert.alert(
      //     'Logged in!',
      //     `Hi ${(await response.json()).name}!`,
      // );
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      //利用credential登入firebase
      firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential)
        .then(res => {
          console.log(res);
          console.log(123);
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
