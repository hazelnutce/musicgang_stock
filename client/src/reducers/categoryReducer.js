import {FETCH_CATEGORY,FETCH_STOCK_IN_CATEGORY} from '../actions/types'

const initState = {
    categories: null,
    stockDetails: null
}

export default function(state = initState,action){
    switch(action.type){
        case FETCH_CATEGORY:
            return {...state, categories: action.payload}
        case FETCH_STOCK_IN_CATEGORY:
            return {...state, stockDetails: action.payload}
        default:
            return state
    }
}