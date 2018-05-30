import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { DrawerNavigator } from './app-navigation';
import { Button, Keyboard, Image, TouchableOpacity } from 'react-native';
import { AuthStack } from '../pages/user-auth/index';

//import PlaceholderPage from '../screen/placeholder-page';

// export const PlaceholderStack = StackNavigator({
//     //all page will be put here
//     Placeholder: {
//         screen: PlaceholderPage,
//         navigationOptions: ({ navigation }) => ({
//             header: null
//         })
//     }
// });

export const AppRouter = createStackNavigator(
  {
    // Placeholder: {
    //     screen: PlaceholderStack,
    //     navigationOptions: { gesturesEnabled: false }
    // },
    Auth: { screen: AuthStack, navigationOptions: { gesturesEnabled: false } },
    Main: {
      screen: DrawerNavigator,
      navigationOptions: { gesturesEnabled: false }
    }
  },
  {
    headerMode:'none',
    initialRouteName: 'Main',
    navigationOptions: { gesturesEnabled: false }
  }
);
