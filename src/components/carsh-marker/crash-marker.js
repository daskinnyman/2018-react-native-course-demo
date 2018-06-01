import React from 'react';
import { View, Image } from 'react-native';
import { MapView } from 'expo';

const { Marker } = MapView;

export const MapMarker = props => {
  console.log(props);
  const _handleMarkerPress = () => {
    props.navgation.navgate('Detail', { data: props.data });
  };

  return (
    <Marker
      key={props.idx}
      onPress={_handleMarkerPress}
      description={props.data.MREASON}
      coordinate={props.coordinate}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: '#eee',
          marginBottom: 10
        }}
      >
        {props.data.photo ? (
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#eee',
              marginBottom: 10
            }}
            source={{ uri: props.data.photo }}
          />
        ) : null}
      </View>
    </Marker>
  );
};
