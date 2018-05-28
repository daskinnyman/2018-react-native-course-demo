import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppRouter } from './src/navigation/auth-navigation'

export default class App extends React.Component {
  render() {
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
