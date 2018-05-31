//使用者登入頁面
import React from 'react';
import { Text, View, Alert, AsyncStorage } from 'react-native';
import { SocialIcon } from 'react-native-elements';
import firebase from 'firebase';
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
    } catch (err) {}
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
            .then(async res => {
              //登入成功的邏輯
              const { user, additionalUserInfo } = res;
              try {
                await AsyncStorage.setItem('@user:key', user.uid);
              } catch (error) {
                // Error saving data
              }
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
                .then(() => {
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
        <Text>加入歹霸底底隆，分享你撞車的點點滴滴</Text>
        {this.state.isAuth === false && (
          <SocialIcon
            style={{width:150,marginTop:32}}
            title='使用臉書登入'
            onPress={this._logIn}
            button
            type='facebook'
          />
        )}
      </View>
    );
  }
}
