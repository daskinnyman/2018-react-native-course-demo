import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { DrawerNavigator } from './app-navigation';
import { Button, Keyboard, Image, TouchableOpacity } from 'react-native';
import { AuthStack } from '../pages/user-auth/index';

export const AppRouter = createStackNavigator(
  {
    Auth: { screen: AuthStack, navigationOptions: { gesturesEnabled: false } },
    Main: {
      screen: DrawerNavigator,
      navigationOptions: { gesturesEnabled: false }
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Auth',
    navigationOptions: { gesturesEnabled: false }
  }
);
