//發文頁面
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import firebase from 'firebase';
import GeoFire from 'geofire';
import {
  Icon,
  FormLabel,
  FormInput,
  FormValidationMessage
} from 'react-native-elements';

const { width } = Dimensions.get('window');
class PostCrashInput extends Component {
  constructor(props) {
    super(props);
    this.fbRef = firebase.database().ref();
    this.state = {
      photo: this.props.navigation.state.params.url,
      latitude: null,
      longitude: null,
      MREASON: '啊就撞車'
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
    let d = new Date().toLocaleDateString();
    this.fbRef.child(`posts/${d}`).set(this.state);
  };

  _handleChange = text => {
    console.log(text);
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ padding: 12 }}>
          <Image
            style={{ width: width - 24, height: width - 24, borderRadius: 4 }}
            source={{ uri: this.state.photo }}
          />
        </View>
        <FormLabel>位置</FormLabel>
        <FormInput onChangeText={this._handleChange} />
        <FormValidationMessage>Error message</FormValidationMessage>
        <FormLabel>描述</FormLabel>
        <FormInput onChangeText={this._handleChange} />
        <FormValidationMessage>Error message</FormValidationMessage>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end'
          }}
        >
          <TouchableOpacity
            style={
              {
                height: 50,
                width: 50,
                margin: 12,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFD05B',
                shadowColor: '#000000',
                shadowOpacity: 0.5,
                shadowOffset: { widht: 0, height: 2 },
                shadowRadius: 4
              } //maybe is for ios only
            }
            onPress={this._handlePost}
          >
            <Icon
              type="ionicon"
              size={35}
              style={{ color: '#4A4A4A' }}
              name="ios-add"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default PostCrashInput;
