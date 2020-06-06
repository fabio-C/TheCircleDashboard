import React, { Component } from "react";
import config from "../config"; // config.js
import {Container, Row, Col, Card, Button, Image} from "react-bootstrap";
import { Link } from 'react-router-dom';

import "./Station.css";

export default class Station extends Component {

  constructor(props) {
    super(props);

    this.initialState = {
      stationName:"",
      stationIp:"",

      sensorTypes: ["eTEMP", "eHUM", "wTEMP", "wTEMP1", "wTEMP2", "FLUX1"],
      sensorDisplayNames: ["Temp. Aria", "Umidita Aria", "Temp. Acqua", "Temp. Acqua 1", "Temp. Acqua 2", "Flusso 1"],
      sensorValues: ["","","","", "", ""],
      sensorTimestamps: ["","","","", "", ""],
      unitMeasures: ["°C", "%", "°C", "°C", "°C", "ml/min"],

      relays: ["RELAY1", "RELAY2", "RELAY3", "RELAY4", "RELAY5"],
      relaysStatus: ["","","","",""],
      relaysTimestamp: ["","","","",""]
    };

    this.state = this.initialState; //Store the initial state, so it can be restored

  }

  componentDidMount(){
    this.getSensorData();   
    this.getRelayData(); 
  }

  getSensorData(){
    //get query parameter
    this.setState({
      stationName: this.props.appLocation.search.split("&")[0].split("=")[1],
      stationIp: this.props.appLocation.search.split("&")[1].split("=")[1]
    }, () => {
      
      //Loop over sensors:
      for (var i = 0; i < this.state.sensorTypes.length; i++) {

        const _i = i;

        //Get station status:
        fetch(config.api_baseurl + "/sensorLastValue?stationName=" + this.state.stationName + "&sensorType=" + this.state.sensorTypes[_i])
          .then(res => res.json())
          .then((result) => {


            if (result.status === "ok") {
              this.state.sensorValues[_i] = result.data.sensorValue;
              this.state.sensorTimestamps[_i] = result.data.timestamp;
              this.forceUpdate();
            }
          }
        )
      }
    }
  )}

  getRelayData(){

    //get query parameter
    this.setState({
      stationName: this.props.appLocation.search.split("&")[0].split("=")[1],
      stationIp: this.props.appLocation.search.split("&")[1].split("=")[1]
    }, () => {
      //Loop over realay:
      for (var i = 0; i < this.state.relays.length; i++) {

        const _i = i;
        //Get station status:
        fetch(config.api_baseurl + "/relayLast?stationName=" + this.state.stationName + "&relayChannel=" + this.state.relays[_i])
          .then(res => res.json())
          .then((result) => {
            if (result.status === "ok") {
              this.state.relaysStatus[_i] = result.data.relayStatus;
              this.state.relaysTimestamp[_i] = result.data.timestamp;
              this.forceUpdate();
            }
          }
        )
      }

    });
  }
  
  renderSensors(){

    var sensorsDOMelements = [];

    //Loop over stations:
    for (var i = 0; i < this.state.sensorTypes.length; i++) {

      var url = "/graph?stationName=" + this.state.stationName + "&sensorType=" + this.state.sensorTypes[i];

      if (this.state.sensorValues[i] !== "") {
        sensorsDOMelements.push(
          <Col xs={12} md={4} key={i}>
            <Card className="sensorCard">
              <Card.Header>
                <Link to={url}> 
                  <Button>{this.state.sensorDisplayNames[i]}</Button>
                </Link>
              </Card.Header>
              <Card.Body>
                <Card.Title>
                  {this.state.sensorValues[i]}
                  <span>{this.state.unitMeasures[i]}</span>
                </Card.Title>
              </Card.Body>
              <Card.Footer className="text-muted">{formatDate(this.state.sensorTimestamps[i])}</Card.Footer>
            </Card>
          </Col>
        )
      }
      
    }

    return sensorsDOMelements;
  }

  renderRelays(){

    var relayDOMelements = [];

    //Loop over relay:
    for (var i = 0; i < this.state.relays.length; i++) {

      const _i = i;

      if (this.state.relaysStatus[i]) {
        relayDOMelements.push(
          <Col xs={12} md={4} key={i}>
            <Card className="relayCard">
              <Card.Header>
                {this.state.relays[i]}
              </Card.Header>
              <Card.Body>
                <Card.Title>
                  <Button onClick={() => this.toggleRelay(this.state.relays[_i], this.state.relaysStatus[_i])} className={this.state.relaysStatus[i]}> {this.state.relaysStatus[i]} </Button>
                </Card.Title>
              </Card.Body>
              <Card.Footer className="text-muted">{formatDate(this.state.relaysTimestamp[i])}</Card.Footer>
            </Card>
          </Col>
        )
      }
      
    }

    return relayDOMelements;
  }

  toggleRelay(relayChannel, relayStatus){

    var newRelayStatus = (relayStatus === "ON") ? "OFF" : "ON";

    var confirmMessage = ""
    if (newRelayStatus === "ON") {
      confirmMessage = "Vuoi accendere il relè?"
    } else {
      confirmMessage = "Vuoi spegnere il relè?"
    }

    if (window.confirm(confirmMessage)) {
      var data = {
        "stationName": this.state.stationName,
        "relayChannel": relayChannel,
        "relayStatus": newRelayStatus
      }
      fetch(config.api_baseurl + "/relay", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      })
      .then(res => res.json())
      .then((result) => {
        if (result.status !== "ok") {
          alert("Si è verificato un errore cambiando lo stato del rele");
        } else {
          this.getRelayData();
        }
      });
    }

  }


  render() {
    return (
      <div className="Station">

        <Container>
          <Row>
            <Col xs={12}>
              <h1>{this.state.stationName}</h1>
              <Button id="settings"> <Link to = {"/configuration?stationName=" + this.state.stationName}> <Image src="settings.png"/> </Link> </Button> 
              <a id="iplink" target="_blank" rel="noopener noreferrer" href={"http://" + this.state.stationIp + ":1880"}> {this.state.stationIp} </a>
            </Col>
            {this.renderSensors()}
            {this.renderRelays()}
          </Row>
        </Container>
      </div>
    );
  }
}


function formatDate(timestamp) {

  var date = new Date(timestamp);

  var monthNames = [
    "Gen", "Feb", "Mar",
    "Apr", "Mag", "Giu", "Lug",
    "Ago", "Sett", "Ott",
    "Nov", "Dic"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var minutes = (date.getMinutes()<10?'0':'') + date.getMinutes();
  var hours = date.getHours();

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ' - ' + hours + ':' + minutes;
}