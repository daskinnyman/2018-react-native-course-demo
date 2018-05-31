import React from 'react';
import { createDrawerNavigator, DrawerItems } from 'react-navigation';
import { Button, View, Keyboard, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MapStack } from '../pages/crash-map';
import { PostStack } from '../pages/post-crash';
import { ProfileStack } from '../pages/user-profile/index';

//在react-navigation 2.0版，
//DrawerNavigator改為createDrawerNavigator
export const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: MapStack,
    },
    Post: {
      screen: PostStack,
      tintColor: '#67C2AC'
    },
    Profile: {
      screen: ProfileStack,
      tintColor: '#67C2AC'
    }
  },
  {
    initialRouteName: 'Home',
    contentOptions: {
      activeTintColor: '#67C2AC'
    }
  }
);
