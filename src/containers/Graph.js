import React, { Component } from "react";
import "./Graph.css";
import {Line} from 'react-chartjs-2';
import config from "../config"; // config.js
import {Container, Row, Col, Button} from "react-bootstrap";


export default class Graph extends Component {

  constructor(props) {
    super(props);
    this.initialState = {
      stationName:"",
      sensorType:"",
      sensorData:[],
      timestampData:[]
    };

    this.state = this.initialState; //Store the initial state, so it can be restored
  }

  componentDidMount(){
    this.setState({
      stationName: this.props.appLocation.search.split("&")[0].split("=")[1],
      sensorType: this.props.appLocation.search.split("&")[1].split("=")[1]
    }, () => {

      //Fetch for sensor data:
      
      //Get now - 1 week
      var today = new Date();
      var startDate = new Date(today.getTime() - 24*60*60*1000).toISOString();

      this.loadSensorData(this.state.stationName, this.state.sensorType, startDate);

    });
  }

  loadSensorData(stationName, sensorType, startDate){

    fetch(config.api_baseurl + "/sensorAfterDate?stationName=" + stationName + "&sensorType=" + sensorType + "&startDate=" + startDate)
      .then(res => res.json())
      .then((result) => {
        if (result.status === "ok") {

          console.log(result.data);

          var sensorData = [];
          var timestampData = [];
            
          for (var i = 0; i < result.data.length; i++) {
            sensorData.push(result.data[i].sensorValue);
            timestampData.push(result.data[i].timestamp);
          }

          this.setState({
            sensorData: sensorData,
            timestampData: timestampData
          });

        }
      }
    )
  }

  renderChart(){

    const data = {
      labels: this.state.timestampData,
      datasets: [
        {
          label: this.state.sensorType,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgb(6, 148, 6)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(0,0,0,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.sensorData
        }
      ]
    };

    const options = {
      //responsive: false,
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero:true
              }
          }],
          xAxes: [{
              type: 'time',
              time: {
                  displayFormats: {
                     'hour': 'MMM D hA',
                  }
              },
              ticks: {
              }
          }]
      },
      legend: {
          display: true,
          fontSize: 40,
          labels: {
              fontColor: '#212121'
          }
      }
    }

    return(
      <Line data={data} options={options}/>
    )
  }

  //index: 1: oggi, 2: settimana, 3:mese
  updateChart(index){

    var today = new Date();

    switch(index){
      case 1:
        var startDate = new Date(today.getTime() - 24*60*60*1000).toISOString();
        this.loadSensorData(this.state.stationName, this.state.sensorType, startDate);
        break;
      case 2:
        startDate = new Date(today.getTime() - 7*24*60*60*1000).toISOString();
        console.log(startDate);
        this.loadSensorData(this.state.stationName, this.state.sensorType, startDate);
        break;
      case 3:
        startDate = new Date(today.getTime() - 30*24*60*60*1000).toISOString();
        this.loadSensorData(this.state.stationName, this.state.sensorType, startDate);
        break;
      default:
        break;
    }

  }

  render() {
    return (
      <div className="Graph">
        <h1> {this.state.stationName} </h1>
        {this.renderChart()}
        <Container>
          <Row>
            <Col xs={12} md={4}>
              <Button onClick={() => this.updateChart(1)}> Oggi </Button>
            </Col>
            <Col xs={12} md={4}>
              <Button onClick={() => this.updateChart(2)}> Ultima Settimana </Button>
            </Col>
            <Col xs={12} md={4}>
              <Button onClick={() => this.updateChart(3)}> Ultimo Mese </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
