//顯示撞車的地圖頁面
import React from 'react';
import { Text, View, Dimensions} from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';
import { styles } from './crash-map-style';
import firebase from 'firebase';
import geofire from 'geofire';
export default class CrashMap extends React.Component {
  constructor(props) {
    super(props);
    //從navparams取得user
    //this.user  =  ;
    //初始化state
    this.state = {
      Success: null,
      isLoading: false,
      Error: null,
      result: [],
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta:0.0922,
      longitudeDelta: 0.0421
    };
  }
  async componentDidMount() {
    //取得geolocation
    await this._getGeolocation();
    //存入firebase
    await this._setUserLocation();
    //撈取附近使用者
    this._getNearbyUser();
  }
  /**
   * 取得撞車的地區
   */
  _getCrashArea = async () => {};
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

    Location.watchPositionAsync({enableHighAccuracy:true,timeInterval:30000,distanceInterval:2},(location)=>{
      console.log(location);
      this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    });
    
    
  };
  /**
   * 利用經緯度取得附近使用者
   * @param {any} lat
   * @param {any} lng
   */
  _getNearbyUser = async (lat, lng) => {};
  /**
   * 將取得到的geolocaiton存入firebase
   * @param {any} lat
   * @param {any} lng
   */
  _setUserLocation = (lat, lng) => {};
  /**
   * 處理導頁，傳送user及選取的資料
   * @memberof CrashID事件的ID
   * @param crashID：撞車
   */
  _goNext = crashID => {};

  render() {
    return <View style={styles.container}>
        <MapView 
          loadingEnabled
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta:this.state.latitudeDelta ,
            longitudeDelta: this.state.longitudeDelta
          }}/>
      </View>;
  }
}
