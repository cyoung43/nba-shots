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
            addShot: this.addShot,
            addPlayer: this.addPlayer,
        }
        this.state = {
            // Attributes here
            calcCart: [],
            shot: [{result: 75.35, type: 'info'}],
            players : [{name: 'Kevin Durant', ppg: 15, rpg: 8, apg: 4, other: '???'}, {name: 'Steph Curry', ppg: 25, rpg: 6, apg: 8, other: '???'}, {name: 'Donovan Mitchell', ppg: 30, rpg: 15, apg: 15, other: '???'}],
        }
        // Do not load data (the categories) here or else it would freeze the system
    }
    // Put Methods here

    addShot = (results) => {
        let newRes = results
        this.setState(state => produce(state, draft => {
            draft.shot.shift()            
            draft.shot.unshift(newRes)
        }))
    }

    addPlayer = (results) => {
        let newRes = results
        this.setState(state => produce(state, draft => {
            draft.players.shift()            
            draft.players.unshift(newRes)
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