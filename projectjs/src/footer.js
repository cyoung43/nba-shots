import React from 'react'
import * as bs from 'react-bootstrap'

function FooterContainer(props) {
    return (
        <bs.Container>
            <bs.Row>
                <bs.Col>
                    <p className="text-center">{'\u00A9'} Go Fund Me Analytics</p>
                </bs.Col>
            </bs.Row>
        </bs.Container>
    )
}

export default FooterContainer