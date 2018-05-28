import React from "react";
import { createDrawerNavigator, DrawerItems } from "react-navigation";
import { Button, View, Keyboard, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { HomeStack } from "../pages/crash-map/index";

//在react-navigation 2.0版，
//DrawerNavigator改為createDrawerNavigator
export const DrawerRouter = createDrawerNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        drawerLockMode: "locked-closed",
        drawerLabel: "首頁",
        drawerIcon: ({ tintColor }) => (
          <Icon name="ios-home-outline" size={25} color={tintColor} />
        )
      },
      tintColor: "#67C2AC"
    }
  },
  {
    initialRouteName: "Home",
    contentOptions: {
      activeTintColor: "#67C2AC"
    },
    contentComponent: props => (
      <View>
        <DrawerItems {...props} />
        <Logout {...props} />
      </View>
    )
  }
);
