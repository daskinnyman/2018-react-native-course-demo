import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

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
  controlButtonGroup: { position: 'absolute', right: 12, bottom: 12 },
  detailContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12
  },
  detailImage: { width: width - 24, height: width - 24, borderRadius: 4 },
  detailText: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 18,
    fontWeight: 'bold'
  },
  chartContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    alignItems: 'center'
  }
});
