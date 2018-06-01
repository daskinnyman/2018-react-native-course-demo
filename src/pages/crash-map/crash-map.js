//顯示撞車的地圖頁面
import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { Location, Permissions, MapView } from 'expo';

import firebase from 'firebase';
import GeoFire from 'geofire';
import axios from 'axios';
import twd97tolatlng from 'twd97-to-latlng';

import { Button, Icon } from 'react-native-elements';
import { MapMarker } from '../../components/carsh-marker/crash-marker';
import { PostButton } from '../../components/post-button/post-button';

import { styles } from './crash-map-style';

const API_URL = `http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=1262b7ec-ab34-4b71-83fb-c7ee75880f3f`;
const { Circle } = MapView;

export default class CrashMap extends Component {
  constructor(props) {
    super(props);
    //設定firebase
    this.fbRef = firebase.database().ref();
    this.suscribedSevice = null;
    //初始化state
    this.state = {
      permissions: null,
      Error: null,
      showCircle: false,
      results: [],
      placeInfos: [],
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      current_lat: null,
      current_lng: null
    };
  }

  async componentDidMount() {
    await this._getPermissions();
    //取得geolocation
    await this._getGeolocation();
    //監看使用者位置
    await this._watchGeolocation();

    await this._getCrashArea();
  }

  componentWillUnmount() {
    if (this.suscribedSevice) {
      this.suscribedSevice.remove();
    }
  }

  _getPermissions = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState(
        {
          Error: 'Permission to access location was denied'
        },
        () => {
          Alert.alert('Permission to access location was denied');
        }
      );
      return;
    }
    this.setState({ permissions: true });
  };
  /**
   * 取得撞車的地區
   */
  _getCrashArea = async () => {
    let d = new Date().toLocaleDateString();
    try {
      let res = await this.fbRef.child(`crashRank`).once('value');
      if (res.val()) {
        this.setState({
          placeInfos: res.val()
        });
      } else {
        this._fetchOpenDataAndUpdate();
      }
    } catch (err) {
      Alert.alert('發生錯誤啦！');
    }
  };

  _fetchOpenDataAndUpdate = async () => {
    try {
      const res = await axios(API_URL, {
        method: 'get',
        headers: {
          'Content-type': 'application/json'
        }
      });

      let length = res.data.result.results.length;
      let result = res.data.result.results;
      let placeInfos = [];
      result.map(el => {
        const { XLR_CORD, YLR_CORD, MREASON } = el;
        LR = twd97tolatlng(XLR_CORD, YLR_CORD);
        let placeInfo = {
          latitude: LR.lat,
          longitude: LR.lng,
          MREASON
        };
        placeInfos.push(placeInfo);
      });
      let d = new Date().toLocaleDateString();
      this.fbRef.child(`crashRank`).update({ ...placeInfos });
      this.setState({ placeInfos });
    } catch (err) {
      Alert.alert('發生錯誤啦！');
    }
  };

  /**
   * 取得geolocation
   */
  _getGeolocation = async () => {
    if (this.state.permissions) {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    }
  };

  /**
   * 監看位置
   *
   */
  _watchGeolocation = async () => {
    if (this.state.permissions) {
      this.suscribedSevice = await Location.watchPositionAsync(
        {
          enableHighAccuracy: true,
          timeInterval: 30000,
          distanceInterval: 20
        },
        location => {
          this._getNearbyUser(
            location.coords.latitude,
            location.coords.longitude
          );
          this.setState({
            current_lat: location.coords.latitude,
            current_lng: location.coords.longitude
          });
        }
      );
    }
  };

  /**
   * 利用經緯度取得附近使用者
   * @param {any} lat
   * @param {any} lng
   */
  _getNearbyUser = async (lat, lng) => {
    let center = [lat, lng];
    let nearbyUsers = [...this.state.results];
    let geoRef = this.fbRef.child('_GEOFIRE');
    let geoFire = new GeoFire(geoRef);
    let geoQuery = geoFire.query({
      center,
      radius: 10000
    });
    geoQuery.on('key_entered', async (key, location, distance) => {
      let date = key.split('|')[0];
      let postId = key.split('|')[1];
      let d = date.replace(/-/g, '/');

      try {
        let res = await this.fbRef.child(`posts/${d}/${postId}`).once('value');
        nearbyUsers.push(res.val());
        this.setState({ results: nearbyUsers });
      } catch (err) {
        Alert.alert('發生錯誤啦！');
      }
    });
  };

  _onRegionChangeComplete = region => {
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
  _handelNav = pageName => {
    this.props.navigation.navigate(pageName);
  };

  _handelResetRegion = () => {
    this.setState({
      latitude: this.state.current_lat,
      longitude: this.state.current_lng
    });
  };

  _renderCircle = () => {
    if (this.state.placeInfos) {
      return this.state.placeInfos.map((el, idx) => {
        return (
          <Circle
            key={idx}
            center={{ latitude: el.latitude, longitude: el.longitude }}
            radius={150}
            strokeColor={'#ffd05b'}
            fillColor={'rgba(255, 208, 91,0.5)'}
          />
        );
      });
    }
  };

  _renderMarkers = () => {
    if (this.state.results) {
      return this.state.results.map((el, idx) => (
        <MapMarker
          key={idx}
          data={el}
          navigation={this.props.navigation}
          coordinate={{ latitude: el.latitude, longitude: el.longitude }}
        />
      ));
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          loadingEnabled
          style={styles.map}
          showsUserLocation={true}
          onRegionChangeComplete={this._onRegionChangeComplete}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
          }}
        >
          {this.state.showCircle ? this._renderCircle() : this._renderMarkers()}
        </MapView>
        <Button
          title={this.state.showCircle ? '查看附近車禍' : '查看撞車熱點'}
          raised
          color="#4A4A4A"
          onPress={() => this.setState({ showCircle: !this.state.showCircle })}
          borderRadius={55}
          fontSize={12}
          fontWeight="bold"
          buttonStyle={styles.switchButton}
        />
        <PostButton title="發文" navigation={this.props.navigation} />
        <View style={styles.controlButtonGroup}>
          <Icon
            type="ionicon"
            name="ios-stats"
            color="#FFD05B"
            raised
            onPress={() => this._handelNav('Chart')}
          />
          <Icon
            type="ionicon"
            name="ios-pin"
            color="#FFD05B"
            raised
            onPress={this._handelResetRegion}
          />
        </View>
      </View>
    );
  }
}
