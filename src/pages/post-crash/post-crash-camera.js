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
      isLoading: false,
      hasCameraPermission: null,
      type: Camera.Constants.Type.back
    };
    this.storageRef = firebase.storage().ref();
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  _handleTakePicture = async () => {
    this.setState({ isLoading: true });
    if (this.camera) {
      this.camera.takePictureAsync({ quality: 0.2 }).then(async data => {
        //必須使用blob，base64會無法上傳成功
        const response = await fetch(data.uri);
        const blob = await response.blob();
        const metadata = {
          contentType: blob.type
        };
        const name = blob._data.name;
        try {
          let res = await this.storageRef
            .child(`pictures/${name}`)
            .put(blob, metadata);
          if (res.state) {
            this.setState({ isLoading: false });
            let url = await res.ref.getDownloadURL();
            this.props.navigation.navigate('PostInput', {
              url:url
            });
          } else {
            this.setState({ isLoading: false });
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
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.container}>
          <Camera
            style={styles.camera}
            type={this.state.type}
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
