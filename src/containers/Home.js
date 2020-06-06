import React, { Component } from "react";
import { Link } from 'react-router-dom';
import {Container, Row, Col, Card, Alert, Button} from "react-bootstrap";
import config from "../config"; // config.js

import "./Home.css";

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.initialState = {

      notificationsTotal: 0,

      //array of notes
      notes: []
    };

    this.state = this.initialState; //Store the initial state, so it can be restored

  }
  
  componentDidMount(){
    //Fetch all notifications:
    fetch(config.api_baseurl + "/noteAll")
        .then(res => res.json())
        .then((result) => {
          if (result.status === "ok") {
            this.setState({
              notificationsTotal: result.data.length,
              notes: result.data
            });
            this.forceUpdate();
          }
        }
    );
  }

  renderNotes(){

    var notesDOMelements = [];

    //Loop over stations:
    for (var i = 0; i < this.state.notes.length; i++) {
      
      const _i = i;

      if (i < 25) {
        notesDOMelements.push(
          <Alert key={i} dismissible variant={this.state.notes[i].noteType} onClose={() => this.deleteNote(this.state.notes[_i]._id)}>
            <Alert.Heading>{this.state.notes[i].stationName}</Alert.Heading>
            <p> {formatDate(this.state.notes[i].timestamp)} </p>
            <p>{this.state.notes[i].noteText}</p>
          </Alert>
        );
      }

    }

    return notesDOMelements;
  }

  deleteNote(noteid){
    fetch(config.api_baseurl + "/note?noteID=" + noteid, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then((result) => {
      if (result.status === "ok") {
        //Reload page
        window.location.reload();
      } else {
        alert("Si è verificato un errore.")
      }
    });
  }

  deleteAllNotes = () => {

    fetch(config.api_baseurl + "/noteAll", {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then((result) => {
      if (result.status === "ok") {
        //Reload page
        window.location.reload();
      } else {
        alert("Si è verificato un errore.");
      }
    });
  }

  render() {
    return (
      <div className="Home">
        <Container>

          <Row>
            <Col xs={12}>
              {/* At beginning show Serra selection */}
              {(!this.state.serraSelected) ?
                <div>
                  <Card key={0}>
                    <Card.Header>
                      <Link to = {"/stationlist?serraid=1"}> <Button>Serra 1</Button> </Link>
                    </Card.Header>
                  </Card>
                  <Card key={1}>
                    <Card.Header>
                      <Link to = {"/stationlist?serraid=2"}> <Button>Serra 2</Button> </Link>
                    </Card.Header>
                  </Card>
                  <Card key={2}>
                    <Card.Header>
                      <Link to = {"/stationlist?serraid=3"}> <Button>Semenzaio</Button> </Link>
                    </Card.Header>
                  </Card>
                  <Card key={3}>
                    <Card.Header>
                      <Link to = {"/stationlist?serraid=4"}> <Button>Tunnel1</Button> </Link>
                    </Card.Header>
                  </Card>
                </div>
                :
                this.renderStations()}
            </Col>
          </Row>

          <Row id="notesContainer">
            <Col xs={12}>
              <h1> Notifiche ({this.state.notificationsTotal})</h1>
              <Button id="deleteallbtn" onClick={this.deleteAllNotes}> Elimina Notifiche </Button>
            </Col>
            <Col xs={12}>
              {this.renderNotes()}
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
