import React from 'react';
import { View, Image } from 'react-native';
import { MapView } from 'expo';
import { styles } from './crash-marker-style';

const { Marker } = MapView;

export const MapMarker = props => {
  /**
   *導頁並且傳送該貼文資料
   */
  const _handleMarkerPress = () => {
    props.navigation.navigate('Detail', { data: props.data });
  };

  return (
    <Marker
      key={props.idx}
      onPress={_handleMarkerPress}
      description={props.data.MREASON}
      coordinate={props.coordinate}
    >
      <View style={styles.markerIconContainer}>
        {props.data.photo ? (
          <Image
            style={styles.markerPhoto}
            source={{ uri: props.data.photo }}
          />
        ) : null}
      </View>
    </Marker>
  );
};
