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
                player_first: 'Yoeli',
                player_last: 'Childs',
                location: 'H',
                shot_number: 7,
                period: '4',
                shot_clock: 8.7,
                dribbles: 4,
                shot_distance: 20.9,
                pts_type: '2',
                close_def_dist: 1.8,
                minutes: 9,
                seconds: 46,
                fg: 78.1,
                experience: '5',
            }}
            validateOnChange={false}
            validateOnBlur={false}
            validate={values => {
                const errors = {}

                if (values.player_first === '') {
                    errors.player_first = 'Please enter a First Name'
                }
                if (values.player_last === '') {
                    errors.player_last = 'Please enter a Last Name'
                }
                if (values.location === '') {
                    errors.location = 'Please enter Home or Away'
                }
                if (values.shot_number === '') {
                    errors.shot_number = 'Please enter a valid shot number'
                }
                if (values.period === '') {
                    errors.period = 'Please choose quarter'
                }
                if (values.shot_clock === '') {
                    errors.shot_clock = 'Please enter valid number 0 to 24'
                }
                if (values.dribbles === '') {
                    errors.dribbles = 'Please enter a valid number'
                }
                if (values.pts_type === '') {
                    errors.pts_type = 'Please select 2 or 3'
                }
                if (values.close_def_dist === '') {
                    errors.close_def_dist = 'Please enter distance'
                }
                if (values.minutes === '') {
                    errors.minutes = 'Please enter valid number 0 to 12'
                }
                if (values.seconds === '') {
                    errors.seconds = 'Please enter valid number 0 to 59'
                }
                if (values.fg === '') {
                    errors.fg = 'Please enter proper fg% 0 to 100'
                }
                if (values.experience === '') {
                    errors.experience = 'Please enter valid experience R to 20'
                }
                return errors // This is the way
            }}
            onSubmit={async (values, actions) => {
                //console.log('submit', values)             

                if (values.shot_distance > 23.75) {
                    values.pts_type = '3'
                }

                let dict = {
                    player_first: values.player_first,
                    player_last: values.player_last,
                    location: values.location,
                    shot_number: values.shot_number,
                    period: values.period,                    
                    shot_clock: parseFloat(values.shot_clock),
                    dribbles: values.dribbles,
                    shot_distance: parseFloat(values.shot_distance),
                    pts_type: values.pts_type,
                    close_def_dist: parseFloat(values.close_def_dist),
                    game_clock: ((values.minutes * 60) + values.seconds),
                    fg: parseFloat(values.fg),
                    experience: values.experience,
                }

                // console.log(dict)
                // console.log('player_first ', dict.player_first, typeof dict.player_first)
                // console.log('player_last ', dict.player_last, typeof dict.player_last)
                // console.log('location ', dict.location, typeof dict.location)
                // console.log('shot_number ', dict.shot_number, typeof dict.shot_number)
                // console.log('period ', dict.period, typeof dict.period)
                // console.log('shot_clock ', dict.shot_clock, typeof dict.shot_clock)
                // console.log('shot_distance ', dict.shot_distance, typeof dict.shot_distance)
                // console.log('pts_type ', dict.pts_type, typeof dict.pts_type)
                // console.log('close_def_dist ', dict.close_def_dist, typeof dict.close_def_dist)
                // console.log('game_clock ', dict.game_clock, typeof dict.game_clock)
                // console.log('fg ', dict.fg, typeof dict.fg)
                // console.log('experience ', dict.experience, typeof dict.experience)


                // Put axios call to API here:
                let calcResp
                try {
                    calcResp = await axios.post(`http://localhost:8000/api/getShotPrediction/`, JSON.stringify(dict))
                }
                catch(err) {
                    console.log(err)
                }
                
                console.log('RESPONSE 1:', calcResp.data)
                let results = ''
                if (calcResp.data.result > 0.5) {
                    results = 'success'
                }
                else {
                    results = 'danger'
                }

                let dict2 = {
                    result: calcResp.data.result,
                    type: results
                }
                //console.log(dict2)
                context.addShot(dict2)

                await new Promise(resolve => {
                    setTimeout(() => {  // wait 2 seconds, then set the form as "not submitting"
                        resolve()
                    }, 2000)
                })
            }}
        >{form => (
            <CalculatorForm form={form} error={myError} results={context.shot}/>            
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
            Shot Predictor
        </h1>
        <hr />
        <h6 className="text-danger">{props.error}</h6> 
        <Form>
            <bs.Row className="mb-4">
                <bs.Col md="6">
                    <bs.Row>
                        <bs.Col>
                            <Input title="Player First Name:" name="player_first" type="text" />
                        </bs.Col>
                        <bs.Col>
                            <Input title="Player Last Name:" name="player_last" type="text" />
                        </bs.Col>
                    </bs.Row>
                    <InputYN title="Home or Away:" name="location" type="select" val0="" lab0="Select One"
                        val1="H" val2="A" lab1="Home" lab2="Away" 
                    />
                    <InputQuarter title="Quarter:" name="period" type="select" val0="" lab0="Select Quarter"
                        val1="1" val2="2" val3="3" val4="4" lab1="1st" lab2="2nd" lab3="3rd" lab4="4th"
                    />
                    <bs.Row>
                        <bs.Col>
                            <Input title="Minutes:" name="minutes" type="number" min="0" max="11" step="1"/>
                        </bs.Col>
                        <bs.Col>
                            <Input title="Seconds:" name="seconds" type="number" min="0" max="59" step="1"/>
                        </bs.Col>
                    </bs.Row>
                    <Input title="Time Left on Shot Clock:" name="shot_clock" type="number" min="0.1" max="24.0" step="0.1"/>                    
                </bs.Col>
                <bs.Col md="6">
                    <InputDrop title="Years in the NBA:" name="experience" type="select" val0="" lab0="Select Year" 
                        val1="R" lab1="Rookie" val2="2" lab2="2" val3="3" lab3="3" val4="4" lab4="4" val5="5" lab5="5" val6="6" lab6="6"
                        val7="7" lab7="7" val8="8" lab8="8" val9="9" lab9="9" val10="10" lab10="10"
                        val11="11" lab11="11" val12="12" lab12="12" val13="13" lab13="13" val14="14" lab14="14" val15="15" lab15="15" val16="16" lab16="16"
                        val17="17" lab17="17" val18="18" lab18="18" val19="19" lab19="19" val20="20" lab20="20+"
                    />                    
                    <bs.Row>
                        <bs.Col>
                            <Input title="Shot Number:" name="shot_number" type="number" />
                        </bs.Col>    
                        <bs.Col>
                            <Input title="Dribbles Before Shot:" name="dribbles" type="number" />
                        </bs.Col>
                    </bs.Row>
                    <Input title="Shot Distance (feet):" name="shot_distance" type="number" min="0" max="94" step="0.1" />
                    <Input name="pts_type" type="hidden" value='2'/>
                    <Input title="Player Field Goal Percentage:" name="fg" type="number" min="0" max="100" step="0.1"/>
                    <Input title="Distance to Closest Defender (feet):" name="close_def_dist" type="number" min="0" max="94" step="0.1" />                    
                </bs.Col>
            </bs.Row>
            <bs.Row className="mb-4">
                <bs.Col>
                    <bs.Container className="text-center">
                        <bs.Button className="btn btn-lg btn-primary" type="submit" disabled={props.form.isSubmitting}>
                            {props.form.isSubmitting &&
                                <bs.Spinner as="span" animation="grow" size="lg" role="status" aria-hidden="true" />                     
                            } Predict Shot
                        </bs.Button>
                    </bs.Container>
                </bs.Col>
            </bs.Row>
            <bs.Row className="mb-4">
                <bs.Col className="text-center">
                    {props.results.map((p) => {
                        if (p.type === 'success') {                            
                            return(
                                <bs.Alert variant="success" key={p.result}>
                                    <bs.Alert.Heading>Buckets! It went in!</bs.Alert.Heading>
                                    <p className="mb-1">The player that you have described taking this shot is probably going to make it!</p> 
                                    <p>Now try and mix up the stats to see if you can improve your percentage!</p>
                                    <hr />
                                    <p>This shot has a <strong>{(p.result * 100).toFixed(2)}%</strong> chance to be a make!</p>
                                </bs.Alert>
                            )
                        }
                        if (p.type === 'danger') {
                            return(
                                <bs.Alert variant="danger" key={p.result}>
                                    <bs.Alert.Heading>Brick! This shot missed...</bs.Alert.Heading>
                                    <p className="mb-1">This is a really tough shot and it will probably be a miss. But dont give up!</p>
                                    <p>Change up the situation and the stats and maybe you can find the right combination!</p>
                                    <hr />
                                    <p>This shot only has a <strong>{(p.result * 100).toFixed(2)}%</strong> chance to be a make.</p>
                                </bs.Alert>
                            )
                        }
                        
                        return(
                            <bs.Alert variant="info" key={p.result}>
                                <bs.Alert.Heading>Enter the Info Above to View Results</bs.Alert.Heading>
                                <p className="mb-1">We will display your results here!</p> 
                                <hr />
                                <p>This shot has a <strong>{(p.result * 100).toFixed(2)}%</strong> chance to be a make!</p>
                            </bs.Alert>
                        )
                    })}
                </bs.Col>
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
                min={props.min}
                max={props.max}
                step={props.step}
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

const InputQuarter = (props) => (
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
            </bs.Form.Control>
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
                <option value={props.val11} label={props.lab11}/>
                <option value={props.val12} label={props.lab12}/>
                <option value={props.val13} label={props.lab13}/>
                <option value={props.val14} label={props.lab14}/>
                <option value={props.val15} label={props.lab15}/>
                <option value={props.val16} label={props.lab16}/>
                <option value={props.val17} label={props.lab17}/>
                <option value={props.val18} label={props.lab18}/>
                <option value={props.val19} label={props.lab19}/>
                <option value={props.val20} label={props.lab20}/>
                
            </bs.Form.Control>
            {rProps.meta.touched && rProps.meta.error &&
                <div className="text-danger">{rProps.meta.error}</div>
            }
        </bs.Form.Group>
    )}</Field>
)