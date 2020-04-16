import React from 'react'
import * as bs from 'react-bootstrap'

function About(props) {
    return (
        <bs.Container>
            <bs.Row>
                <bs.Col>
                    <br />
                    <p className="text-center">About Us</p>
                    <p className="text-center">GoFundMe Analytics is dedicated to making your campaign successful. Use our calculator to see predictions of how your campaign will turn out. Then, based on the result, see how you can improve your campaign to maximize the number of donors and the average amount donated. We want to help you change the world by creating out of this world campaigns for the causes that actually mean something to you!</p>
                </bs.Col>
            </bs.Row>
        </bs.Container>
    )
}

export default About