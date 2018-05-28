import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Button, Keyboard, Image, TouchableOpacity } from 'react-native';

import PostCrashCameraPage from './post-crash-camera';

//在react-navigation 2.0版，
//StackNavigator改為createStackNavigator
export const PostStack = createStackNavigator(
  {
    PostCamera: {
      screen: PostCrashCameraPage,
      navigationOptions: ({ navigation }) => ({
        drawerLockMode: 'locked-closed',
        headerStyle: {
          backgroundColor: '#67C2AC',
          paddingTop: 32,
          paddingHorizontal: 16,
          paddingBottom: 16,
          shadowOpacity: 0,
          borderBottomWidth: 0
        },
        headerTitle: '',
        headerTitleStyle: {
          color: 'white',
          fontSize: 14,
          lineHeight: 22,
          letterSpacing: 0.22
        }
      })
    }
  },
  {
    headerMode: 'none'
  }
);
