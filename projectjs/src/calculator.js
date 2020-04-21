import React from 'react'
import * as bs from 'react-bootstrap'
import { Formik, Form, Field} from 'formik'
import AppContext from './context'
import axios from 'axios'


function CalculatorController(props) {
    let context = React.useContext(AppContext)
    let myError = ''

    return (        
        <Formik
            initialValues={{
                title: 'Donate Money to Find Covid-19 Cure Today!!',
                description: 'My name is Gary Anderson and one of my best friends, Dr. Brewmaster Wells, recently informed me that a vaccine for the coronavirus still has not been found. This is really concerning because the first diagnosis was several months ago now. There are so many people in the world with it now and we desparately need help to raise the right type of support for this. I know that with your help we can make this work! Please help us achieve this goal. When we work together we can overcome everything.',
                expectedLength: 25,
                expectedReshares: 37,
                currCode: 'USD',
                autoPost: '1',
                targetAmount: 3000,
                country: 'US',
                type: 'corona'
            }}
            validateOnChange={false}
            validateOnBlur={false}
            validate={values => {
                const errors = {}

                if (values.title === '') {
                    errors.title = 'Please enter valid title'
                }
                if (values.description === '') {
                    errors.description = 'Please enter valid description'
                }

                if (values.expectedLength === '') {
                    errors.expectedLength = 'Please enter valid number'
                }
                if (values.expectedReshares === '') {
                    errors.expectedReshares = 'Please enter valid number'
                }
                if (values.currCode === '') {
                    errors.currCode = 'Please select a currency'
                }
                if (values.autoPost === '') {
                    errors.autoPost = 'Please select yes or no'
                }
                if (values.targetAmount === '') {
                    errors.targetAmount = 'Please enter valid number'
                }
                if (values.country === '') {
                    errors.country = 'Please select a country'
                }
                return errors // This is the way
            }}
            onSubmit={async (values, actions) => {
                //console.log('submit', values)                

                let dict = {
                    auto_fb_post_mode: values.autoPost,
                    currencycode: values.currCode,
                    goal: values.targetAmount.toString(),
                    days_active: values.expectedLength.toString(),
                    title: values.title,
                    description: values.description,
                    social_share_total: values.expectedReshares.toString(),
                    location_country: values.country,
                }

                // Put axios call to API here:
                let calcResp1
                let calcResp2
                try {
                    calcResp1 = await axios.post(`http://gofundmeanalytics.com:8000/api/expected_donation_${values.type}/`, JSON.stringify(dict))
                }
                catch(err) {
                    console.log(err)
                }

                //console.log('RESPONSE 1:', calcResp1.data)

                let dict2 = {
                    auto_fb_post_mode: values.autoPost,
                    currencycode: values.currCode,
                    goal: values.targetAmount.toString(),
                    days_active: values.expectedLength.toString(),
                    title: values.title,
                    description: values.description,
                    social_share_total: values.expectedReshares.toString(),
                    location_country: values.country,
                    expected_avg_donation: calcResp1.data.result,
                }

                try {
                    calcResp2 = await axios.post(`http://gofundmeanalytics.com:8000/api/expected_donors_${values.type}/`, JSON.stringify(dict2))
                }
                catch(err) {
                    console.log(err)
                }
                
                
                //console.log('RESPONSE 2:', calcResp2.data)

                let dict3 = {  
                    title: values.title,
                    description: values.description,
                    expectedLength: values.expectedLength.toString(),
                    expectedReshares: values.expectedReshares.toString(),
                    currCode: values.currCode,
                    autoPost: values.autoPost,
                    targetAmount: values.targetAmount.toString(),
                    country: values.country,
                    expectAvgDonation: calcResp2.data.result.expected_donation,
                    expectedDonors: calcResp2.data.result.expected_donors,
                }

                //console.log('Final Resp: ', dict3)
                context.calcCartAdd(dict3)
                context.addResult(dict3)
                // Look for errors in the return values   

                await new Promise(resolve => {
                    setTimeout(() => {  // wait 2 seconds, then set the form as "not submitting"
                        resolve()
                    }, 2000)
                })
            }}
        >{form => (
            <CalculatorForm form={form} error={myError} results={context.result} text1={context.recommendation1}/>            
        )}</Formik>        
    )
}
export default CalculatorController


