//近7日撞車的圖表頁面
import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';

import firebase from 'firebase';

import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';

import { styles } from './crash-map-style';
class CrashChart extends Component {
  constructor(props) {
    super(props);
    //初始化firebase的ref位置
    this.fbRef = firebase.database().ref();
    this.state = {
      datas: []
    };
  }
  //在元件掛載完成要執行的動作
  componentDidMount() {
    //取得本月車禍次數
    this._getCrashCount();
  }

  /**
   *取得本月車禍次數
   */
  _getCrashCount = async () => {
    //把今天的日期轉換為字串，大概會像2018/6/2
    let d = new Date().toLocaleDateString();
    //從日期字串中取得月份跟年，大概像這樣2018/6
    let month = `${d.split('/')[0]}/${d.split('/')[1]}`;
    try {
      //取得本月的所有資料
      let dates = await this.fbRef.child(`posts/${month}`).once('value');

      let datas = [];
      //把取得的資料轉為陣列，並覽騙所有資料，藉以取得日期
      Object.keys(dates.val()).map(async el => {
        //el是本每月有撞車的日期
        //利用el把所有的車禍日期取出
        let data = await this.fbRef.child(`posts/${month}/${el}`).once('value');
        //暫存每天的車禍數
        let len = Object.keys(data.val()).length;
        //存入陣列
        datas.push({ x: el, y: len, y0: 0 });
        //把陣列設定給state
        this.setState({ datas });
      });
    } catch (err) {
      //捕捉錯誤，若有就使用alert提醒使用者
      Alert.alert(`發生錯誤啦！`);
    }
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
