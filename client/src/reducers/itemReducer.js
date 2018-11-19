import {FETCH_ITEM, ERROR_CREATE_ITEM} from '../actions/types'

const initState = {
    items: null,
    errorMessage: null
}

export default function(state = initState,action){
    switch(action.type){
        case FETCH_ITEM:
            return {...state, items: action.payload}
        case ERROR_CREATE_ITEM:
            return {...state, errorMessage: action.payload}
        default:
            return state
    }
}