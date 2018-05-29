//撞車的圖表頁面//撞車地圖的細節頁面
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { styles } from './crash-map-style';
import firebase from 'firebase';
import geofire from 'geofire';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';

class CrashChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const sampleData = [
      { x: 1, y: 20, y0: 0 },
      { x: 2, y: 34, y0: 0 },
      { x: 3, y: 50, y0: 0 },
      { x: 4, y: 40, y0: 0 },
      { x: 5, y: 70, y0: 0 }
    ];
    return (
      <View>
        <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
          <VictoryBar style={{ data: { fill: '#c43a31' } }} data={sampleData} />
        </VictoryChart>
      </View>
    );
  }
}

export default CrashChart;
