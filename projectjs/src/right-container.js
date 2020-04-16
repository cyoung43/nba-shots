import React from 'react'
import * as bs from 'react-bootstrap'
import AppContext from './context'
import './App.scss'

function RightContainer(props) {
    let context = React.useContext(AppContext)

    return (
        <bs.Container className="text-center">
            <br />
            <h3>Recently Calculated Campaigns</h3>
            <hr />
            {context.calcCart.map((obj, idx) => {
                let postVar = ''

                if(obj.autoPost === '1') {
                    postVar = 'Yes'
                }
                if(obj.autoPost === '0') {
                    postVar = 'No'
                }
                
                return(
                    <bs.Card key={idx}>
                        <bs.Card.Header>
                            <h6>{obj.title}</h6>
                        </bs.Card.Header>
                        <bs.Card.Body>
                            <bs.Tabs variant="pills">
                                <bs.Tab eventKey={1} title="Details">
                                    <Details len={obj.expectedLength} country={obj.country}/>
                                </bs.Tab>
                                <bs.Tab eventKey={2} title="Description">
                                    <Description desc={obj.description}/>
                                </bs.Tab> 
                                <bs.Tab eventKey={3} title="Financial">
                                    <Money cur={obj.currCode} target={obj.targetAmount}/>
                                </bs.Tab>  
                                <bs.Tab eventKey={4} title="Social">
                                    <Social share={obj.expectedReshares} post={postVar}/>
                                </bs.Tab>
                                <bs.Tab eventKey={5} title="Results">
                                    <Results avgDonation={obj.expectAvgDonation} cur={obj.currCode} expDonors={obj.expectedDonors}/>
                                </bs.Tab>                               
                            </bs.Tabs>
                        </bs.Card.Body>                               
                    </bs.Card>
                )
            })}
            
        </bs.Container>
    )
}

export default RightContainer


const Details = (props) => (        
        <bs.ListGroup variant="flush">
            <bs.ListGroup.Item>
                <bs.Card.Subtitle>Campaign Length</bs.Card.Subtitle>
                {props.len} Days
            </bs.ListGroup.Item>
            <bs.ListGroup.Item>
                <bs.Card.Subtitle>Country</bs.Card.Subtitle>
                {props.country}
            </bs.ListGroup.Item>        
        </bs.ListGroup>       
)

const Description = (props) => (        
        <bs.Container>
            Here is some stuff
        </bs.Container>
)

const Money = (props) => (   
        <bs.ListGroup variant="flush">
            <bs.ListGroup.Item>
                <bs.Card.Subtitle>Target</bs.Card.Subtitle>
                {props.target}
            </bs.ListGroup.Item>
            <bs.ListGroup.Item>
                <bs.Card.Subtitle>Currecy Type</bs.Card.Subtitle>
                {props.cur}
            </bs.ListGroup.Item>       
        </bs.ListGroup>
)

const Social = (props) => (        
        <bs.ListGroup variant="flush">
            <bs.ListGroup.Item>
                <bs.Card.Subtitle>Expected Shares</bs.Card.Subtitle>
                {props.share} Shares
            </bs.ListGroup.Item>            
            <bs.ListGroup.Item>
                <bs.Card.Subtitle>Auto Post</bs.Card.Subtitle>
                {props.post}
            </bs.ListGroup.Item>                    
        </bs.ListGroup>
)

const Results = (props) => (            
    <bs.ListGroup variant="flush">
        <bs.ListGroup.Item>
            <bs.Card.Subtitle>Predicted Average Donation</bs.Card.Subtitle>
            {parseFloat(props.avgDonation).toFixed(2)} {props.cur}
        </bs.ListGroup.Item>            
        <bs.ListGroup.Item>
            <bs.Card.Subtitle>Predicted Number of Donors</bs.Card.Subtitle>
            {props.expDonors}
        </bs.ListGroup.Item>
        <bs.ListGroup.Item>
            <bs.Card.Subtitle>Predicted Total Revenue</bs.Card.Subtitle>
            {(parseFloat(props.avgDonation).toFixed(2) * props.expDonors)} {props.cur}
        </bs.ListGroup.Item>                    
    </bs.ListGroup>
)