/**
 * The form layout/html.
 * This component needs finishing.
 */
const CalculatorForm = props => (
    
    <bs.Container>
        <h1 className="pt-4" style={{display: 'inline-block'}}>
            Campaign Success Calculator
        </h1>
        <hr />
        <h6 className="text-danger">{props.error}</h6> 
        <Form>
            <bs.Row>
                <bs.Col md="6">
                    <bs.Card>
                        <bs.Card.Header>
                            <h3 >Details</h3>
                        </bs.Card.Header>
                        <bs.Card.Body>
                            <Input title="Title:" name="title" type="text" />
                            <InputText title="Description:" name="description" type="textarea" rows="10" />
                            <Input title="Expected Length of Campaign in Days:" name="expectedLength" type="number" />
                            <InputDrop title="Country:" name="country" val0="" lab0="Select a Country" type="select"
                                val1="US" lab1="United States" val2="IT" lab2="Italy" val3="DE" lab3="Germany"
                                val4="GB" lab4="United Kingdom" val5="CA" lab5="Canada" val6="NL" lab6="Netherlands"
                                val7="ES" lab7="Spain" val8="BE" lab8="Belgium" val9="AU" lab9="Australia" val10="FR" lab10="France"
                            />
                        </bs.Card.Body>
                    </bs.Card>
                </bs.Col>
                <bs.Col md="6">
                    <bs.Card>
                        <bs.Card.Header>
                            <h3>Social</h3>
                        </bs.Card.Header>
                        <bs.Card.Body>
                            <Input title="Number of Expected Reshares:" name="expectedReshares" type="number" />
                            <InputYN title="Auto Post Updates on Facebook:" name="autoPost" type="select" val0="" lab0="Yes or No?"
                                val1="1" val2="0" lab1="Yes" lab2="No" 
                            />
                            <InputYN title='Type of Campaign' name='type' type='select' val0="corona" lab0='COVID-19 Related'
                                val1='regular' lab1='Other' val2='' lab2=''
                            />
                        </bs.Card.Body>
                    </bs.Card>
                    <br />
                    <bs.Card>
                        <bs.Card.Header>
                            <h3>Financial</h3>
                        </bs.Card.Header>
                        <bs.Card.Body>
                            <InputDrop title="Type of Currency:" name="currCode" val0="" lab0="Select a Currency" type="select"
                                val1="USD" lab1="US Dollar" val2="EUR" lab2="Euro" val3="GBP" lab3="British Pound"
                                val4="CAD" lab4="Canadian Dollar" val5="AUD" lab5="Australian Dollar" val6="SEK" lab6="Swedish Krona"
                                val7="CHF" lab7="Swiss Franc" val8="NOK" lab8="Norwegian Krone" val9="DKK" lab9="Danish Krone" val10="" lab10=""
                            />
                            <Input title="Target Amount:" name="targetAmount" type="number" />                            
                        </bs.Card.Body>
                    </bs.Card>
                    <br />
                    <bs.Container className="text-center">
                        <bs.Button className="btn btn-lg btn-primary" type="submit" disabled={props.form.isSubmitting}>
                            {props.form.isSubmitting &&
                                <bs.Spinner as="span" animation="grow" size="lg" role="status" aria-hidden="true" />                     
                            } Calculate
                        </bs.Button>
                    </bs.Container>                 
                </bs.Col>
            </bs.Row>
            <br />
            <bs.Row>
                <bs.Col>            
                    <bs.Card md="12">
                        <bs.Card.Header>
                            <bs.Container className="text-center">
                                <h3>Results</h3>
                            </bs.Container>
                        </bs.Card.Header>
                        <bs.Card.Body>
                            <bs.Container>                              
                                <bs.Row >
                                    <bs.Col>
                                        <br />
                                        <h5>Predicted Average Donation</h5>
                                        <p>{parseFloat(props.results[0].expectAvgDonation).toFixed(2)} {props.results[0].currCode}</p>
                                        <h5>Predicted Number of Donors</h5>
                                        <p>{props.results[0].expectedDonors}</p>
                                        <h5>Predicted Campaign Total</h5>
                                        <p>{(parseFloat(props.results[0].expectAvgDonation).toFixed(2) * props.results[0].expectedDonors)} {props.results[0].currCode}</p>
                                    </bs.Col>                                
                                    <bs.Col>
                                        <bs.Jumbotron>
                                            <h5>Recommendations</h5>
                                            {props.text1}
                                        </bs.Jumbotron>
                                    </bs.Col>
                                </bs.Row>
                            </bs.Container> 
                        </bs.Card.Body>
                    </bs.Card>
                </bs.Col>
            </bs.Row>                
            <br />
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
                {...rProps.field}
            />
            {rProps.meta.touched && rProps.meta.error &&
                <div className="text-danger">{rProps.meta.error}</div>
            }
        </bs.Form.Group>
    )}</Field>
)

