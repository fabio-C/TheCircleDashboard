import React, { Component } from "react";
import { Link } from 'react-router-dom';
import {Container, Row, Col, Card, Button} from "react-bootstrap";
import config from "../config"; // config.js

import "./StationList.css";

export default class StationList extends Component {

  constructor(props) {
    super(props);

    this.initialState = {

      //Get all stations from configuration file:
      //stationsName:[],

      //Fill status variables with default values:
      //stationsTimestamp:[],
      //stationsIp:[],

      serraid: null, //1, 2
      stationsLoaded: false,

      //array of station
      stations: []
    };

    this.state = this.initialState; //Store the initial state, so it can be restored

  }
  
  componentDidMount(){

    //Get serraid from URL query param
    const serraid = parseInt(this.props.appLocation.search.split("=")[1]);
    
    this.setState({
      serraid: serraid
    });

    //Station List (initially empty)
    var stations = [];

    //Fill Station Name List with serra1/serra2 names (from config)
    if (serraid === 1) {
      stations = config.stations_serra1;
    } else if (serraid === 2) {
      stations = config.stations_serra2;
    } else if (serraid === 3) {
      stations = config.stations_semenzaio;
    } else if (serraid === 4) {
      stations = config.stations_tunnel1;
    }

    for (var i = 0; i < stations.length; i++) {

      const _i = i;

      //Fetch data from server
      fetch(config.api_baseurl + "/stationStatus?stationName=" + stations[i][0])
        .then(res => res.json())
        .then((result) => {

          console.log(result);

          var obj = null;
          if (result.status === "ok") {
            //Create a station obj
            obj = {
              "name": stations[_i][0], 
              "timestamp": result.data.timestamp, 
              "ip": result.data.ip,
              "class": stations[_i][1]
            };
          } else {
            obj = {
              "name": stations[_i][0], 
              "timestamp": "", 
              "ip": "",
              "class": stations[_i][1]
            };
          }

          //Push the station obj to state
          this.setState({ stations: [...this.state.stations, obj] });

          //Check for end of for
          if (_i === stations.length-1) {
            this.setState({
              stationsLoaded: true
            });
          }
      });

    }

  }

  renderStations(){

    if(this.state.stationsLoaded){

      var stationsDOMelements = [];

      //Loop over stations:
      for (var i = 0; i < this.state.stations.length; i++) {

        //calculate data difference:
        var date = new Date(this.state.stations[i].timestamp);
        var now = new Date();

        //console.log(now-date);

        //if time difference is smaller then 1 minute:
        if ((now-date)<60000) {
        //if (true) {

          var url = "";
          if (this.state.stations[i].class === "normal") {
            url = "/station?stationName=" + this.state.stations[i].name + "&stationIp=" + this.state.stations[i].ip;  
          } else if (this.state.stations[i].class === "motor") {
            url = "/motorstation?stationName=" + this.state.stations[i].name + "&stationIp=" + this.state.stations[i].ip;  
          } if (this.state.stations[i].class === "flux") {
            url = "/fluxstation?stationName=" + this.state.stations[i].name + "&stationIp=" + this.state.stations[i].ip;  
          }
          
          stationsDOMelements.push(
            <Card className="online" key={i}>
              <Card.Header>
                <Link to={url}> 
                  <Button>{this.state.stations[i].name} </Button>
                </Link>
              </Card.Header>
            </Card>
          );

        } else {
          stationsDOMelements.push(
            <Card className="offline" key={i}>
              <Card.Header>
                <Link to="#"> 
                  <Button> {this.state.stations[i].name} </Button>
                </Link>
              </Card.Header>
            </Card>
          );
        }
      }

      return stationsDOMelements;

    } else {
      return(<p> loading </p>);
    }

  }

  render() {
    return (
      <div className="StationList">
        <Container>
          <Row>
            <Col xs={12}>
              {this.renderStations()}
            </Col>
          </Row>

        </Container>
      </div>
    );
  }
}