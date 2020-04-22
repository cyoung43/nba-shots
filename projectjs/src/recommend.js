import React from 'react'
import * as bs from 'react-bootstrap'
import { Formik, Form, Field} from 'formik'
import AppContext from './context'
import axios from 'axios'


function Predictor(props) {
    let context = React.useContext(AppContext)
    let myError = ''

    return (        
        <Formik
            initialValues={{
                fName: 'Lebron',
                lName: 'James',
            }}
            validateOnChange={false}
            validateOnBlur={false}
            validate={values => {
                const errors = {}

                if (values.fName === '') {
                    errors.fName = 'Please enter a first name'
                }
                if (values.lName === '') {
                    errors.lName = 'Please enter a last name'
                }
                return errors // This is the way
            }}
            onSubmit={async (values, actions) => {
                console.log('submit', values)                

                let data = {
                    Full_Name: values.fName.toLowerCase() + ' ' + values.lName.toLowerCase(),
                }
                
                // Put axios call to API here:
                let calcResp
                try {
                    calcResp = await axios.post(`http://localhost:8000/api/getPlayerRecommendation/`, JSON.stringify(data))

                    context.clearPlayers()

                    let dict = {
                        name: calcResp.data.player1,
                        ppg: (calcResp.data.player1stats.points / calcResp.data.player1stats.games).toFixed(2),
                        rpg: (calcResp.data.player1stats.rebounds / calcResp.data.player1stats.games).toFixed(2),
                        apg: (calcResp.data.player1stats.assists / calcResp.data.player1stats.games).toFixed(2),
                        per: (calcResp.data.player1stats.effeciency / calcResp.data.player1stats.games).toFixed(2),
                    }
                    
                    context.addPlayer(dict)
    
                    let dict2 = {
                        name: calcResp.data.player2,
                        ppg: (calcResp.data.player2stats.points / calcResp.data.player2stats.games).toFixed(2),
                        rpg: (calcResp.data.player2stats.rebounds / calcResp.data.player2stats.games).toFixed(2),
                        apg: (calcResp.data.player2stats.assists / calcResp.data.player2stats.games).toFixed(2),
                        per: (calcResp.data.player2stats.effeciency / calcResp.data.player2stats.games).toFixed(2),
                    }
                    
                    context.addPlayer(dict2)
                    
                    let dict3 = {
                        name: calcResp.data.player3,
                        ppg: (calcResp.data.player3stats.points / calcResp.data.player3stats.games).toFixed(2),
                        rpg: (calcResp.data.player3stats.rebounds / calcResp.data.player3stats.games).toFixed(2),
                        apg: (calcResp.data.player3stats.assists / calcResp.data.player3stats.games).toFixed(2),
                        per: (calcResp.data.player3stats.effeciency / calcResp.data.player3stats.games).toFixed(2),
                    }
                    
                    context.addPlayer(dict3)

                    let dict4 = {
                        name: calcResp.data.player4,
                        ppg: (calcResp.data.player4stats.points / calcResp.data.player4stats.games).toFixed(2),
                        rpg: (calcResp.data.player4stats.rebounds / calcResp.data.player4stats.games).toFixed(2),
                        apg: (calcResp.data.player4stats.assists / calcResp.data.player4stats.games).toFixed(2),
                        per: (calcResp.data.player4stats.effeciency / calcResp.data.player4stats.games).toFixed(2),
                    }
                    
                    context.addPlayer(dict4)
                }
                catch(err) {
                    //console.log(err)
                    myError = 'This player was not found in the 2014-2015 season data'
                }

                

                await new Promise(resolve => {
                    setTimeout(() => {  // wait 2 seconds, then set the form as "not submitting"
                        resolve()
                    }, 2000)
                })
            }}
        >{form => (
            <CalculatorForm form={form} error={myError} results={context.players}/>            
        )}</Formik>        
    )
}
export default Predictor


/**
 * The form layout/html.
 * This component needs finishing.
 */
const CalculatorForm = props => (

    <bs.Container>
        <h1 className="pt-4" style={{display: 'inline-block'}}>
            Player Recommender
        </h1>
        <hr />
        <h6 className="text-danger">{props.error}</h6> 
        <Form>
            <bs.Row className="mb-4">
                <bs.Col md="6">
                    <Input title="First Name:" name="fName" type="text" />
                </bs.Col>
                <bs.Col md="6">
                    <Input title="Last Name:" name="lName" type="text" />
                </bs.Col>
            </bs.Row>
            <bs.Row className="mb-4">
                <bs.Col>
                    <bs.Container className="text-center">
                        <bs.Button className="btn btn-lg btn-primary" type="submit" disabled={props.form.isSubmitting}>
                            {props.form.isSubmitting &&
                                <bs.Spinner as="span" animation="grow" size="lg" role="status" aria-hidden="true" />                     
                            } Find Similar Players
                        </bs.Button>
                    </bs.Container>
                </bs.Col>
            </bs.Row>
            <bs.Row className="mb-4">
                <bs.Col md="3"/>
                <bs.Col md="6" className="text-center">
                    <h1>Results Here</h1>
                    <bs.Table striped bordered hover variant="dark">
                        <thead>
                            <tr style={{color: "#ffc107"}}>
                                <th >
                                    Player
                                </th>
                                <th>PPG</th>
                                <th>RPG</th>
                                <th>APG</th>
                                <th>PER</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.results.map((p) => {
                                return(
                                    <tr key={p.name}>
                                        <td>{p.name}</td>
                                        <td>{p.ppg}</td>
                                        <td>{p.rpg}</td>
                                        <td>{p.apg}</td>
                                        <td>{p.per}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </bs.Table>
                </bs.Col>
                <bs.Col md="3"/>
            </bs.Row>
        </Form>       
    </bs.Container>
)

/**
 * A form input.
 *   props.title - the title that shows above the input box
 *   props.type - the type of input (see React Bootstrap Form.Control)
 *   props.placeholder - placeholder text in the input.
 * This component is finished and doesn't need additional work.
 */
const Input = (props) => (
    <Field name={props.name}>{rProps => (
        <bs.Form.Group>
            {props.title &&
                <bs.Form.Label>{props.title}</bs.Form.Label>
            }
            <bs.Form.Control
                type={props.type}
                placeholder={props.placeholder}
                disabled={rProps.form.isSubmitting}
                value={props.value}
                {...rProps.field}
            />
            {rProps.meta.touched && rProps.meta.error &&
                <div className="text-danger">{rProps.meta.error}</div>
            }
        </bs.Form.Group>
    )}</Field>
)