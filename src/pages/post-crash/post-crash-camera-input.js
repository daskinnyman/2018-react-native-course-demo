//發文頁面
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Button,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  KeyboardAvoidingView
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
    this.geoRef = this.fbRef.child('_GEOFIRE');
    this.geoFire = new GeoFire(this.geoRef);
    this.state = {
      photo: this.props.navigation.state.params.url,
      latitude: null,
      longitude: null,
      MREASON: '啊就撞車',
      place: null,
      postBy:null
    };
  }

  componentDidMount() {
    this._getGeolocation();
    this._getUserProfile();
  }

  _getUserProfile = async () => {
    try {
      const uid = await AsyncStorage.getItem('@user:key');
      if (uid !== null) {
        // We have data!!
        this.fbRef.child(`users/${uid}`).once('value').then(snapshot=>{
          this.setState({name:snapshot.val().name})
        })
      }
    } catch (err) {}
  };

  _getGeolocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        Error: 'Permission to access location was denied'
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    let place = await Expo.Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
    console.log(place);
    this.setState({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      place: place[0].name
    });
  };

  _handlePost = () => {
    console.log(this.state);
    let d = new Date().toLocaleDateString();
    let geofireIdx = d.replace(/\//g, '-');
    //以日期儲存方便繪製圖表
    let key = this.fbRef.child(`posts/${d}`).push(this.state).key;
    //提供geofire作為索引
    this.geoFire
      .set(`${geofireIdx}|${key}`, [this.state.latitude, this.state.longitude])
      .then(
        ()=>{
          this.props.navigation.navigate('Home');
        },
        (error)=>{
          console.log('Error: ' + error);
        }
      );
  };

  _handleChange = text => {
    this.setState({ MREASON: text });
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'white' }}
        behavior="padding"
        enabled
      >
        <View style={{ padding: 12 }}>
          <Image
            style={{ width: width - 24, height: width - 24, borderRadius: 4 }}
            source={{ uri: this.state.photo }}
          />
        </View>
        <FormLabel>位置</FormLabel>
        <FormInput
          value={this.state.place || `正在抓取位置`}
          editable={false}
          onChangeText={this._handleChange}
        />
        <FormLabel>描述</FormLabel>
        <FormInput
          placeholder={this.state.MREASON}
          onChangeText={this._handleChange}
        />
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
      </KeyboardAvoidingView>
    );
  }
}

export default PostCrashInput;
