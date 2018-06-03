import React from 'react';
import { createStackNavigator, Header } from 'react-navigation';
import { LinearGradient } from 'expo';
import {
  View,
  StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';
import PostCrashCameraPage from './post-crash-camera';
import PostCrashInputPage from './post-crash-camera-input';

const GradientHeader = props => (
  <View>
    <LinearGradient
      colors={[
        'rgba(255,255,255,1)',
        'rgba(255,255,255,79)',
        'rgba(255,255,255,0)'
      ]}
      style={[StyleSheet.absoluteFill]}
    />
    <Header {...props} style={{ backgroundColor: 'transparent' }} />
  </View>
);
//在react-navigation 2.0版，
//StackNavigator改為createStackNavigator
export const PostStack = createStackNavigator({
  PostCamera: {
    screen: PostCrashCameraPage,
    navigationOptions: ({ navigation }) => ({
      header: props => <GradientHeader {...props} />,
      headerStyle: {
        backgroundColor: 'rgba(0,0,0,0)',
        borderBottomWidth: 0,
        padding: 12
      },
      headerBackTitle: null,
      headerLeft: (
        <Icon
          type="ionicon"
          name="ios-arrow-back"
          size={30}
          onPress={() => navigation.navigate('Home')}
        />
      )
    })
  },
  PostInput: {
    screen: PostCrashInputPage,
    navigationOptions: ({ navigation }) => ({
      header: props => <GradientHeader {...props} />,
      headerStyle: {
        backgroundColor: 'white',
        borderBottomWidth: 0,
        padding: 12
      },
      headerBackTitle: null,
      headerLeft: (
        <Icon
          type="ionicon"
          name="ios-arrow-back"
          size={30}
          onPress={() => navigation.goBack(null)}
        />
      )
    })
  }
});
