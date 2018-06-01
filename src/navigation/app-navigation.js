import React from 'react';
import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import { Button, View, Keyboard, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons';
import { MapStack } from '../pages/crash-map';
import { PostStack } from '../pages/post-crash';
import { ProfileStack } from '../pages/user-profile/index';

//在react-navigation 2.0版，
//DrawerNavigator改為createDrawerNavigator
export const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: MapStack,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
        drawerLabel: '首頁'
      }
    },
    Post: {
      screen: PostStack,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
        drawerLabel: '發文'
      }
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
        drawerLabel: '個人檔案'
      }
    }
  },
  { initialRouteName: 'Home', contentOptions: { activeTintColor: '#FFD05B' } }
);
