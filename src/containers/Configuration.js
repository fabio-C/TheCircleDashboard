import React, { Component } from "react";
import "./Configuration.css";
import config from "../config"; // config.js
import {Container, Row, Col, Form, Tab, Tabs, Nav, Button} from "react-bootstrap";

export default class Configuration extends Component {

  constructor(props) {
    super(props);

    this.initialState = {
      stationName:"",
      
      station_threshold_hotcold: "",

      relay1_time_hot: [], //times hot on/of for relay1
      relay1_time_cold: [], //times cold on/of for relay1
      relay1_threshold: 0, //threshold value for relay1
      relay1_timer_mode: false,
      relay1_threshold_mode: false,

      relay2_time_hot: [], //times hot on/of for relay2
      relay2_time_cold: [], //times cold on/of for relay2
      relay2_threshold: 0, //threshold value for relay2
      relay2_timer_mode: false,
      relay2_threshold_mode: false,

      relay3_time_hot: [], //times hot on/of for relay3
      relay3_time_cold: [], //times cold on/of for relay3
      relay3_threshold: 0, //threshold value for relay3
      relay3_timer_mode: false,
      relay3_threshold_mode: false,

      relay4_time_hot: [], //times on/of for relay4
      relay4_time_cold: [], //times on/of for relay4
      relay4_threshold: 0, //threshold value for relay4
      relay4_timer_mode: false,
      relay4_threshold_mode: false,

      relay5_time_hot: [], //times on/of for relay5
      relay5_time_cold: [], //times on/of for relay5
      relay5_threshold: 0, //threshold value for relay5
      relay5_timer_mode: false,
      relay5_threshold_mode: false,

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

              station_threshold_hotcold: result.data.station_threshold_hotcold,

              relay1_timer_mode: result.data.relay1.timer_mode,
              relay1_threshold_mode: result.data.relay1.threshold_mode,
              relay1_time_hot: result.data.relay1.time_hot,
              relay1_time_cold: result.data.relay1.time_cold,
              relay1_threshold: result.data.relay1.threshold,

              relay2_timer_mode: result.data.relay2.timer_mode,
              relay2_threshold_mode: result.data.relay2.threshold_mode,
              relay2_time_hot: result.data.relay2.time_hot,
              relay2_time_cold: result.data.relay2.time_cold,
              relay2_threshold: result.data.relay2.threshold,

              relay3_timer_mode: result.data.relay3.timer_mode,
              relay3_threshold_mode: result.data.relay3.threshold_mode,
              relay3_time_hot: result.data.relay3.time_hot,
              relay3_time_cold: result.data.relay3.time_cold,
              relay3_threshold: result.data.relay3.threshold,

              relay4_timer_mode: result.data.relay4.timer_mode,
              relay4_threshold_mode: result.data.relay4.threshold_mode,
              relay4_time_hot: result.data.relay4.time_hot,
              relay4_time_cold: result.data.relay4.time_cold,
              relay4_threshold: result.data.relay4.threshold, 

              relay5_timer_mode: result.data.relay5.timer_mode,
              relay5_threshold_mode: result.data.relay5.threshold_mode,
              relay5_time_hot: result.data.relay5.time_hot,
              relay5_time_cold: result.data.relay5.time_cold,
              relay5_threshold: result.data.relay5.threshold    
            });
          } else {
            alert("configuration not found, error");
          }
          
        }
      )
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
    relayChannel: 'RELAYX'
    hotcoldmode: 'hot', 'cold'
    onoffmode: 0-1 (on, off)
  */
  addRowTimer = (relayChannel, hotcoldmode, onoffmode) => {

    console.log(relayChannel);
    console.log(hotcoldmode);
    console.log(onoffmode);

    switch(relayChannel) {
      case 'RELAY1':
        if (hotcoldmode === 'hot') {
          this.state.relay1_time_hot[onoffmode].push(["0","0"]);
        } else if (hotcoldmode === 'cold') {
          this.state.relay1_time_cold[onoffmode].push(["0","0"]);
        }
        this.forceUpdate();
        break;
      case 'RELAY2':
        if (hotcoldmode === 'hot') {
          this.state.relay2_time_hot[onoffmode].push(["0","0"]);
        } else if (hotcoldmode === 'cold') {
          this.state.relay2_time_cold[onoffmode].push(["0","0"]);
        }
        this.forceUpdate();
        break;
      case 'RELAY3':
        if (hotcoldmode === 'hot') {
          this.state.relay3_time_hot[onoffmode].push(["0","0"]);
        } else if (hotcoldmode === 'cold') {
          this.state.relay3_time_cold[onoffmode].push(["0","0"]);
        }
        this.forceUpdate();
        break;
      case 'RELAY4':
        if (hotcoldmode === 'hot') {
          this.state.relay4_time_hot[onoffmode].push(["0","0"]);
        } else if (hotcoldmode === 'cold') {
          this.state.relay4_time_cold[onoffmode].push(["0","0"]);
        }
        this.forceUpdate();
        break;
      case 'RELAY5':
        if (hotcoldmode === 'hot') {
          this.state.relay5_time_hot[onoffmode].push(["0","0"]);
        } else if (hotcoldmode === 'cold') {
          this.state.relay5_time_cold[onoffmode].push(["0","0"]);
        }
        this.forceUpdate();
        break;
      default:
        break;
    }
  }

  deleteRowTimer = (relayChannel, hotcoldmode, onoffmode, timerow) => {

    switch(relayChannel) {
      case 'RELAY1':
        if (hotcoldmode === 'hot') {
          this.state.relay1_time_hot[onoffmode].splice(timerow, 1);
        } else if(hotcoldmode === 'cold'){
          this.state.relay1_time_cold[onoffmode].splice(timerow, 1);
        }
        this.forceUpdate();
        break;
      case 'RELAY2':
        if (hotcoldmode === 'hot') {
          this.state.relay2_time_hot[onoffmode].splice(timerow, 1);
        } else if(hotcoldmode === 'cold'){
          this.state.relay2_time_cold[onoffmode].splice(timerow, 1);
        }
        this.forceUpdate();
        break;
      case 'RELAY3':
        if (hotcoldmode === 'hot') {
          this.state.relay3_time_hot[onoffmode].splice(timerow, 1);
        } else if(hotcoldmode === 'cold'){
          this.state.relay3_time_cold[onoffmode].splice(timerow, 1);
        }
        this.forceUpdate();
        break;
      case 'RELAY4':
        if (hotcoldmode === 'hot') {
          this.state.relay4_time_hot[onoffmode].splice(timerow, 1);
        } else if(hotcoldmode === 'cold'){
          this.state.relay4_time_cold[onoffmode].splice(timerow, 1);
        }
        this.forceUpdate();
        break;
      case 'RELAY5':
        if (hotcoldmode === 'hot') {
          this.state.relay5_time_hot[onoffmode].splice(timerow, 1);
        } else if(hotcoldmode === 'cold'){
          this.state.relay5_time_cold[onoffmode].splice(timerow, 1);
        }
        this.forceUpdate();
        break;
      default:
        break;
    }

  }

  handleChangeStationThreshold (event){
    this.setState({
      station_threshold_hotcold: event.target.value
    });
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
  handleChangeTime(e, relayChannel, hotcoldmode, onoffmode, timerow, timecol) {

    switch(relayChannel) {
      case 'RELAY1':
        if (hotcoldmode === 'hot') {
          this.state.relay1_time_hot[onoffmode][timerow][timecol] = e.target.value;
        } else if (hotcoldmode === 'cold'){
          this.state.relay1_time_cold[onoffmode][timerow][timecol] = e.target.value;
        }
        this.forceUpdate();
        break;
      case 'RELAY2':
        if (hotcoldmode === 'hot') {
          this.state.relay2_time_hot[onoffmode][timerow][timecol] = e.target.value;
        } else if (hotcoldmode === 'cold'){
          this.state.relay2_time_cold[onoffmode][timerow][timecol] = e.target.value;
        }
        this.forceUpdate();
        break;
      case 'RELAY3':
        if (hotcoldmode === 'hot') {
          this.state.relay3_time_hot[onoffmode][timerow][timecol] = e.target.value;
        } else if (hotcoldmode === 'cold'){
          this.state.relay3_time_cold[onoffmode][timerow][timecol] = e.target.value;
        }
        this.forceUpdate();
        break;
      case 'RELAY4':
        if (hotcoldmode === 'hot') {
          this.state.relay4_time_hot[onoffmode][timerow][timecol] = e.target.value;
        } else if (hotcoldmode === 'cold'){
          this.state.relay4_time_cold[onoffmode][timerow][timecol] = e.target.value;
        }
        this.forceUpdate();
        break;
      case 'RELAY5':
        if (hotcoldmode === 'hot') {
          this.state.relay5_time_hot[onoffmode][timerow][timecol] = e.target.value;
        } else if (hotcoldmode === 'cold'){
          this.state.relay5_time_cold[onoffmode][timerow][timecol] = e.target.value;
        }
        this.forceUpdate();
        break;
      default:
        break;
    }


  }

  /*
    relayChannel: 'RELAY1',
    hotcoldmode: 'hot', 'cold'
    onoffmode: 0-1 (on, off)
  */
  renderRelayTimers(relayChannel, hotcoldmode, onoffmode){

    var dom = [];
    var i = 0;

    switch(relayChannel) {
      case 'RELAY1':

        if (hotcoldmode === 'hot') {
          if(this.state.relay1_time_hot.length){ //Wait data load
            
            for (i = 0; i < this.state.relay1_time_hot[onoffmode].length; i++) {
              const _i = i;
              dom.push(
                <div key={i}>
                  <input className="timeon" type="number" value={this.state.relay1_time_hot[onoffmode][_i][0]} onChange={(e) => this.handleChangeTime(e, 'RELAY1', 'hot', onoffmode, _i, 0)} disabled={!this.state.editMode}/>
                  <input className="timeon" type="number" value={this.state.relay1_time_hot[onoffmode][_i][1]} onChange={(e) => this.handleChangeTime(e, 'RELAY1', 'hot', onoffmode, _i, 1)} disabled={!this.state.editMode}/>
                  <Button variant="outline-danger" onClick={() => this.deleteRowTimer('RELAY1', 'hot', onoffmode, _i)}> - </Button>
                </div>
              );
            }
            return dom;
          }
        } else if(hotcoldmode === 'cold'){

          if(this.state.relay1_time_cold.length){ //Wait data load

            for (i = 0; i < this.state.relay1_time_cold[onoffmode].length; i++) {
              const _i = i;
              dom.push(
                <div key={i}>
                  <input className="timeon" type="number" value={this.state.relay1_time_cold[onoffmode][_i][0]} onChange={(e) => this.handleChangeTime(e, 'RELAY1', 'cold', onoffmode, _i, 0)} disabled={!this.state.editMode}/>
                  <input className="timeon" type="number" value={this.state.relay1_time_cold[onoffmode][_i][1]} onChange={(e) => this.handleChangeTime(e, 'RELAY1', 'cold', onoffmode, _i, 1)} disabled={!this.state.editMode}/>
                  <Button variant="outline-danger" onClick={() => this.deleteRowTimer('RELAY1', 'cold', onoffmode, _i)}> - </Button>
                </div>
              );
            }
            return dom;
          }
        }
        break;
      case 'RELAY2':
        if (hotcoldmode === 'hot') {
          if(this.state.relay2_time_hot.length){ //Wait data load
            
            for (i = 0; i < this.state.relay2_time_hot[onoffmode].length; i++) {
              const _i = i;
              dom.push(
                <div key={i}>
                  <input className="timeon" type="number" value={this.state.relay2_time_hot[onoffmode][_i][0]} onChange={(e) => this.handleChangeTime(e, 'RELAY2', 'hot', onoffmode, _i, 0)} disabled={!this.state.editMode}/>
                  <input className="timeon" type="number" value={this.state.relay2_time_hot[onoffmode][_i][1]} onChange={(e) => this.handleChangeTime(e, 'RELAY2', 'hot', onoffmode, _i, 1)} disabled={!this.state.editMode}/>
                  <Button variant="outline-danger" onClick={() => this.deleteRowTimer('RELAY2', 'hot', onoffmode, _i)}> - </Button>
                </div>
              );
            }
            return dom;
          }
        } else if(hotcoldmode === 'cold'){
          if(this.state.relay2_time_cold.length){ //Wait data load
            
            for (i = 0; i < this.state.relay2_time_cold[onoffmode].length; i++) {
              const _i = i;
              dom.push(
                <div key={i}>
                  <input className="timeon" type="number" value={this.state.relay2_time_cold[onoffmode][_i][0]} onChange={(e) => this.handleChangeTime(e, 'RELAY2', 'cold', onoffmode, _i, 0)} disabled={!this.state.editMode}/>
                  <input className="timeon" type="number" value={this.state.relay2_time_cold[onoffmode][_i][1]} onChange={(e) => this.handleChangeTime(e, 'RELAY2', 'cold', onoffmode, _i, 1)} disabled={!this.state.editMode}/>
                  <Button variant="outline-danger" onClick={() => this.deleteRowTimer('RELAY2', 'cold', onoffmode, _i)}> - </Button>
                </div>
              );
            }
            return dom;
          }
        }
        break;
      case 'RELAY3':
        if (hotcoldmode === 'hot') {
          if(this.state.relay3_time_hot.length){ //Wait data load
            
            for (i = 0; i < this.state.relay3_time_hot[onoffmode].length; i++) {
              const _i = i;
              dom.push(
                <div key={i}>
                  <input className="timeon" type="number" value={this.state.relay3_time_hot[onoffmode][_i][0]} onChange={(e) => this.handleChangeTime(e, 'RELAY3', 'hot', onoffmode, _i, 0)} disabled={!this.state.editMode}/>
                  <input className="timeon" type="number" value={this.state.relay3_time_hot[onoffmode][_i][1]} onChange={(e) => this.handleChangeTime(e, 'RELAY3', 'hot', onoffmode, _i, 1)} disabled={!this.state.editMode}/>
                  <Button variant="outline-danger" onClick={() => this.deleteRowTimer('RELAY3', 'hot', onoffmode, _i)}> - </Button>
                </div>
              );
            }
            return dom;
          }
        } else if(hotcoldmode === 'cold'){
          if(this.state.relay3_time_cold.length){ //Wait data load
            
            for (i = 0; i < this.state.relay3_time_cold[onoffmode].length; i++) {
              const _i = i;
              dom.push(
                <div key={i}>
                  <input className="timeon" type="number" value={this.state.relay3_time_cold[onoffmode][_i][0]} onChange={(e) => this.handleChangeTime(e, 'RELAY3', 'cold', onoffmode, _i, 0)} disabled={!this.state.editMode}/>
                  <input className="timeon" type="number" value={this.state.relay3_time_cold[onoffmode][_i][1]} onChange={(e) => this.handleChangeTime(e, 'RELAY3', 'cold', onoffmode, _i, 1)} disabled={!this.state.editMode}/>
                  <Button variant="outline-danger" onClick={() => this.deleteRowTimer('RELAY3', 'cold', onoffmode, _i)}> - </Button>
                </div>
              );
            }
            return dom;
          }
        }
        break;
      case 'RELAY4':
        if (hotcoldmode === 'hot') {
          if(this.state.relay4_time_hot.length){ //Wait data load
            
            for (i = 0; i < this.state.relay4_time_hot[onoffmode].length; i++) {
              const _i = i;
              dom.push(
                <div key={i}>
                  <input className="timeon" type="number" value={this.state.relay4_time_hot[onoffmode][_i][0]} onChange={(e) => this.handleChangeTime(e, 'RELAY4', 'hot', onoffmode, _i, 0)} disabled={!this.state.editMode}/>
                  <input className="timeon" type="number" value={this.state.relay4_time_hot[onoffmode][_i][1]} onChange={(e) => this.handleChangeTime(e, 'RELAY4', 'hot', onoffmode, _i, 1)} disabled={!this.state.editMode}/>
                  <Button variant="outline-danger" onClick={() => this.deleteRowTimer('RELAY4', 'hot', onoffmode, _i)}> - </Button>
                </div>
              );
            }
            return dom;
          }
        } else if(hotcoldmode === 'cold'){
          if(this.state.relay4_time_cold.length){ //Wait data load
            
            for (i = 0; i < this.state.relay4_time_cold[onoffmode].length; i++) {
              const _i = i;
              dom.push(
                <div key={i}>
                  <input className="timeon" type="number" value={this.state.relay4_time_cold[onoffmode][_i][0]} onChange={(e) => this.handleChangeTime(e, 'RELAY4', 'cold', onoffmode, _i, 0)} disabled={!this.state.editMode}/>
                  <input className="timeon" type="number" value={this.state.relay4_time_cold[onoffmode][_i][1]} onChange={(e) => this.handleChangeTime(e, 'RELAY4', 'cold', onoffmode, _i, 1)} disabled={!this.state.editMode}/>
                  <Button variant="outline-danger" onClick={() => this.deleteRowTimer('RELAY4', 'cold', onoffmode, _i)}> - </Button>
                </div>
              );
            }
            return dom;
          }
        }
        break;
      case 'RELAY5':
        if (hotcoldmode === 'hot') {
          if(this.state.relay5_time_hot.length){ //Wait data load
            
            for (i = 0; i < this.state.relay5_time_hot[onoffmode].length; i++) {
              const _i = i;
              dom.push(
                <div key={i}>
                  <input className="timeon" type="number" value={this.state.relay5_time_hot[onoffmode][_i][0]} onChange={(e) => this.handleChangeTime(e, 'RELAY5', 'hot', onoffmode, _i, 0)} disabled={!this.state.editMode}/>
                  <input className="timeon" type="number" value={this.state.relay5_time_hot[onoffmode][_i][1]} onChange={(e) => this.handleChangeTime(e, 'RELAY5', 'hot', onoffmode, _i, 1)} disabled={!this.state.editMode}/>
                  <Button variant="outline-danger" onClick={() => this.deleteRowTimer('RELAY5', 'hot', onoffmode, _i)}> - </Button>
                </div>
              );
            }
            return dom;
          }
        } else if(hotcoldmode === 'cold'){
          if(this.state.relay5_time_cold.length){ //Wait data load
            
            for (i = 0; i < this.state.relay5_time_cold[onoffmode].length; i++) {
              const _i = i;
              dom.push(
                <div key={i}>
                  <input className="timeon" type="number" value={this.state.relay5_time_cold[onoffmode][_i][0]} onChange={(e) => this.handleChangeTime(e, 'RELAY5', 'cold', onoffmode, _i, 0)} disabled={!this.state.editMode}/>
                  <input className="timeon" type="number" value={this.state.relay5_time_cold[onoffmode][_i][1]} onChange={(e) => this.handleChangeTime(e, 'RELAY5', 'cold', onoffmode, _i, 1)} disabled={!this.state.editMode}/>
                  <Button variant="outline-danger" onClick={() => this.deleteRowTimer('RELAY5', 'cold', onoffmode, _i)}> - </Button>
                </div>
              );
            }
            return dom;
          }
        }
        break;
      default:
        break;
    }
  }

  postConfiguration = () => {

    var data = {
      "stationName": this.state.stationName,
      "station_threshold_hotcold": this.state.station_threshold_hotcold,
      "relay1": {
        "timer_mode":this.state.relay1_timer_mode,
        "threshold_mode":this.state.relay1_threshold_mode,
        "time_hot":this.state.relay1_time_hot,
        "time_cold":this.state.relay1_time_cold,
        "threshold":this.state.relay1_threshold
       },
      "relay2": {
        "timer_mode":this.state.relay2_timer_mode,
        "threshold_mode":this.state.relay2_threshold_mode,
        "time_hot":this.state.relay2_time_hot,
        "time_cold":this.state.relay2_time_cold,
        "threshold":this.state.relay2_threshold
       },
       "relay3": {
        "timer_mode":this.state.relay3_timer_mode,
        "threshold_mode":this.state.relay3_threshold_mode,
        "time_hot":this.state.relay3_time_hot,
        "time_cold":this.state.relay3_time_cold,
        "threshold":this.state.relay3_threshold
       },
       "relay4": {
        "timer_mode":this.state.relay4_timer_mode,
        "threshold_mode":this.state.relay4_threshold_mode,
        "time_hot":this.state.relay4_time_hot,
        "time_cold":this.state.relay4_time_cold,
        "threshold":this.state.relay4_threshold
       },
       "relay5": {
        "timer_mode":this.state.relay5_timer_mode,
        "threshold_mode":this.state.relay5_threshold_mode,
        "time_hot":this.state.relay5_time_hot,
        "time_cold":this.state.relay5_time_cold,
        "threshold":this.state.relay5_threshold
       }
    }

    fetch(config.api_baseurl + "/configuration", {
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

  sendDefaultConfiguration = () =>{
    var data = {
      "stationName": this.state.stationName,
      "station_threshold_hotcold": 0,
      "relay1": {
        "timer_mode":false,
        "threshold_mode":false,
        "time_hot":[[],[]],
        "time_cold":[[],[]],
        "threshold":[[],[]]
      },
      "relay2": {
        "timer_mode":false,
        "threshold_mode":false,
        "time_hot":[[],[]],
        "time_cold":[[],[]],
        "threshold":[[],[]]
      },
      "relay3": {
        "timer_mode":false,
        "threshold_mode":false,
        "time_hot":[[],[]],
        "time_cold":[[],[]],
        "threshold":[[],[]]
      },
      "relay4": {
        "timer_mode":false,
        "threshold_mode":false,
        "time_hot":[[],[]],
        "time_cold":[[],[]],
        "threshold":[[],[]]
      },
      "relay5": {
        "timer_mode":false,
        "threshold_mode":false,
        "time_hot":[[],[]],
        "time_cold":[[],[]],
        "threshold":[[],[]]
      }
    }

    fetch(config.api_baseurl + "/configuration", {
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
      <div className="Configuration">
        <Container>

          <Row>
              <Col xs={12}>
                <Button variant="dark" onClick={this.sendDefaultConfiguration}>Invia Configurazione Default</Button>
              </Col>
            </Row>

          <Row>
            <Col xs={12}>
              <h1>{this.state.stationName}</h1>
            </Col>

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
              <Tab.Container defaultActiveKey="first">
                <Row>

                  <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link eventKey="first">Relè 1</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="second">Relè 2</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="third">Relè 3</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="fourth">Relè 4</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="fifth">Relè 5</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>

                  <Col sm={9}>
                    <Tab.Content>



                      {/* RELAY1 TAB */}
                      <Tab.Pane eventKey="first">
                        <Form>
                          <Form.Check 
                            custom
                            type="checkbox"
                            id="relay1_timer_mode"
                            label="Modalità Timer"
                            disabled={!this.state.editMode}
                            checked={this.state.relay1_timer_mode}
                            onChange={this.handleChangeCheckbox}
                          />
                          <Form.Check 
                            custom
                            type="checkbox"
                            id="relay1_threshold_mode"
                            label="Modalità Soglia"
                            disabled={!this.state.editMode}
                            checked={this.state.relay1_threshold_mode}
                            onChange={this.handleChangeCheckbox}
                          />
                        </Form>

                        {this.state.relay1_timer_mode?

                          <Tabs defaultActiveKey="cold">
                            <Tab eventKey="cold" title="Tempi COLD">
                              <Row>
                                <Col xs={12} md={6}>
                                  
                                  <p>Tempi Accensione </p>
                                  
                                  {this.renderRelayTimers('RELAY1', 'cold', 0)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY1', 'cold', 0)}> + </Button>
                                  </div>
                                  : null}
                                </Col>
                                <Col xs={12} md={6}>
                                  
                                  <p>Tempi Spegnimento </p>
                                  
                                  {this.renderRelayTimers('RELAY1', 'cold', 1)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY1', 'cold', 1)}> + </Button>
                                  </div>
                                  : null}
                                </Col>
                              </Row>
                            </Tab>
                            <Tab eventKey="hot" title="Tempi HOT">
                              <Row>
                                <Col xs={12} md={6}>
                                  
                                  <p>Tempi Accensione </p>
                                  
                                  {this.renderRelayTimers('RELAY1', 'hot', 0)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY1', 'hot', 0)}> + </Button>
                                  </div>
                                  : null}
                                </Col>
                                <Col xs={12} md={6}>
                                  
                                  <p>Tempi Spegnimento </p>
                                  
                                  {this.renderRelayTimers('RELAY1', 'hot', 1)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY1', 'hot', 1)}> + </Button>
                                  </div>
                                  : null}
                                </Col>
                              </Row>
                            </Tab>
                          </Tabs>

                          
                          : null
                        }

                        {this.state.relay1_threshold_mode?
                          <Row>
                            <Col xs={6}>
                              <p>Soglia</p>
                              <input className="threshold" type="number" value={this.state.relay1_threshold_value} disabled={!this.state.editMode}/>
                            </Col>
                          </Row>
                          : null
                        }
                      </Tab.Pane>
                      
                      {/* RELAY2 TAB */}
                      <Tab.Pane eventKey="second">
                        <Form>
                          <Form.Check 
                            custom
                            type="checkbox"
                            id="relay2_timer_mode"
                            label="Modalità Timer"
                            disabled={!this.state.editMode}
                            checked={this.state.relay2_timer_mode}
                            onChange={this.handleChangeCheckbox}
                          />
                          <Form.Check 
                            custom
                            type="checkbox"
                            id="relay2_threshold_mode"
                            label="Modalità Soglia"
                            disabled={!this.state.editMode}
                            checked={this.state.relay2_threshold_mode}
                            onChange={this.handleChangeCheckbox}
                          />
                        </Form>

                        {this.state.relay2_timer_mode?

                          <Tabs defaultActiveKey="cold">
                            
                            <Tab eventKey="cold" title="Tempi COLD">
                              <Row>
                                <Col xs={6}>
                                  <p>Tempi Accensione </p>

                                  {this.renderRelayTimers('RELAY2', 'cold', 0)}

                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY2', 'cold', 0)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                                <Col xs={6}>
                                  
                                  <p>Tempi Spegnimento </p>
                                  
                                  {this.renderRelayTimers('RELAY2', 'cold', 1)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY2', 'cold', 1)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                              </Row>
                            </Tab>
                            <Tab eventKey="hot" title="Tempi HOT">
                              <Row>
                                <Col xs={6}>
                                  <p>Tempi Accensione </p>

                                  {this.renderRelayTimers('RELAY2', 'hot', 0)}

                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY2', 'hot', 0)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                                <Col xs={6}>
                                  
                                  <p>Tempi Spegnimento </p>
                                  
                                  {this.renderRelayTimers('RELAY2', 'hot', 1)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY2', 'hot', 1)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                              </Row>
                            </Tab>
                          </Tabs>
                          : null
                        }

                        {this.state.relay2_threshold_mode?
                          <Row>
                            <Col xs={6}>
                              <p>Soglia</p>
                              <input className="threshold" type="number" value={this.state.relay2_threshold_value} disabled={!this.state.editMode}/>
                            </Col>
                          </Row>
                          : null
                        }
                      </Tab.Pane>

                      {/* RELAY3 TAB */}
                      <Tab.Pane eventKey="third">
                        <Form>
                          <Form.Check 
                            custom
                            type="checkbox"
                            id="relay3_timer_mode"
                            label="Modalità Timer"
                            disabled={!this.state.editMode}
                            checked={this.state.relay3_timer_mode}
                            onChange={this.handleChangeCheckbox}
                          />
                          <Form.Check 
                            custom
                            type="checkbox"
                            id="relay3_threshold_mode"
                            label="Modalità Soglia"
                            disabled={!this.state.editMode}
                            checked={this.state.relay3_threshold_mode}
                            onChange={this.handleChangeCheckbox}
                          />
                        </Form>

                        {this.state.relay3_timer_mode?
                          <Tabs defaultActiveKey="cold">
                            
                            <Tab eventKey="cold" title="Tempi COLD">
                              <Row>
                                <Col xs={6}>
                                  
                                  <p>Tempi Accensione </p>
                                  
                                  {this.renderRelayTimers('RELAY3', 'cold', 0)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY3', 'cold', 0)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                                <Col xs={6}>
                                  
                                  <p>Tempi Spegnimento </p>
                                  
                                  {this.renderRelayTimers('RELAY3', 'cold', 1)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY3', 'cold', 1)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                              </Row>
                            </Tab>
                            <Tab eventKey="hot" title="Tempi HOT">
                              <Row>
                                <Col xs={6}>
                                  
                                  <p>Tempi Accensione </p>
                                  
                                  {this.renderRelayTimers('RELAY3', 'hot', 0)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY3', 'hot', 0)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                                <Col xs={6}>
                                  
                                  <p>Tempi Spegnimento </p>
                                  
                                  {this.renderRelayTimers('RELAY3', 'hot', 1)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY3', 'hot', 1)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                              </Row>
                            </Tab>
                          </Tabs>
                          : null
                        }

                        {this.state.relay3_threshold_mode?
                          <Row>
                            <Col xs={6}>
                              <p>Soglia</p>
                              <input className="threshold" type="number" value={this.state.relay3_threshold_value} disabled={!this.state.editMode}/>
                            </Col>
                          </Row>
                          : null
                        }
                      </Tab.Pane>

                      {/* RELAY4 TAB */}
                      <Tab.Pane eventKey="fourth">
                        <Form>
                          <Form.Check 
                            custom
                            type="checkbox"
                            id="relay4_timer_mode"
                            label="Modalità Timer"
                            disabled={!this.state.editMode}
                            checked={this.state.relay4_timer_mode}
                            onChange={this.handleChangeCheckbox}
                          />
                          <Form.Check 
                            custom
                            type="checkbox"
                            id="relay4_threshold_mode"
                            label="Modalità Soglia"
                            disabled={!this.state.editMode}
                            checked={this.state.relay4_threshold_mode}
                            onChange={this.handleChangeCheckbox}
                          />
                        </Form>

                        {this.state.relay4_timer_mode?
                          <Tabs defaultActiveKey="cold">
                            <Tab eventKey="cold" title="Tempi COLD">
                              <Row>
                                <Col xs={6}>
                                  
                                  <p>Tempi Accensione </p>
                                  
                                  {this.renderRelayTimers('RELAY4', 'cold', 0)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY4', 'cold', 0)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                                <Col xs={6}>
                                  
                                  <p>Tempi Spegnimento </p>
                                  
                                  {this.renderRelayTimers('RELAY4', 'cold', 1)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY4', 'cold', 1)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                              </Row>
                            </Tab>
                            <Tab eventKey="hot" title="Tempi HOT">
                              <Row>
                                <Col xs={6}>
                                  
                                  <p>Tempi Accensione </p>
                                  
                                  {this.renderRelayTimers('RELAY4', 'hot', 0)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY4', 'hot', 0)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                                <Col xs={6}>
                                  
                                  <p>Tempi Spegnimento </p>
                                  
                                  {this.renderRelayTimers('RELAY4', 'hot', 1)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY4', 'hot', 1)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                              </Row>
                            </Tab>
                            
                          </Tabs>
                          : null
                        }

                        {this.state.relay4_threshold_mode?
                          <Row>
                            <Col xs={6}>
                              <p>Soglia</p>
                              <input className="threshold" type="number" value={this.state.relay4_threshold_value} disabled={!this.state.editMode}/>
                            </Col>
                          </Row>
                          : null
                        }
                      </Tab.Pane>

                      {/* RELAY5 TAB */}
                      <Tab.Pane eventKey="fifth">
                        <Form>
                          <Form.Check 
                            custom
                            type="checkbox"
                            id="relay5_timer_mode"
                            label="Modalità Timer"
                            disabled={!this.state.editMode}
                            checked={this.state.relay5_timer_mode}
                            onChange={this.handleChangeCheckbox}
                          />
                          <Form.Check 
                            custom
                            type="checkbox"
                            id="relay5_threshold_mode"
                            label="Modalità Soglia"
                            disabled={!this.state.editMode}
                            checked={this.state.relay5_threshold_mode}
                            onChange={this.handleChangeCheckbox}
                          />
                        </Form>

                        {this.state.relay5_timer_mode?
                          <Tabs defaultActiveKey="cold">
                            
                            <Tab eventKey="cold" title="Tempi COLD">
                              <Row>
                                <Col xs={6}>
                                  
                                  <p>Tempi Accensione </p>
                                  
                                  {this.renderRelayTimers('RELAY5', 'cold', 0)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY5', 'cold', 0)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                                <Col xs={6}>
                                  
                                  <p>Tempi Spegnimento </p>
                                  
                                  {this.renderRelayTimers('RELAY5', 'cold', 1)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY5', 'cold', 1)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                              </Row>
                            </Tab>
                            <Tab eventKey="hot" title="Tempi HOT">
                              <Row>
                                <Col xs={6}>
                                  
                                  <p>Tempi Accensione </p>
                                  
                                  {this.renderRelayTimers('RELAY5', 'hot', 0)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY5', 'hot', 0)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                                <Col xs={6}>
                                  
                                  <p>Tempi Spegnimento </p>
                                  
                                  {this.renderRelayTimers('RELAY5', 'hot', 1)}
                                  
                                  {this.state.editMode?
                                  <div className="row-button-container">
                                    <Button variant="outline-primary" onClick={() => this.addRowTimer('RELAY5', 'hot', 1)}> + </Button>
                                  </div>
                                  : null}

                                </Col>
                              </Row>
                            </Tab>

                            

                          </Tabs>

                          
                          
                          : null
                        }

                        {this.state.relay5_threshold_mode?
                          <Row>
                            <Col xs={6}>
                              <p>Soglia</p>
                              <input className="threshold" type="number" value={this.state.relay5_threshold_value} disabled={!this.state.editMode}/>
                            </Col>
                          </Row>
                          : null
                        }
                      </Tab.Pane>
                      
                    </Tab.Content>
                  </Col>

                  <Col sm={12}>
                    <div id="hotcoldcontainer">
                      SOGLIA HOT/COLD <input type="number" value={this.state.station_threshold_hotcold} onChange={(e) => this.handleChangeStationThreshold(e)} disabled={!this.state.editMode}/>
                    </div>
                    
                  </Col>
                </Row>
              </Tab.Container>
            </Col>

          </Row>
        </Container>
      </div>
    );
  }
}