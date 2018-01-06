import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3001');

const styles = {
  mainSection: {
    display: 'flex',
    flexDirection: 'row'
  },
  sectionA: {
    width: '50%'
  },
  sectionB: {
    flex: 1
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataA: [
        {name: 'CPU', cpuUtilization: 0, percentage: 100},
        {name: 'RAM', ramUtilization: 0, percentage: 100},],
        dataB: [
          {name: '10', cpuUtilization: 0, ramUtilization: 0, maxTime: 100},
          {name: '20', cpuUtilization: 0, ramUtilization: 0, maxTime: 100},
          {name: '30', cpuUtilization: 0, ramUtilization: 0, maxTime: 100},
          {name: '40', cpuUtilization: 0, ramUtilization: 0, maxTime: 100},
          {name: '50', cpuUtilization: 0, ramUtilization: 0, maxTime: 100},
          {name: '60', cpuUtilization: 0, ramUtilization: 0, maxTime: 100},],
        tempDataB: []
    }
    this.handleData = this.handleData.bind(this);
  }

  handleData(data) {
    console.log(data)
    let result = JSON.parse(data);
    this.setState({count: this.state.count + result.movement});
  }

  componentDidMount() {
    let cx = 10
    let tempStatsB = []
    socket.on(`stats`, statsRealTimeData => {
      console.log(statsRealTimeData)

      let tempStatsA = [
        { 'name': 'CPU', 'cpuUtilization': statsRealTimeData.cpuUtilization, 'percentage': 100 },
        { 'name': 'RAM', 'ramUtilization': statsRealTimeData.ramUtilization, 'percentage': 100 },
      ]

      if(cx >= 61){
        cx = 10
        this.setState({
          dataB: tempStatsB
        })
        tempStatsB = []
      } else {
        tempStatsB.push({name: cx, cpuUtilization: statsRealTimeData.cpuUtilization, ramUtilization: statsRealTimeData.ramUtilization, maxTime: 100})
        cx += 10
        console.log(tempStatsB);
      }

      this.setState({
        dataA: tempStatsA
      })
    })
    this.sendInitMessage(1000)
  }

  sendInitMessage = message => {
    socket.emit(`subscribeToStats`, message)
  }

  render() {
    const { dataA, dataB } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Server CPU Utilization Monitoring Dashboard</h1>
        </header>
          <br/>
          <div className="mainChartSection" style={styles.mainSection}>
            <div className="sectionA" style={styles.sectionA}>
              <BarChart width={400} height={300} data={dataA} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                 <XAxis dataKey="name"/>
                 <YAxis dataKey="percentage"/>
                 <CartesianGrid strokeDasharray="3 3"/>
                 <Tooltip/>
                 <Legend />
                 <Bar dataKey="cpuUtilization" fill="#8884d8" />
                 <Bar dataKey="ramUtilization" fill="#82ca9d" />
              </BarChart>
            </div>
            <div className="sectionB" style={styles.sectionA}>
              <LineChart width={600} height={300} data={dataB}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                 <XAxis dataKey="name"/>
                 <YAxis dataKey="maxTime"/>
                 <CartesianGrid strokeDasharray="3 3"/>
                 <Tooltip/>
                 <Legend />
                 <Line type="monotone" dataKey="cpuUtilization" stroke="#8884d8" activeDot={{r: 8}}/>
                 <Line type="monotone" dataKey="ramUtilization" stroke="#82ca9d" />
                </LineChart>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
