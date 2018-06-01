import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    marginTop: -49
  },
  switchButton: {
    width: 110,
    backgroundColor: 'white'
  },
  controlButtonGroup: { position: 'absolute', right: 12, bottom: 12 }
});
