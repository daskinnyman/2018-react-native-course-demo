//照相頁面
import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import firebase from 'firebase';

class PostCrash extends Component {
  constructor(props) {
    super(props);
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
      this.camera.takePictureAsync({ base64: true }).then(data => {
        console.log(data);
        let name = data.uri.split('Camera/')[1];
        let base64 = data.base64;
        this.storageRef
          .child(`picture/${name}`)
          .putString(base64, 'base64')
          .then(snapshot => {
            console.log('Uploaded a base64 string!');
            console.log(snapshot);
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
        <View style={{ flex: 1 }}>
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
                flexDirection: 'row'
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center'
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    color: 'white'
                  }}
                >
                  {' '}
                  Flip{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    flex: 0.3,
                    alignSelf: 'flex-end'
                  }
                ]}
                onPress={this._handleTakePicture}
              >
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    color: 'white'
                  }}
                >
                  {' '}
                  SNAP{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

export default PostCrash;
