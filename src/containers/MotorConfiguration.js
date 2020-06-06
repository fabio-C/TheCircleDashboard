import React, { Component } from "react";
import "./MotorConfiguration.css";
import config from "../config"; // config.js
import {Container, Row, Col, Form, Button} from "react-bootstrap";

export default class MotorConfiguration extends Component {

  constructor(props) {
    super(props);

    this.initialState = {
      stationName:"",

      configurationFound: false,

      time: [], //opening/closing times
      timer_mode: false,

      editMode:false
    };

    this.state = this.initialState; //Store the initial state, so it can be restored

    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);

    this.handleChangeTime = this.handleChangeTime.bind(this);
  }

  componentDidMount(){
    //get query parameter
    var stationName = this.props.appLocation.search.split("=")[1];
    this.setState({
      stationName: stationName
    });

    //load conf data
    this.loadConfigurationData();
  }

  loadConfigurationData(){
    //get config obj:
    var stationName = this.props.appLocation.search.split("=")[1];
    
    fetch(config.api_baseurl + "/configuration?stationName=" + stationName)
      .then(res => res.json())
        .then((result) => {
          console.log(result);

          if (result.status === "ok") {
            this.setState({
              configurationFound: true,
              time: result.data.time,
              timer_mode: result.data.timer_mode 
            });
          } else {
            //
          }
          
        }
      )
    
    /*
    //fake data
    this.setState({
      time: [
        [
          ["10","20"],
          ["10","22"],
          ["10","24"]
        ], 
        [
          ["12","20"],
          ["12","22"],
          ["12","24"]
        ]
      ],
      timer_mode: true
    });
    */
    
  }

  toggleMode = () => {

    //Toggle Edit Mode
    this.setState({
      editMode: !this.state.editMode
    });

    //Cancel modification and restore default data
    if (this.state.editMode) {
      this.loadConfigurationData();
    }
  }

  /*
    onoffmode: 0-1 (on, off)
  */
  addRowTimer = (onoffmode) => {
    this.state.time[onoffmode].push(["0","0"]);
    this.forceUpdate();
  }

  deleteRowTimer = (onoffmode, timerow) => {
    this.state.time[onoffmode].splice(timerow, 1);
    this.forceUpdate();
  }

  handleChangeCheckbox(event) {
    this.setState({
      [event.target.id]: event.target.checked
    });
  }

  /*
    relayChannel: 'RELAYX'
    hotcoldmode: 'hot', 'cold'
    onoffmode: 0-1 (on, off)
    timerow: num of row
    timecol: 0-1 (hours, minute)
  */
  handleChangeTime(e, onoffmode, timerow, timecol) {
    this.state.time[onoffmode][timerow][timecol] = e.target.value;
    this.forceUpdate();
  }

  /*
    relayChannel: 'RELAY1',
    onoffmode: 0-1 (on, off)
  */
  renderTimers(onoffmode){

    var dom = [];

    if(this.state.time.length){ //Wait data load
      
      for (var i = 0; i < this.state.time[onoffmode].length; i++) {
        const _i = i;
        dom.push(
          <div key={i}>
            <input className="timeon" type="number" value={this.state.time[onoffmode][_i][0]} onChange={(e) => this.handleChangeTime(e, onoffmode, _i, 0)} disabled={!this.state.editMode}/>
            <input className="timeon" type="number" value={this.state.time[onoffmode][_i][1]} onChange={(e) => this.handleChangeTime(e, onoffmode, _i, 1)} disabled={!this.state.editMode}/>
            <Button variant="outline-danger" onClick={() => this.deleteRowTimer(onoffmode, _i)}> - </Button>
          </div>
        );
      }
      
      return dom;
    }
  }

  sendDefaultConfiguration = () =>{
    var data = {
      "stationName": this.state.stationName,
      "time": [[],[]],
      "timer_mode": false
    }

    fetch(config.api_baseurl + "/motorconfiguration", {
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
        alert("Stazione Configurata");
      } else {
        alert("Errore configurazione");
      }
    });
  }
  postConfiguration = () => {

    var data = {
      "stationName": this.state.stationName,
      "time": this.state.time,
      "timer_mode": this.state.timer_mode
    }

    fetch(config.api_baseurl + "/motorconfiguration", {
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
        alert("Stazione Configurata");
      } else {
        alert("Errore configurazione");
      }
    });
  }

  render() {
    return (
      <div className="MotorConfiguration">
        <Container>
          <Row>
            <Col xs={12}>
              <h1>{this.state.stationName}</h1>
            </Col>
          </Row>

          {this.state.configurationFound ?

            <Row>
              <Col xs={12} id="configuration-button-container">
                <Button variant="dark" onClick={this.toggleMode}>
                {this.state.editMode?
                  <span>Annulla</span>
                  : <span>Modifica </span>
                }
                </Button>

                {this.state.editMode?
                  <Button variant="danger" onClick={this.postConfiguration}> Invia </Button>
                  : null}
              </Col>

              <Col xs={12}>
                <Form>
                  <Form.Check 
                      custom
                      type="checkbox"
                      id="timer_mode"
                      label="Modalità Timer"
                      disabled={!this.state.editMode}
                      checked={this.state.timer_mode}
                      onChange={this.handleChangeCheckbox}
                    />
                  </Form>

                  {this.state.timer_mode ?
                    <Row>
                      <Col xs={12} md={6}>
                        
                        <p>Tempi UP </p>
                        
                        {this.renderTimers(0)}
                        
                        {this.state.editMode?
                        <div className="row-button-container">
                          <Button variant="outline-primary" onClick={() => this.addRowTimer(0)}> + </Button>
                        </div>
                        : null}
                      </Col>
                      <Col xs={12} md={6}>
                        
                        <p>Tempi DOWN </p>
                        
                        {this.renderTimers(1)}
                        
                        {this.state.editMode?
                        <div className="row-button-container">
                          <Button variant="outline-primary" onClick={() => this.addRowTimer(1)}> + </Button>
                        </div>
                        : null}
                      </Col>
                    </Row>
                  : null}
              </Col>
            </Row>
            
            :

            <Row>
              <Col xs={12}>
                <Button variant="dark" onClick={this.sendDefaultConfiguration}>Invia Configurazione Default</Button>
              </Col>
            </Row>
          }
        </Container>
      </div>
    );
  }
}