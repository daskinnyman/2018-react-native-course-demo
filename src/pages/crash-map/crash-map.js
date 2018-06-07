//顯示撞車的地圖頁面
import React, { Component } from 'react';
import { View, Alert } from 'react-native';
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
    //常駐的監聽事件
    this.suscribedService = null;
    //初始化state
    this.state = {
      isPositionPrepared:false,//判斷是否已取得位置
      permissions: null, //取得location的權限
      showCircle: false, //是否顯示撞車區域
      results: [], //附近貼文
      placeInfos: [], //從firebase回來的資料
      latitude: 37.78825, //目前地圖的經緯度
      longitude: -122.4324, //目前地圖的緯度
      latitudeDelta: 0.0922, //目前地圖的經度範圍，越遠地圖上看到的東西越多
      longitudeDelta: 0.0421, //目前地圖的緯度範圍，越遠地圖上看到的東西越多
      current_lat: null, //目前所在位置的經度
      current_lng: null //目前所在位置的緯度
    };
  }

  //在元件掛載完成要執行的動作
  async componentDidMount() {
    //取得location使用權限
    await this._getPermissions();
    //取得geolocation
    await this._getGeolocation();
    //監看使用者位置
    await this._watchGeolocation();
    //取得撞車位置
    await this._getCrashArea();
  }

  //在元件卸載前要執行的動作
  componentWillUnmount() {
    //如果有長駐的監聽事件
    if (this.suscribedService) {
      //移除常駐的監聽事件
      this.suscribedService.remove();
    }
  }

  /**
   *取得location的使用權限
   */
  _getPermissions = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      //跳出alert提醒使用者沒有權限
      Alert.alert('Permission to access location was denied');
      return;
    }
    //將權限設為true
    this.setState({ permissions: true });
  };
  /**
   * 取得撞車的地區
   */
  _getCrashArea = async () => {
    try {
      //取得撞車地區
      let res = await this.fbRef.child(`crashRank`).once('value');
      if (res.val()) {
        //如果有資料就把它存入placeInfos中
        this.setState({ placeInfos: res.val() });
      } else {
        //沒有就使用ajax撈取
        this._fetchOpenDataAndUpdate();
      }
    } catch (err) {
      //捕捉錯誤，若有就使用alert提醒使用者
      Alert.alert('發生錯誤啦！');
    }
  };

  /**
   *使用ajax撈取台北市前五十大車禍路口
   *並存回firebase
   */
  _fetchOpenDataAndUpdate = async () => {
    try {
      //使用ajax取得資料
      const res = await axios(API_URL, {
        method: 'get',
        headers: {
          'Content-type': 'application/json'
        }
      });
      //回來的資料長度
      let length = res.data.result.results.length;
      //回來的資料
      let result = res.data.result.results;

      let placeInfos = [];
      //覽片所有資料把裡面的經緯度從tw97格式轉為一般的經緯度
      result.map(el => {
        const { XLR_CORD, YLR_CORD, MREASON } = el;
        LR = twd97tolatlng(XLR_CORD, YLR_CORD);
        let placeInfo = { latitude: LR.lat, longitude: LR.lng, MREASON };
        //把轉換成功的資料放入陣列
        placeInfos.push(placeInfo);
      });
      //更新firebase中的資料
      this.fbRef.child(`crashRank`).update({ ...placeInfos });
      //同時把資料存入state中
      this.setState({ placeInfos });
    } catch (err) {
      //捕捉錯誤，若有就使用alert提醒使用者
      Alert.alert('發生錯誤啦！');
    }
  };

  /**
   * 取得目前地理位置
   */
  _getGeolocation = async () => {
    //如果有權限
    if (this.state.permissions) {
      //取得目前地理位置
      let location = await Location.getCurrentPositionAsync({});
      //把經緯度，地址存入state
      this.setState({
        isPositionPrepared:true,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    }
  };

  /**
   * 監看目前地理位置
   *
   */
  _watchGeolocation = async () => {
    //如果有權限
    if (this.state.permissions) {
      //取得目前地理位置，並且註冊成常駐的監聽事件
      this.suscribedService = await Location.watchPositionAsync(
        {
          enableHighAccuracy: true, //開啟高精準度，會更耗電
          timeInterval: 30000, //每三十秒刷新位置
          distanceInterval: 20 //離開目前位置20公尺後也會更新位置
        },
        location => {
          //利用取得到的位置搜尋附近使用者
          this._getNearbyUser(
            location.coords.latitude,
            location.coords.longitude
          );
          //把目前的位置存入state中
          this.setState({
            current_lat: location.coords.latitude,
            current_lng: location.coords.longitude
          });
        }
      );
    }
  };

  /**
   * 利用經緯度取得附近使用者貼文
   * @param {any} lat
   * @param {any} lng
   */
  _getNearbyUser = async (lat, lng) => {
    //設定圓心
    let center = [lat, lng];
    //把之前的附近使用者暫存起來
    let nearbyUsers = [...this.state.results];
    //指定geofire的位置
    let geoRef = this.fbRef.child('_GEOFIRE');
    //初始一個geofire的實體
    let geoFire = new GeoFire(geoRef);
    //搜尋半徑10公里的使用者貼文
    let geoQuery = geoFire.query({
      center,
      radius: 10000
    });
    //開始搜尋有沒有使用者貼文
    geoQuery.on('key_entered', async (key, location, distance) => {
      //從geofire的key值中取得日期
      let date = key.split('|')[0];
      //從geofire的key值中取得文章id
      let postId = key.split('|')[1];
      //把日期轉從2018-6-2換成2018/6/2
      let d = date.replace(/-/g, '/');

      try {
        //利用取得的日期及id搜尋貼文，並加入陣列中
        let res = await this.fbRef.child(`posts/${d}/${postId}`).once('value');
        nearbyUsers.push(res.val());
        //將陣列存入state
        this.setState({
          results: nearbyUsers
        });
      } catch (err) {
        //捕捉錯誤，若有就使用alert提醒使用者
        Alert.alert('發生錯誤啦！');
      }
    });
  };
  /**
   *改變地圖上的經緯度設定
   * @param {*} region：地圖上傳回來的資料
   */
  _onRegionChangeComplete = region => {
    this.setState({
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta
    });
  };

  /**
   * 處理導頁
   */
  _handelNav = pageName => {
    this.props.navigation.navigate(pageName);
  };

  /**
   *讓地圖回歸目前位置
   */
  _handelResetRegion = () => {
    this.setState({
      latitude: this.state.current_lat,
      longitude: this.state.current_lng
    });
  };

  /**
   *畫出前50大車禍路口
   */
  _renderCircle = () => {
    if (this.state.placeInfos.length>0) {
      return this.state.placeInfos.map((el, idx) => {
        return (
          <Circle
            key={idx}
            center={{
              latitude: el.latitude,
              longitude: el.longitude
            }}
            radius={150}
            strokeColor={'#ffd05b'}
            fillColor={'rgba(255, 208, 91,0.5)'}
          />
        );
      });
    }
  };

  /**
   *畫出附近貼文
   */
  _renderMarkers = () => {
    if (this.state.results.length>0) {
      return this.state.results.map((el, idx) => (
        <MapMarker
          key={idx}
          data={el}
          navigation={this.props.navigation}
          coordinate={{
            latitude: el.latitude,
            longitude: el.longitude
          }}
        />
      ));
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isPositionPrepared&&<MapView
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
        </MapView>}
        <Button
          title={this.state.showCircle ? '查看附近車禍' : '查看撞車熱點'}
          raised
          color="#4A4A4A"
          onPress={() =>
            this.setState({
              showCircle: !this.state.showCircle
            })
          }
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
