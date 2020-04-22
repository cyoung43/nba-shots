import React from 'react'
//import axios from 'axios'
import AppContext from './context'
import App from './App'
import produce from 'immer'

/** The context provider for our app */
export default class AppProvider extends React.Component {

    constructor(props) {
        super(props)
        this.actions = {
            // Functions Here
            calcCartAdd: this.calcCartAdd,
            addResult: this.addResult,
        }
        this.state = {
            // Attributes here
            calcCart: [],
            result: [],
        }
        // Do not load data (the categories) here or else it would freeze the system
    }
    // Put Methods here

    addResult = (results) => {
        let newRes = results
        this.setState(state => produce(state, draft => {
            draft.result.shift()            
            draft.result.unshift(newRes)
        }))
    }

    calcCartAdd = (search) => {
        this.setState(state => produce(state, draft => {
            if (draft.calcCart.length >= 3) {
                draft.calcCart.shift()
            }
            draft.calcCart.unshift(search)
        }))
    }
  
    render() {
        return (
            <AppContext.Provider value={{...this.state, ...this.actions}}> 
                <App />
            </AppContext.Provider>
        )
    }

    async componentDidMount() {
        
        // Axios calls here

        this.setState({            
            // Set attributes here
        })
    }

}