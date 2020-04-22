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

                let dict = {
                    Full_Name: values.fName.toLowerCase() + ' ' + values.lName.toLowerCase(),
                }
                
                // Put axios call to API here:
                let calcResp
                try {
                    calcResp = await axios.post(`http://localhost:8000/api/getPlayerRecommendation/`, JSON.stringify(dict))
                }
                catch(err) {
                    console.log(err)
                }
                //console.log('RESPONSE 1:', calcResp.data)
                
                context.addPlayer(calcResp)

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
                                <th>Other</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.results.map((p) => {
                                return(
                                    <tr>
                                        <td>{p.name}</td>
                                        <td>{p.ppg}</td>
                                        <td>{p.rpg}</td>
                                        <td>{p.apg}</td>
                                        <td>{p.other}</td>
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