//照相頁面
import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import firebase from 'firebase';
import { Icon } from 'react-native-elements';
class PostCrashCamera extends Component {
  constructor(props) {
    super(props);
    this.user = firebase.auth().currentUser;
    this.storageRef = firebase.storage().ref();
  }
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  _handleTakePicture = async () => {
    if (this.camera) {
      this.camera
        .takePictureAsync({ quality: 0.5, base64: true })
        .then(data => {
          console.log(data);
          let name = data.uri.split('Camera/')[1];
          let base64 = data.base64;
          this.storageRef
            .child(`picture/${name}`)
            .putString(base64, 'base64')
            .then(snapshot => {
              console.log(snapshot);
              if (snapshot.state) {
                snapshot.ref.getDownloadURL().then(url => {
                  this.props.navigation.navigate('PostInput', {
                    url
                  });
                });
              }
            });
        });
    }
  };

  render() {
    console.log(this.user);
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1, marginTop: -49 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
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
          </Camera>
        </View>
      );
    }
  }
}

export default PostCrashCamera;
