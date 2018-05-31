//顯示撞車的地圖頁面
import React from 'react';
import { Text, View, Dimensions, TouchableOpacity ,Image} from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { styles } from './crash-map-style';
import * as firebase from 'firebase';
import GeoFire from 'geofire';
import axios from 'axios';
import twd97tolatlng from 'twd97-to-latlng';
const API_URL = `http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=1262b7ec-ab34-4b71-83fb-c7ee75880f3f`;
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
    let d = new Date().toLocaleDateString();
    this.fbRef
      .child(`crashRank`)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          console.log(`====snapshot====`);
          console.log(snapshot.val());
          this.setState({
            placeInfos: snapshot.val()
          });
        } else {
          this._fetchOpenDataAndUpdate();
        }
      })
      .catch(err => {
        console.log(err);
      });
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
      {
        enableHighAccuracy: true,
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
  };
  /**
   * 利用經緯度取得附近使用者
   * @param {any} lat
   * @param {any} lng
   */
  _getNearbyUser = async (lat, lng) => {
    let center = [lat, lng];
    let nearbyUsers = [...this.state.results];
    let geoQuery = this.geoFire.query({
      center,
      radius: 10000
    });
    geoQuery.on('key_entered', (key, location, distance) => {
      let date = key.split('|')[0];
      let postId = key.split('|')[1];
      let d = date.replace(/-/g, '/');

      this.fbRef
        .child(`posts/${d}/${postId}`)
        .once('value')
        .then(snapshot => {
          nearbyUsers.push(snapshot.val());
          this.setState({ results: nearbyUsers });
        });
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

  _handleMarkerPress=(el)=>{
    this.props.navigation.navigate('Detail',{data:el});
  }
  /**
   * 處理導頁，傳送user及選取的資料
   * @memberof CrashID事件的ID
   * @param crashID：撞車
   */
  _handelNav = (pageName, params = null) => {
    if (params) {
      this.props.navigation.navigate(pageName, params);
    }
    this.props.navigation.navigate(pageName);
  };
  _handelResetRegion=()=>{
    this.setState({
      latitude: this.state.current_lat,
      longitude: this.state.current_lng,
    });
  }
  _renderCircle = () => {
    if (this.state.placeInfos) {
      return this.state.placeInfos.map((el, idx) => {
        return (
          <MapView.Circle
            key={idx}
            center={{ latitude: el.latitude, longitude: el.longitude }}
            radius={150}
            strokeColor={'#EF7B7B'}
            fillColor={'rgba(239,123,123,0.5)'}
          />
        );
      });
    }
  };

  _renderMarkers = () => {
    if (this.state.results) {
      return this.state.results.map((el, idx) => {
        return <MapView.Marker key={idx} onPress={()=>this._handleMarkerPress(el)} description={el.MREASON} coordinate={{ latitude: el.latitude, longitude: el.longitude }} >
          <View style={{
      width:50,
      height:50,
      borderRadius:25,
      backgroundColor:'#eee',
      marginBottom:10
  }}>
                 {el.photo?
                 <Image
                 style={{
      width:50,
      height:50,
      borderRadius:25,
      backgroundColor:'#eee',
      marginBottom:10
  }}
                 source={{uri:el.photo}} />:
                 null}
                 </View>
        </MapView.Marker>;
      });
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
          title={this.state.showCircle?"查看附近車禍":"查看撞車熱點"}
          raised
          color="#4A4A4A"
          onPress={()=>this.setState({showCircle:!this.state.showCircle})}
          borderRadius={55}
          fontSize={12}
          fontWeight="bold"
          buttonStyle={{ width: 110, backgroundColor: 'white' }}
        />
        <TouchableOpacity
          style={{
            height: 80,
            width: 80,
            margin: 12,
            borderRadius: 80,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFD05B', //maybe is for ios only
            shadowColor: '#000000',
            shadowOpacity: 0.5,
            shadowOffset: { widht: 0, height: 2 },
            shadowRadius: 4
          }}
          onPress={() => this._handelNav('Post')}
        >
          <Icon
            type="ionicon"
            size={35}
            style={{ color: '#4A4A4A' }}
            name="ios-camera-outline"
          />
          <Text style={{ color: '#4A4A4A', fontSize: 9 }}>發文</Text>
        </TouchableOpacity>
        <View style={{ position: 'absolute', right: 12, bottom: 12 }}>
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
