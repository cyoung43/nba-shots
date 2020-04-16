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

    filterCamps = (code) => {
        this.setState(state => produce(state, draft => {
            if (code === 'reset') {
                draft.showcampaigns = []
                draft.showcampaigns = draft.campaigns
                draft.activeFilters = []
            }
            if (code[0] === "8") {
                if(code[2] === "1") {
                    draft.showcampaigns = []
                    draft.showcampaigns = draft.campaigns
                    draft.activeFilters[0] = 'Only Coronavirus Campaigns'
                }
                if(code[2] === "2") {
                    draft.showcampaigns = []
                    draft.showcampaigns = draft.nocorona_campaigns
                    draft.activeFilters[0] = 'Only Non-Coronavirus Campaigns'
                }
                if(code[2] === "3") {
                    draft.showcampaigns = []
                    draft.showcampaigns = draft.campaigns.concat(draft.nocorona_campaigns)
                    draft.activeFilters[0] = 'All Campaigns'
                }
            }
            if (code[0] === "1") {
                if(code[2] === "1") {
                    draft.showcampaigns.sort((a,b) => b.average_donation - a.average_donation)
                    draft.activeFilters[1] = 'Average Donations (High to Low)'
                }
                if(code[2] === "2") {
                    draft.showcampaigns.sort((b,a) => b.average_donation - a.average_donation)                    
                    draft.activeFilters[1] = 'Average Donations (Low to High)'
                }                
            }
            if (code[0] === "2") {
                if(code[2] === "1") {
                    draft.showcampaigns.sort((a,b) => (b.current_amount/b.goal) - (a.current_amount/a.goal))
                    draft.activeFilters[2] = 'Progress to Goal (High to Low)'
                }
                if(code[2] === "2") {
                    draft.showcampaigns.sort((b,a) => (b.current_amount/b.goal) - (a.current_amount/a.goal))
                    draft.activeFilters[2] = 'Progress to Goal (Low to High)'
                }                
            }
            if (code[0] === "3") {
                if(code[2] === "1") {
                    draft.showcampaigns.sort((a,b) => b.donators - a.donators)
                    draft.activeFilters[3] = 'Number of Donors (High to Low)'
                }
                if(code[2] === "2") {
                    draft.showcampaigns.sort((b,a) => b.donators - a.donators)
                    draft.activeFilters[3] = 'Number of Donors (Low to High)'
                    
                }                
            }
            if (code[0] === "4") {
                if(code[2] === "1") {
                    draft.showcampaigns.sort((a,b) => (b.current_amount/b.days_active) - (a.current_amount/a.days_active))
                    draft.activeFilters[4] = 'Donations Per Day (High to Low)'
                }
                if(code[2] === "2") {
                    draft.showcampaigns.sort((b,a) => (b.current_amount/b.days_active) - (a.current_amount/a.days_active))
                    draft.activeFilters[4] = 'Donations Per Day (Low to High)'
                }                
            }
            if (code[0] === "5") {
                if(code[2] === "1") {
                    draft.showcampaigns.sort((a,b) => b.days_active - a.days_active)
                    draft.activeFilters[5] = 'Days Active (High to Low)'
                }
                if(code[2] === "2") {
                    draft.showcampaigns.sort((b,a) => b.days_active - a.days_active)
                    draft.activeFilters[5] = 'Days Active (Low to High)'
                }                
            }
            if (code[0] === "6") {
                if(code[2] === "1") {
                    draft.showcampaigns.sort((a,b) => b.campaign_hearts - a.campaign_hearts)
                    draft.activeFilters[6] = 'Number of Hearts (High to Low)'
                }
                if(code[2] === "2") {
                    draft.showcampaigns.sort((b,a) => b.campaign_hearts - a.campaign_hearts)
                    draft.activeFilters[6] = 'Number of Hearts (Low to High)'
                }                
            }
            if (code[0] === "7") {
                if(code[2] === "1") {
                    draft.showcampaigns.sort((a,b) => b.social_share_total - a.social_share_total)
                    draft.activeFilters[7] = 'Number of Reshares (High to Low)'
                }
                if(code[2] === "2") {
                    draft.showcampaigns.sort((b,a) => b.social_share_total - a.social_share_total)
                    draft.activeFilters[7] = 'Number of Reshares (Low to High)'
                }                
            }
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