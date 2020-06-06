import React, { Component } from 'react';
import { Switch, Route, withRouter, Link} from 'react-router-dom'
import {Navbar,Image} from "react-bootstrap"

import Home from "./containers/Home"
import StationList from "./containers/StationList"

import Station from "./containers/Station"
import MotorStation from "./containers/MotorStation"
import FluxStation from "./containers/FluxStation"

import Graph from "./containers/Graph"
import Configuration from "./containers/Configuration"
import MotorConfiguration from "./containers/MotorConfiguration"

import config from "./config"; // config.js

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      serverIsAlive: false
    };
  }

  componentDidMount(){
    //Check server status
    fetch(config.api_baseurl + "/serverStatus")
      .then(res => res.json())
      .then((result) => {
        if (result.status === "ok") {
          this.setState({
            serverIsAlive: true
          });
        }
      }
    )
  }

  render() {
    return (
      <div className="App">
        
        <Navbar>
          <Navbar.Brand> <Link to="/"> <Image id="logo" src="logo.png"></Image> </Link> </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Server: 
              {this.state.serverIsAlive? 
                <span id="server-connected">Online</span>
                : 
                <span id="server-disconnected">Offline</span>
              }
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        {this.state.serverIsAlive? 
        <Switch>
          <Route path="/" exact render={()=><Home appLocation={this.props.location}/>}/>
          
          <Route path="/station" exact render={()=><Station appLocation={this.props.location}/>}/>
          <Route path="/motorstation" exact render={()=><MotorStation appLocation={this.props.location}/>}/>
          <Route path="/fluxstation" exact render={()=><FluxStation appLocation={this.props.location}/>}/>
          
          <Route path="/stationlist" exact render={()=><StationList appLocation={this.props.location}/>}/>
          <Route path="/graph" exact render={()=><Graph appLocation={this.props.location}/>}/>
          <Route path="/configuration" exact render={()=><Configuration appLocation={this.props.location}/>}/>
          <Route path="/motorconfiguration" exact render={()=><MotorConfiguration appLocation={this.props.location}/>}/>
        </Switch>
        : <h1> Server Offline - Controlla la tua connessione internet e riprova.</h1>
        }
      </div>
    );
  }


}

export default withRouter(App);
