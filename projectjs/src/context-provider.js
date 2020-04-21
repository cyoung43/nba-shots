import React from 'react'
import axios from 'axios'
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
            filterCamps: this.filterCamps,
            loginUser: this.loginUser,
            addResult: this.addResult,
            storePath: this.storePath,
        }
        this.state = {
            // Attributes here
            showcampaigns: [],
            campaigns: [],
            nocorona_campaigns: [],
            calcCart: [],
            activeFilters: [],
            login: ['admin', 'admin', false],
            result: [{expectAvgDonation: "0", expectedDonors: "0"}],
            path: "/",
            recommendation1: '',
        }
        // Do not load data (the categories) here or else it would freeze the system
    }
    // Put Methods here


    storePath = (newPath) => {
        this.setState(state => produce(state, draft => {
            draft.path = newPath
        }))
    }

    addResult = (results) => {
        let newRes = results
        this.setState(state => produce(state, draft => {
            draft.result.shift()            
            draft.result.unshift(newRes)
            draft.recommendation1 = 'If you are not satisfied with your predictions, try: 1) Changing number of reshares, 2) Changing expected campaign days or, 3) adjust your campaign description to be more relavant, if possible.'
        }))
    }

    loginUser = (token) => {
        if(token.username === 'admin' && token.password === 'admin') {
            this.setState(state => produce(state, draft => {
                draft.login[2] = true
            }))
        }
        else {
            return ('Incorrect Username or Password')
        }
        
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
        const resp = await axios.get('http://gofundmeanalytics.com:8000/api/campaign/')
        //console.log(resp.data)
        let smallresp = []
        // for(let i=0; i<10; i++) {
        //     smallresp.push(resp.data[i])
        // }
        for (const c of resp.data) {
            smallresp.push(c)
        }

        const resp2 = await axios.get('http://gofundmeanalytics.com:8000/api/nocorona_campaign/')
        let smallresp2 = []
        for (const c of resp2.data) {
            smallresp2.push(c)
        }

        this.setState({
            
            // Set attributes here
            campaigns: smallresp,
            nocorona_campaigns: smallresp2,
            showcampaigns: smallresp,
        })
    }

}