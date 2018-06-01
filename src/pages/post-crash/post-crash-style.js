import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
export const styles = StyleSheet.create({
  scrollView:{
    flex:1,
    backgroundColor:'white'
  },
  container: {
    flex: 1,
    marginTop: -49
  },
  camera: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    color: 'white',
    margin: 8
  },
  controlButtonGroup: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  shutter: {
    height: 80,
    width: 80,
    margin: 12,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD05B',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowOffset: { widht: 0, height: 2 },
    shadowRadius: 4
  },
  front: { position: 'absolute', right: 12, bottom: 12 },
  inputContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12
  },
  previewImage: {
    width: width - 24,
    height: width - 24,
    borderRadius: 4
  },
  postContainer: {
    alignItems: 'center'
  },
  postButton: {
    height: 50,
    width: 50,
    margin: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD05B',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowOffset: { widht: 0, height: 2 },
    shadowRadius: 4
  }
});