const InputYN = (props) => (
    <Field name={props.name}>{rProps => (
        <bs.Form.Group>
            {props.title &&
                <bs.Form.Label>{props.title}</bs.Form.Label>
            }        
            <br />
            <bs.Form.Control as={props.type}
                placeholder={props.placeholder}
                disabled={rProps.form.isSubmitting}
                {...rProps.field}
            >
                <option value={props.val0} label={props.lab0}/>
                <option value={props.val1} label={props.lab1}/>
                <option value={props.val2} label={props.lab2}/>
            </bs.Form.Control>
            {rProps.meta.touched && rProps.meta.error &&
                <div className="text-danger">{rProps.meta.error}</div>
            }
        </bs.Form.Group>
    )}</Field>
)

const InputText = (props) => (
    <Field name={props.name}>{rProps => (
        <bs.Form.Group>
            {props.title &&
                <bs.Form.Label>{props.title}</bs.Form.Label>
            }
            <br />
            <bs.Form.Control as={props.type}
                placeholder={props.placeholder}
                disabled={rProps.form.isSubmitting}
                rows={props.rows}
                {...rProps.field}
            />
            {rProps.meta.touched && rProps.meta.error &&
                <div className="text-danger">{rProps.meta.error}</div>
            }
        </bs.Form.Group>
    )}</Field>
)

const InputDrop = (props) => (
    <Field name={props.name}>{rProps => (
        <bs.Form.Group>
            {props.title &&
                <bs.Form.Label>{props.title}</bs.Form.Label>
            }
            <br />
            <bs.Form.Control as={props.type}
                placeholder={props.placeholder}
                disabled={rProps.form.isSubmitting}
                {...rProps.field}
            >
                <option value={props.val0} label={props.lab0}/>
                <option value={props.val1} label={props.lab1}/>
                <option value={props.val2} label={props.lab2}/>
                <option value={props.val3} label={props.lab3}/>
                <option value={props.val4} label={props.lab4}/>
                <option value={props.val5} label={props.lab5}/>
                <option value={props.val6} label={props.lab6}/>
                <option value={props.val7} label={props.lab7}/>
                <option value={props.val8} label={props.lab8}/>
                <option value={props.val9} label={props.lab9}/>
                <option value={props.val10} label={props.lab10}/>
            </bs.Form.Control>
            {rProps.meta.touched && rProps.meta.error &&
                <div className="text-danger">{rProps.meta.error}</div>
            }
        </bs.Form.Group>
    )}</Field>
)