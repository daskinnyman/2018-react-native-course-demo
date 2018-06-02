//照相頁面
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Camera, Permissions } from 'expo';

import firebase from 'firebase';

import { Icon } from 'react-native-elements';

import { styles } from './post-crash-style';
class PostCrashCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false, //控制等待的spinner
      hasCameraPermission: null,
      type: Camera.Constants.Type.back
    };
  }

  //在元件掛載前要執行的動作
  async componentWillMount() {
    //取得相機的使用權限
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    //取得之後把權限儲存在state
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  /**
   *處理拍照
   */
  _handleTakePicture = async () => {
    //按下拍照鈕後，設定spinner出現
    this.setState({ isLoading: true });
    //設定firebase storage的位置
    let storageRef = firebase.storage().ref();
    //如果camera物件存在的話
    if (this.camera) {
      //開始拍照
      this.camera.takePictureAsync({ quality: 0.2 }).then(async data => {
        //必須使用blob，base64會無法上傳成功，將照片轉為blob
        const response = await fetch(data.uri);
        const blob = await response.blob();

        //取得照片格式，例如：png....
        const metadata = {
          contentType: blob.type
        };

        //取得照片名稱
        const name = blob._data.name;

        try {
          //上傳照片到storage底下的pictures/照片名稱位置
          let res = await storageRef
            .child(`pictures/${name}`)
            .put(blob, metadata);

          //如果回傳的結果是成功的
          if (res.state) {
            //關閉spinner
            this.setState({ isLoading: false });

            //取得圖片的位置
            let url = await res.ref.getDownloadURL();

            //導頁到下一頁，並且傳送url
            this.props.navigation.navigate('PostInput', {
              url: url
            });
          } else {
            //關閉spinner
            this.setState({ isLoading: false });
            //使用alert提醒使用者，上傳失敗
            Alert.alert('upload failed');
          }
        } catch (err) {
          this.setState({ isLoading: false });
          Alert.alert('upload failed');
        }
      });
    }
  };

  render() {
    //使用解構賦值，取得是否有使用相機的權限
    const { hasCameraPermission } = this.state;
    //權限為空就不顯示相機
    if (hasCameraPermission === null) {
      return <View />;
    } 
    //沒有權限就顯示沒有權限
    else if (hasCameraPermission === false) {
      return <Text>沒有相機使用權限</Text>;
    }
    //顯示相機
    else {
      return (
        <View style={styles.container}>
          <Camera
            style={styles.camera}
            type={this.state.type}
            //把this.camera指向相機，讓程式可以使用this.camera對相機進行操作
            ref={ref => {
              this.camera = ref;
            }}
          >
            {this.state.isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.loadingText}>照片上傳中...</Text>
              </View>
            ) : (
              <View style={styles.controlButtonGroup}>
                <TouchableOpacity
                  style={styles.shutter}
                  onPress={this._handleTakePicture}
                >
                  <Icon
                    type="ionicon"
                    size={35}
                    color="#4A4A4A"
                    name="ios-camera-outline"
                  />
                </TouchableOpacity>
                <View style={styles.front}>
                  <Icon
                    type="ionicon"
                    name="ios-reverse-camera"
                    color="#FFD05B"
                    raised
                    onPress={() => {
                      this.setState({
                        type:
                          this.state.type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                      });
                    }}
                  />
                </View>
              </View>
            )}
          </Camera>
        </View>
      );
    }
  }
}

export default PostCrashCamera;
