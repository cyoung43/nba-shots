import React from 'react'
import * as bs from 'react-bootstrap'
import { Link } from 'react-router-dom'
//import AppContext from './context'

function HeaderContainer(props) {
    //const context = React.useContext(AppContext)

    return (
        <bs.Navbar expand="lg">
        <Link to='/'>
            <bs.Navbar.Brand >
                <img className="m-3" src="GoFundMeIcon.svg" height="30" width="30" alt="GoFundMe logo"/>
                GoFundMe Analytics
            </bs.Navbar.Brand>
        </Link>
        
        <bs.Navbar.Toggle aria-controls="basic-Navbar-Nav" />
        <bs.Navbar.Collapse id="basic-Navbar-Nav">
            <bs.Nav className="mr-auto">
                <Link to="/" className="nav-link">Calculator</Link>
                <Link to="/campaign" className="nav-link">Campaigns</Link>
                <Link to="/about" className="nav-link">About</Link>                
            </bs.Nav>
            {/* <bs.Nav>
                <bs.NavDropdown title="Welcome, Richard">
                    <bs.NavDropdown.Item >My Account</bs.NavDropdown.Item>
                    <bs.NavDropdown.Divider />
                </bs.NavDropdown>
            </bs.Nav> */}
            <bs.Form inline>
            <bs.FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <bs.Button variant="outline-success">Search</bs.Button>
            </bs.Form>
        </bs.Navbar.Collapse>
        </bs.Navbar>
    )
}

export default HeaderContainer