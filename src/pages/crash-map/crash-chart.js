//近7日撞車的圖表頁面
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { styles } from './crash-map-style';
import { ButtonGroup } from 'react-native-elements';
import firebase from 'firebase';
import geofire from 'geofire';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import _ from 'lodash';
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
      <View style={{ flex: 1, backgroundColor: 'white', padding: 12 }}>
        <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
          <VictoryBar
            style={{ data: { fill: '#c43a31' } }}
            data={this.state.datas}
          />
          <Text>本月車禍統計</Text>
        </VictoryChart>
      </View>
    );
  }
}

export default CrashChart;
