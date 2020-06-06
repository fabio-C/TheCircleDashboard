import React, { Component } from "react";
import config from "../config"; // config.js
import {Container, Row, Col, Card, Button, Image} from "react-bootstrap";
import { Link } from 'react-router-dom';

import "./MotorStation.css";

export default class MotorStation extends Component {

  constructor(props) {
    super(props);

    this.initialState = {
      stationName:"",
      stationIp:""
    };

    this.state = this.initialState; //Store the initial state, so it can be restored

  }

  componentDidMount(){

    //get query parameter
    this.setState({
      stationName: this.props.appLocation.search.split("&")[0].split("=")[1],
      stationIp: this.props.appLocation.search.split("&")[1].split("=")[1]
    });

  }

  sendMotorCommand(motorCommand){
    var data = {
      "stationName": this.state.stationName,
      "motorCommand": motorCommand
    }

    fetch(config.api_baseurl + "/motor", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(res => res.json())
    .then((result) => {
      if (result.status === "ok") {
        alert("Comando Motore inviato");
      } else {
        alert("Errore comando motore");
      }
    });
  }


  render() {
    return (
      <div className="MotorStation">

        <Container>
          <Row>

            <Col xs={12}>
              <h1>{this.state.stationName}</h1>
              <Button id="settings"> <Link to = {"/motorConfiguration?stationName=" + this.state.stationName}> <Image src="settings.png"/> </Link> </Button> 
              <a id="iplink" target="_blank" rel="noopener noreferrer" href={"http://" + this.state.stationIp + ":1880"}> {this.state.stationIp} </a>
            </Col>

            <Col xs={12}>
              <Card className="online motor" key={100}>
                <Card.Header>
                    Controllo Manuale Motore
                </Card.Header>
                <Card.Body>
                  <Button className="motorbutton" variant="outline-success" onClick={() => this.sendMotorCommand("MOTOR_UP")}>UP</Button>
                  <Button className="motorbutton" variant="outline-success" onClick={() => this.sendMotorCommand("MOTOR_DOWN")}>DOWN</Button>
                  <Button className="motorbutton" variant="outline-danger" onClick={() => this.sendMotorCommand("MOTOR_OFF")}>OFF</Button>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Container>
      </div>
    );
  }
}