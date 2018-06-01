//近7日撞車的圖表頁面
import React, { Component } from 'react';
import { Text, View } from 'react-native';

import _ from 'lodash/map';
import firebase from 'firebase';

import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';

import { styles } from './crash-map-style';
class CrashChart extends Component {
  constructor(props) {
    super(props);
    this.fbRef = firebase.database().ref();
    this.state = {
      selectedIndex: 2,
      datas: []
    };
  }

  componentDidMount() {
    this._getCrashCount();
  }

  _getCrashCount = async () => {
    let d = new Date().toLocaleDateString();
    let month = `${d.split('/')[0]}/${d.split('/')[1]}`;
    let cnt = 0;
    try {
      let dates = await this.fbRef.child(`posts/${month}`).once('value');
      let datas = [];
      Object.keys(dates.val()).map(async el => {
        let data = await this.fbRef.child(`posts/${month}/${el}`).once('value');
        let len = Object.keys(data.val()).length;
        datas.push({ x: el, y: len, y0: 0 });
        this.setState({ datas });
      });
    } catch (err) {}
  };

  render() {
    return (
      <View style={styles.chartContainer}>
        <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
          <VictoryBar
            style={{ data: { fill: '#FFD05B' } }}
            data={this.state.datas}
          />
        </VictoryChart>
        <Text>本月車禍次數統計</Text>
      </View>
    );
  }
}

export default CrashChart;
