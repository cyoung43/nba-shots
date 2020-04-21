import React from 'react'
import * as bs from 'react-bootstrap'
import Pic from './media/Basketball_3.jpg'

function HeaderContainer(props) {   

    return (        
        <bs.Jumbotron fluid style={{backgroundImage: `url(${Pic})`, backgroundSize: 'cover', backgroundPosition: 'center', marginTop: "76px", paddingTop: '175px', paddingBottom: '200px'}}>
            <bs.Row>
                <bs.Col md='1' />
                <bs.Col md='3'>
                    <bs.Container>
                        <h1 style={{color: '#ffc107', fontSize: '100px'}}>Shot Predictor</h1>
                    </bs.Container>
                </bs.Col>
                <bs.Col md='8' />
            </bs.Row>            
        </bs.Jumbotron>                   
    )
}

export default HeaderContainer