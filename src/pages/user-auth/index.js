import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import userLoginPage from './user-login';

//在react-navigation 2.0版，
//StackNavigator改為createStackNavigator
export const AuthStack = createStackNavigator(
  {
    Login: {
      screen: userLoginPage,
      navigationOptions: ({ navigation }) => ({
        drawerLockMode: 'locked-closed'
      })
    }
  },
  {
    headerMode: 'none'
  }
);
