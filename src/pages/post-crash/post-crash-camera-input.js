//發文頁面
import React, { Component } from 'react';
import { Text, View, Image, Button, TextInput } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import firebase from 'firebase';
import GeoFire from 'geofire';

class PostCrashInput extends Component {
  constructor(props) {
    super(props);
    this.fbRef = firebase.database().ref();
    this.geoRef = this.fbRef.child('_GEOFIRE');
    this.geoFire = new GeoFire(this.geoRef);
    this.user = firebase.auth().currentUser;
    this.state = {
      url: this.props.navigation.state.params.url,
      latitude: null,
      longitude: null
    };
  }

  async componentDidMount() {
    await this._getGeolocation();
  }

  _getGeolocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        Error: 'Permission to access location was denied'
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
  };

  _handlePost = () => {
    console.log(this.state);
    this.geoFire
      .set('some_key', [this.state.latitude, this.state.longitude])
      .then(
        function() {
          console.log('Provided key has been added to GeoFire');
        },
        function(error) {
          console.log('Error: ' + error);
        }
      );
  };

  render() {
    return (
      <View>
        <Image
          style={{ width: 365, height: 200 }}
          source={{ uri: this.state.url }}
        />
        <Button title="發文" onPress={this._handlePost} />
      </View>
    );
  }
}

export default PostCrashInput;
