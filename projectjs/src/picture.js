import React from 'react'
import * as bs from 'react-bootstrap'
import Pic from './media/Basketball_3.jpg'

function HeaderContainer(props) {   

    return (
        <bs.Jumbotron style={{backgroundImage: `url(${Pic})`, backgroundSize: 'auto', backgroundPosition: 'center', color: 'white'}}>            
            <br />
            <h1>Shot Predictor</h1>
            <br />         
        </bs.Jumbotron>
    )
}

export default HeaderContainer