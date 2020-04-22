import React from 'react'
import * as bs from 'react-bootstrap'
import Pic from './media/Basketball_3.jpg'
import { useRouteMatch } from 'react-router-dom'

function HeaderContainer(props) {
    let match = useRouteMatch('/:page')
    let text = ''
    //console.log(match)

    if (match === null) {
        text = 'Shot Predictor'
    }
    else if (match.params.page === 'recommender') {
        text = 'Similar Players'
    }
    else {
        text = 'Shot Predictor'
    }    

    return (        
        <bs.Jumbotron fluid style={{backgroundImage: `url(${Pic})`, backgroundSize: 'cover', backgroundPosition: 'center', marginTop: "76px", paddingTop: '175px', paddingBottom: '200px'}}>
            <bs.Row>
                <bs.Col md='1' />
                <bs.Col md='3'>
                    <bs.Container>
                        <h1 style={{color: '#ffc107', fontSize: '100px'}}>{text}</h1>
                    </bs.Container>
                </bs.Col>
                <bs.Col md='8' />
            </bs.Row>            
        </bs.Jumbotron>                   
    )
}

export default HeaderContainer