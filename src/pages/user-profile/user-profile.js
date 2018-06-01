//個人檔案頁面
import React, { Component } from 'react';
import { Text, View, AsyncStorage, Alert, Image } from 'react-native';
import firebase from 'firebase';
import { SocialIcon } from 'react-native-elements';
import { styles } from './user-profile-style';
class Profile extends Component {
  constructor(props) {
    super(props);
    this.fbRef = firebase.database().ref();
    this.state = {
      name: null,
      avatar: null
    };
  }

  componentDidMount() {
    this._getUserProfile();
  }

  _handleLogout = async () => {
    try {
      let res = await firebase.auth().signOut();
      await AsyncStorage.removeItem('@user:key');
      this.props.navigation.navigate('Auth');
    } catch (err) {
      Alert.alert(`發生錯誤啦！`);
    }
  };

  _getUserProfile = async () => {
    try {
      const uid = await AsyncStorage.getItem('@user:key');
      if (uid !== null) {
        let res = await this.fbRef.child(`users/${uid}`).once('value');
        this.setState({
          name: res.val().name,
          avatar: res.val().avatar
        });
      }
    } catch (err) {
      Alert.alert(`發生錯誤啦！`);
    }
  };

  render() {
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
