import React from 'react';
import * as bs from 'react-bootstrap';
//import AppContext from './context'

function Home(props) {
    //const context = React.useContext(AppContext)
    

    return (
        <bs.Container>
            <bs.Row className="no-gutters" style={{paddingTop: '1rem'}}>

            <bs.Container className="text-center">
                
                <h1>Campaigns</h1>
                <hr />
            </bs.Container>
            </bs.Row>

        </bs.Container>
    )
}

export default Home