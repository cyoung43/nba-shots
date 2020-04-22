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
            clearPlayers: this.clearPlayers,
        }
        this.state = {
            // Attributes here
            calcCart: [],
            shot: [{result: 0, type: 'info'}],
            players : [{name: 'Yoeli Childs', ppg: 15, rpg: 8, apg: 4, per: 27.67}],
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

    clearPlayers = () => {        
        this.setState(state => produce(state, draft => {
            draft.players = []            
        }))
    }

    addPlayer = (results) => {
        let newRes = results
        this.setState(state => produce(state, draft => {
            draft.players.push(newRes)
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