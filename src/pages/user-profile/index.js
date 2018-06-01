//集中處理個人檔案功能頁面，一次匯出
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Button, Keyboard, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

//功能頁面
import ProfilePage from './user-profile';

//在react-navigation 2.0版，
//StackNavigator改為createStackNavigator
export const ProfileStack = createStackNavigator({
  UserProfile: {
    screen: ProfilePage,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'locked-closed',
      headerStyle: {
        backgroundColor: 'white',
        borderBottomWidth: 0,
        padding: 12
      },
      headerLeft: (
        <Icon
          type="ionicon"
          name="ios-arrow-back"
          size={30}
          onPress={() => navigation.navigate('Home')}
        />
      )
    })
  }
});
