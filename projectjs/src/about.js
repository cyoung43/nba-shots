import React from 'react'
import * as bs from 'react-bootstrap'

function About(props) {
    return (
        <bs.Container>
            <bs.Row>
                <bs.Col>
                    <bs.Card.Body>
                        <bs.Card.Title className='text-center mt-3' style={{fontSize: '32pt'}}>
                            About Us
                        </bs.Card.Title>
                        <hr />
                        <bs.Card.Text className='text-center mb-3' style={{fontSize: '20pt'}}>
                            Have you ever wondered what it is like to shoot in a real NBA game? Well we will simulate that experience for you!
                            Just enter the given information and we will tell you how likely you are to make a shot! With the time running down
                            in the fourth quarter will you make the game winning shot? Let's find out!
                        </bs.Card.Text>
                    </bs.Card.Body>
                </bs.Col>
            </bs.Row>
        </bs.Container>
    )
}

export default About