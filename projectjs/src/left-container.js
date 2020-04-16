import React from 'react'
import * as bs from 'react-bootstrap'
import AppContext from './context'


function LeftContainer(props) {
    const context = React.useContext(AppContext)

    return (
        // I'm thinking we should make this a form where you can give inputs for how to filter parameters
        <bs.Container>

            <h3 className='pt-2'>Filters</h3>

            <hr />
            <bs.Nav className="flex-column" onSelect={(selectedKey) => context.filterCamps(selectedKey)}>                
                
                <h5>Data</h5>
            
                <bs.NavDropdown title="Type of Data">
                    <bs.NavDropdown.Item eventKey={[8,1]}>Coronavirus Only</bs.NavDropdown.Item>
                    <bs.NavDropdown.Item eventKey={[8,2]}>Non Coronavirus Only</bs.NavDropdown.Item>
                    <bs.NavDropdown.Divider />
                    <bs.NavDropdown.Item eventKey={[8,3]}>All Data</bs.NavDropdown.Item>
                </bs.NavDropdown>
                
                <h5>Order</h5>

                <NavDropDown title="Average Donation" key1={[1,1]} key2={[1,2]} />
            
                <NavDropDown title="Progress to Goal" key1={[2,1]} key2={[2,2]} />
            
                <NavDropDown title="Number of Donors" key1={[3,1]} key2={[3,2]} />
            
                <NavDropDown title="Donations per Day" key1={[4,1]} key2={[4,2]} />
            
                <NavDropDown title="Days Active" key1={[5,1]} key2={[5,2]} />
            
                <NavDropDown title="Number of Hearts" key1={[6,1]} key2={[6,2]} />
            
                <NavDropDown title="Number of Reshares" key1={[7,1]} key2={[7,2]} />

                <bs.Nav.Link eventKey="reset" className="btn btn-sm btn-outline-primary flex">
                    Reset Filters
                </bs.Nav.Link>                                   
            </bs.Nav>
            <hr />
            <h5>Active Filters</h5>
            {context.activeFilters.map((obj, idx) => {
                return(
                    <li key={idx}>{obj}</li>
                )
            })}
        </bs.Container>
    )
}

export default LeftContainer

const NavDropDown = (props) => {
    return(
        <bs.NavDropdown title={props.title}>
            <bs.NavDropdown.Item eventKey={props.key1}>High to Low</bs.NavDropdown.Item>
            <bs.NavDropdown.Divider />
            <bs.NavDropdown.Item eventKey={props.key2}>Low to High</bs.NavDropdown.Item>            
        </bs.NavDropdown>
    )
}