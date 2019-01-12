import {FETCH_CATEGORY,FETCH_STOCK_IN_CATEGORY,ERROR_CREATE_CATEGORY} from '../actions/types'

const initState = {
    categories: null,
    stockDetails: null,
    errorMessage: null
}

export default function(state = initState,action){
    switch(action.type){
        case FETCH_CATEGORY:
            return {...state, categories: action.payload}
        case FETCH_STOCK_IN_CATEGORY:
            return {...state, stockDetails: action.payload}
        case ERROR_CREATE_CATEGORY:
            return {...state, errorMessage: action.payload}
        default:
            return state
    }
}