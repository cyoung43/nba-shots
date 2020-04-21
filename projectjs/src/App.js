import React from 'react';
import * as bs from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import HeaderContainer from './header'
//import LeftContainer from './left-container'
//import RightContainer from './right-container'
import FooterContainer from './footer'
//import Home from './home'
import About from './about'
import Calculator from './calculator'
import PicContainer from './picture'
import './App.scss'

function App() {

  return (
    <Router>
      <bs.Container fluid className="p-0 min-vh-100 d-flex flex-column">
        <bs.Row noGutters className="flex-grow-0 flex-shrink-0 shadow-sm">
          <bs.Col>
            <HeaderContainer />
          </bs.Col>
        </bs.Row>
        <bs.Row>
          <bs.Col>
            <PicContainer />
          </bs.Col>
        </bs.Row>
        <bs.Row noGutters style={{marginTop: "-120px"}}>
          <bs.Col md="1" />
          <bs.Col md="10">
            <bs.Card className="shadow-lg mb-4" style={{borderRadius: "20px"}}>
              <Switch>
                <Route path="/about">
                  <About />
                </Route>
                <Route path="/">
                  <Calculator />                
                </Route>
              </Switch>
            </bs.Card>
          </bs.Col>
          <bs.Col md="1" />
        </bs.Row>
        <bs.Row noGutters>
          <bs.Col className="py-2" style={{backgroundColor: "#343a40"}}>
            <FooterContainer />
          </bs.Col>
        </bs.Row>
      </bs.Container>
    </Router>
  );
}

export default App;