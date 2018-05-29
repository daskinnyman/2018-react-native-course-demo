//顯示撞車的地圖頁面
import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';
import { styles } from './crash-map-style';
import * as firebase from 'firebase';
import GeoFire from 'geofire';
import axios from 'axios';
import twd97tolatlng from 'twd97-to-latlng';
export default class CrashMap extends React.Component {
  constructor(props) {
    super(props);
    //設定firebase
    this.fbRef = firebase.database().ref();
    this.geoRef = this.fbRef.child('_GEOFIRE');
    this.geoFire = new GeoFire(this.geoRef);
    this.user = firebase.auth().currentUser;
    //初始化state
    this.state = {
      Success: null,
      isLoading: false,
      Error: null,
      result: [],
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      current_lat: null,
      current_lng: null
    };
  }
  async componentDidMount() {
    //取得geolocation
    await this._getGeolocation();
    //監看使用者位置
    await this._watchGeolocation();

    await this._getCrashArea();
  }
  /**
   * 取得撞車的地區
   */
  _getCrashArea = async () => {
    const API_URL = `http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=1262b7ec-ab34-4b71-83fb-c7ee75880f3f`;
    try {
      const res = await axios(API_URL, {
        method: 'get',
        headers: {
          'Content-type': 'application/json'
        }
      });
      let length = res.data.result.results.length;
      let result = res.data.result.results;
      result.map(el => {
        let XLR_CORD = el.XLR_CORD; //X軸右邊的LOWER Bound
        let YLR_CORD = el.YLR_CORD; //Y軸右邊的LOWER Bound
        let XUL_CORD = el.XUL_CORD; //X軸右邊的LOWER Bound
        let YUL_CORD = el.YUL_CORD; //Y軸右邊的LOWER Bound
        let MREASON = el.MREASON;
        console.log(`456`);
        console.log(twd97tolatlng(XLR_CORD, YLR_CORD,YUL_CORD,XUL_CORD));
        console.log(`123`);
        console.log(twd97tolatlng(YUL_CORD, XUL_CORD));
      });
      console.log(length);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };
  /**
   * 取得geolocation
   */
  _getGeolocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        Error: 'Permission to access location was denied'
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.geoFire
      .set('some_key', [location.coords.latitude, location.coords.longitude])
      .then(
        function() {
          console.log('Provided key has been added to GeoFire');
        },
        function(error) {
          console.log('Error: ' + error);
        }
      );
    this.setState({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
  };

  /**
   * 監看位置
   *
   */
  _watchGeolocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        Error: 'Permission to access location was denied'
      });
    }

    Location.watchPositionAsync(
      { enableHighAccuracy: true, distanceInterval: 20 },
      location => {
        this._getNearbyUser(
          location.coords.latitude,
          location.coords.longitude
        );
        this.setState({
          current_lat: location.coords.latitud,
          current_lng: location.coords.longitude
        });
      }
    );
  };
  /**
   * 利用經緯度取得附近使用者
   * @param {any} lat
   * @param {any} lng
   */
  _getNearbyUser = async (lat, lng) => {
    let center = [lat, lng];
    let geoQuery = this.geoFire.query({ center, radius: 10 });
    geoQuery.on('key_entered', (key, location, distance) => {
      console.log(
        key +
          ' entered query at ' +
          location +
          ' (' +
          distance +
          ' km from center)'
      );
    });
  };

  _onRegionChange = region => {
    this.setState({
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta
    });
  };
  /**
   * 處理導頁，傳送user及選取的資料
   * @memberof CrashID事件的ID
   * @param crashID：撞車
   */
  _goNext = crashID => {};

  render() {
    return (
      <View style={styles.container}>
        <MapView
          loadingEnabled
          style={styles.map}
          showsUserLocation={true}
          onRegionChange={this._onRegionChange}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
          }}
        />
      </View>
    );
  }
}
