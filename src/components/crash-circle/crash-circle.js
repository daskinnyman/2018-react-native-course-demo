import React from 'react';
import { Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';
// import { styles } from './crash-map-style';
import * as firebase from 'firebase';
import GeoFire from 'geofire';
import axios from 'axios';
import twd97tolatlng from 'twd97-to-latlng';
const API_URL = `http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=1262b7ec-ab34-4b71-83fb-c7ee75880f3f`;
const { Marker } = MapView;

export const MapMarker = props => {
    console.log(props);
    return (
        <Marker
            key={props.idx}
            // onPress={() => this._handleMarkerPress(props.data)}
            description={props.description.MREASON}
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
                {props.photo ? (
                    <Image
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: '#eee',
                            marginBottom: 10
                        }}
                        source={{ uri: props.photo }}
                    />
                ) : null}
            </View>
        </Marker>
    );
};
