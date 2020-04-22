import React from 'react'
import * as bs from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Pic from './media/basketball_icon.png'

function HeaderContainer(props) {

    return (
        <bs.Navbar expand="lg" bg="dark" variant="dark" fixed="top">
            <Link to='/' >
                <bs.Navbar.Brand>
                    <bs.Image  src={Pic} height="50" width="50" alt="Basketball Logo"/>
                    {'  '}Basketball Analytics
                </bs.Navbar.Brand>
            </Link>
            <bs.Navbar.Toggle aria-controls="basic-Navbar-Nav" />
            <bs.Navbar.Collapse id="basic-Navbar-Nav">
                <bs.Nav className="mr-auto">
                    <Link to="/" className="nav-link">Predictor</Link>
                    <Link to="/recommender" className="nav-link">Recommender</Link>
                    <Link to="/about" className="nav-link">About</Link>                
                </bs.Nav>
                <bs.Form inline>
                <bs.FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <bs.Button variant="outline-light">Search</bs.Button>
                </bs.Form>
            </bs.Navbar.Collapse>
        </bs.Navbar>
    )
}

export default HeaderContainer