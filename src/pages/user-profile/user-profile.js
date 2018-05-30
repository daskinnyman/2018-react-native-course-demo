//個人檔案頁面
import React, { Component } from 'react';
import { Text, View, AsyncStorage, Image } from 'react-native';
import firebase from 'firebase';
import geofire from 'geofire';
import { Button } from 'react-native-elements';
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
              avatar: snapshot.val().avatar
            });
          });
      }
    } catch (err) {}
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            marginTop:-150,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {this.state.avatar && (
            <Image
              style={{ width: 150, height: 150, borderRadius: 4 }}
              source={{ uri: this.state.avatar }}
            />
          )}
          <Text
            style={{
              margin: 8
            }}
          >
            {this.state.name || `無名氏`}
          </Text>
        </View>

        <Button
          title="登出"
          style={{
            margin: 12
          }}
        />
      </View>
    );
  }
}

export default Profile;
