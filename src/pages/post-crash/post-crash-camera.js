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
      this.camera
        .takePictureAsync({ quality: 0.2})
        .then(async data => {

          //必須使用blob，base64會無法上傳成功
          const response = await fetch(data.uri);
          const blob = await response.blob();
          const metadata = {
            contentType: blob.type
          };
          const name = blob._data.name;

          this.storageRef
            .child(`pictures/${name}`)
            .put(blob, metadata)
            .then(snapshot => {
              if (snapshot.state) {
                this.setState({ isLoading: false });
                snapshot.ref.getDownloadURL().then(url => {
                  this.props.navigation.navigate('PostInput', {
                    url
                  });
                });
              } else {
                this.setState({ isLoading: false });
                Alert.alert('upload failed');
              }
            });
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
        <View
          style={{
            flex: 1,
            marginTop: -49
          }}
        >
          <Camera
            style={{
              flex: 1
            }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            {this.state.isLoading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <ActivityIndicator size="large" color="white" />
                <Text style={{ color: 'white', margin: 8 }}>照片上傳中...</Text>
              </View>
            ) : (
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
                      height: 80,
                      width: 80,
                      margin: 12,
                      borderRadius: 80,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#FFD05B',
                      shadowColor: '#000000',
                      shadowOpacity: 0.5,
                      shadowOffset: { widht: 0, height: 2 },
                      shadowRadius: 4
                    } //maybe is for ios only
                  }
                  onPress={this._handleTakePicture}
                >
                  <Icon
                    type="ionicon"
                    size={35}
                    style={{ color: '#4A4A4A' }}
                    name="ios-camera-outline"
                  />
                </TouchableOpacity>
                <View style={{ position: 'absolute', right: 12, bottom: 12 }}>
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
