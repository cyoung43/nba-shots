import React from 'react'
import * as bs from 'react-bootstrap'
import { Link } from 'react-router-dom'

function HeaderContainer(props) {

    return (
        <bs.Navbar expand="lg" bg="dark">
            <Link to='/'>
                <bs.Navbar.Brand style={{color: 'white'}}>
                    <img className="m-3" src="Basketball_icon.png" height="30" width="30" alt="GoFundMe logo"/>
                    Basketball Analytics
                </bs.Navbar.Brand>
            </Link>
            <bs.Navbar.Toggle aria-controls="basic-Navbar-Nav" />
            <bs.Navbar.Collapse id="basic-Navbar-Nav">
                <bs.Nav className="mr-auto">
                    <Link to="/" className="nav-link" style={{color: 'white'}}>Calculator</Link>
                    <Link to="/campaign" className="nav-link" style={{color: 'white'}}>Campaigns</Link>
                    <Link to="/about" className="nav-link" style={{color: 'white'}}>About</Link>                
                </bs.Nav>
                <bs.Form inline>
                <bs.FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <bs.Button variant="outline-primary">Search</bs.Button>
                </bs.Form>
            </bs.Navbar.Collapse>
        </bs.Navbar>
    )
}

export default HeaderContainer