import React, { Component } from "react";
import config from "../config"; // config.js
import {Container, Row, Col, Card, Button, Accordion, Form} from "react-bootstrap";

import "./FluxStation.css";

export default class FluxStation extends Component {

  constructor(props) {
    super(props);

    this.initialState = {
      stationName:"",
      stationIp:"",

      relays: ["RELAY1", "RELAY2", "RELAY3", "RELAY4"],
      relaysNickname: ["STOP IRRIGAZIONE", "INGRESSO ACQUA", "RICIRCOLO", "SVUOTAMENTO"],
      relaysStatus: ["","","",""],
      relaysTimestamp: ["","","",""],

      pumps: ["PUMP1", "PUMP2", "PUMP3", "PUMP4"],

      //Automatic input field
      liters: "", //liters
      pump1: "", //microliter/liter
      recycle: "",

      //Manual input field
      channel: "", // pump1/pump2/pump3/pump4
      milliliters: "" //milliliters
    };

    this.state = this.initialState; //Store the initial state, so it can be restored

  }

  componentDidMount(){
    this.getRelayData();   
  }

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
            } else {
              this.state.relaysStatus[_i] = "notfound";
              this.state.relaysTimestamp[_i] = "";
              this.forceUpdate();
            }
          }
        )
      }

    });
  }

  sendActionCommand = (e) => {

    e.preventDefault();

    //Data to send
    var data = {
      "stationName": this.state.stationName,
      "liters": this.state.liters,
      "pump1": this.state.pump1,
      "recycle": this.state.recycle
    }

    fetch(config.api_baseurl + "/fluxaction", {
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
        alert("Comando Azione Inviato");
      } else {
        alert("Errore Comando Azione");
      }
    });
  }

  sendPumpCommand = (e) => {

    e.preventDefault();

    //Data to send
    var data = {
      "stationName": this.state.stationName,
      "channel": this.state.channel,
      "milliliters": this.state.milliliters
    }

    fetch(config.api_baseurl + "/fluxpump", {
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
        alert("Comando Pump Inviato");
      } else {
        alert("Errore Comando Pump");
      }
    });
  }

  renderRelays(){

    var relayDOMelements = [];

    //Loop over relay:
    for (var i = 0; i < this.state.relays.length; i++) {

      const _i = i;

      if ((this.state.relaysStatus[i] === "ON")||(this.state.relaysStatus[i] === "OFF")) {
        relayDOMelements.push(
          <Col xs={12} md={6} key={i}>
            <Card className="relayCard">
              <Card.Header>
                <b>{this.state.relaysNickname[i]}</b>
                ({this.state.relays[i]})
              </Card.Header>
              <Card.Body>
                <Card.Title>
                  <Button onClick={(e) => this.toggleRelay(e,  this.state.relays[_i], this.state.relaysStatus[_i])} className={this.state.relaysStatus[i]}> {this.state.relaysStatus[i]} </Button>
                </Card.Title>
              </Card.Body>
              <Card.Footer className="text-muted">{formatDate(this.state.relaysTimestamp[i])}</Card.Footer>
            </Card>
          </Col>
        )
      } else {
        relayDOMelements.push(
          <p key={i}>
            {this.state.relays[i]}
            <b>NOT FOUND</b>
          </p>
        );
      }
      
    }

    return relayDOMelements;
  }

  renderPumps(){
    return (
      <Col xs={12} md={12}>
          <Card className="pumpCard">
            <Card.Header>
              <b>Pompette peristaltiche</b>
            </Card.Header>
            <Card.Body>
              
              <select onChange={this.handleChangeChannel} defaultValue={'DEFAULT'}>
                <option value="DEFAULT" disabled>Seleziona Canale</option>
                <option value="pump1">Pompa 1</option>
                <option value="pump2">Pompa 2</option>
                <option value="pump3">Pompa 3</option>
                <option value="pump4">Pompa 4</option>
              </select>

              <input value={this.state.milliliters} onChange={this.handleChangePump} type="number" placeholder="millilitri" />

              <Button onClick={this.sendPumpCommand}> Invia </Button>

            </Card.Body>
          </Card>
        </Col>
    )
  }

  handleChangeLiters = (e) => {
    this.setState({
      liters: parseInt(e.target.value)
    });
  }

  handleChangePump1 = (e) => {
    this.setState({
      pump1: parseInt(e.target.value)
    });
  }

  handleChangePump = (e) => {
    this.setState({
      milliliters: parseInt(e.target.value)
    });
  }

  handleChangeRecycle = (e) => {
    this.setState({
      recycle: parseInt(e.target.value)
    });
  }

  handleChangeChannel = (e) => {
    //e.preventDefault();
    this.setState({
      channel: e.target.value
    });
  }

  toggleRelay = (e, relayChannel, relayStatus) => {

    e.preventDefault();

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
          //window.location.reload();
          this.getRelayData();
        }
      });
    }

  }

  render() {
    return (
      <div className="FluxStation">

        <Container>
          <Row>

            <Col xs={12}>
              <h1>{this.state.stationName}</h1>
              <a id="iplink" target="_blank" rel="noopener noreferrer" href={"http://" + this.state.stationIp + ":1880"}> {this.state.stationIp} </a>
            </Col>

            <Col xs={12}>
              
            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Automatic
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>

                    <Form>
                      <Form.Group>
                        <Form.Label>1. Aggiungi acqua</Form.Label>
                        <Form.Control type="number" placeholder="litri" value={this.state.liters} onChange={this.handleChangeLiters}/>
                        <Form.Text className="text-muted">
                          Quanti litri aggiungere
                        </Form.Text>
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>2. Aggiungi soluzione PH</Form.Label>
                        <Form.Control type="number" placeholder="microlitri / litro" value={this.state.pump1} onChange={this.handleChangePump1}/>
                        <Form.Text className="text-muted">
                          Quanti microlitri/litro di soluzione PH
                        </Form.Text>
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>3. Effettua il ricircolo</Form.Label>
                        <Form.Control type="number" placeholder="minuti" value={this.state.recycle} onChange={this.handleChangeRecycle}/>
                        <Form.Text className="text-muted">
                          Quanti minuti dura il ricircolo
                        </Form.Text>
                      </Form.Group>

                      <Button variant="primary" type="submit" onClick={this.sendActionCommand}>
                        Inizia
                      </Button>

                    </Form>

                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Manual
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>

                    <Row>{this.renderRelays()}</Row>
                    <Row>{this.renderPumps()}</Row>

                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>

            </Col>

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