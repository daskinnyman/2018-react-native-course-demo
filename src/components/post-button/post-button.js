import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';

export const PostButton = props => {
  console.log(props);
  const _handelNav = (pageName, params = null) => {
    if (params) {
      props.navigation.navigate(pageName, params);
    }
    props.navigation.navigate(pageName);
  };

  return (
    <TouchableOpacity
      style={{
        height: 80,
        width: 80,
        margin: 12,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFD05B', //maybe is for ios only
        shadowColor: '#000000',
        shadowOpacity: 0.5,
        shadowOffset: { widht: 0, height: 2 },
        shadowRadius: 4
      }}
      onPress={() => _handelNav('Post')}
    >
      <Icon
        type="ionicon"
        size={35}
        style={{ color: '#4A4A4A' }}
        name="ios-camera-outline"
      />
      {props.title && (
        <Text style={{ color: '#4A4A4A', fontSize: 9 }}>發文</Text>
      )}
    </TouchableOpacity>
  );
};
