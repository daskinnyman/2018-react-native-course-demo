import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppRouter } from './src/navigation/auth-navigation';
import firebase from 'firebase';
import {config} from './src/config/firebase-config'
export default class App extends React.Component {
  render() {
    firebase.initializeApp(config);
    return (
        <AppRouter />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
