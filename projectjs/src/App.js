import React from 'react';
import * as bs from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import HeaderContainer from './header'
import LeftContainer from './left-container'
import RightContainer from './right-container'
import FooterContainer from './footer'
import Home from './home'
import About from './about'
import Calculator from './calculator'
import './App.scss'

function App() {

  return (
    <Router>
      <bs.Container fluid className="p-0 min-vh-100 d-flex flex-column">
        <bs.Row noGutters className="flex-grow-0 flex-shrink-0 shadow-sm">
          <bs.Col style={{backgroundColor: "#eeffe6"}}>
            <HeaderContainer />
          </bs.Col>
        </bs.Row>
        <bs.Row noGutters className="flex-grow-1">
          <bs.Col md="2" className="shadow-sm" style={{backgroundColor: "#FFFFFF"}}>
            <LeftContainer />
          </bs.Col>
          <bs.Col md="8">
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/campaign">
                <Home />
              </Route>
              <Route path="/">
                <Calculator />                
              </Route>
            </Switch>
          </bs.Col>
          <bs.Col md="2" className="shadow-sm" style={{backgroundColor: "#FFFFFF"}}>
            <RightContainer />
          </bs.Col>
        </bs.Row>
        <bs.Row className="no-gutters">
          <bs.Col style={{backgroundColor: "#eeffe6"}}>
            <FooterContainer />
          </bs.Col>
        </bs.Row>
      </bs.Container>
    </Router>
  );
}

export default App;