import React from 'react';
import { createStackNavigator, Header } from 'react-navigation';
import { LinearGradient } from 'expo';
import {
  Button,
  View,
  Keyboard,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';
import CrashMapPage from './crash-map';
import CrashDetail from './crash-map-detail';
import CrashChartPage from './crash-chart';

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
export const MapStack = createStackNavigator({
  Map: {
    screen: CrashMapPage,
    navigationOptions: ({ navigation }) => ({
      header: props => <GradientHeader {...props} />,
      headerStyle: {
        backgroundColor: 'rgba(0,0,0,0)',
        borderBottomWidth:0,
        padding:12
      },
      headerBackTitle: null,
      headerLeft: (
        <Icon
          type="ionicon"
          name="ios-menu"
          size={30}
          onPress={() => navigation.openDrawer()}
        />
      )
    })
  },
  Detail: {
    screen: CrashDetail,
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
          onPress={() => navigation.goBack(null)}
        />
      )
    })
  },
  Chart: {
    screen: CrashChartPage,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'locked-closed',
      headerBackTitle: null,
      headerLeft: (
        <Icon
          type="ionicon"
          name="ios-arrow-back"
          onPress={() => navigation.goBack(null)}
        />
      )
    })
  }
});
