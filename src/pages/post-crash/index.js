import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Button, Keyboard, Image, TouchableOpacity } from 'react-native';

import PostCrashCameraPage from './post-crash-camera';
import PostCrashInputPage from './post-crash-camera-input';
//在react-navigation 2.0版，
//StackNavigator改為createStackNavigator
export const PostStack = createStackNavigator(
  {
    PostCamera: {
      screen: PostCrashCameraPage,
      navigationOptions: ({ navigation }) => ({
        drawerLockMode: 'locked-closed',
        headerBackTitle: null,
        headerLeft: (
          <Button
            title="回上頁"
            onPress={() => navigation.navigate('Home')}
          />
        )
      })
    },
    PostInput: {
      screen: PostCrashInputPage,
      navigationOptions: ({ navigation }) => ({
        drawerLockMode: 'locked-closed',
        headerBackTitle: null,
        headerLeft: (
          <Button
            title="回上頁"
            onPress={() => navigation.goBack(null)}
          />
        )
      })
    }
  }
);
