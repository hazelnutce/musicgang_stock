import {ADD_STOCK,ERROR_CREATE_STOCK} from '../actions/types';

const initState = {
    stockList : null,
    errorCreateStock : null
}

export default function(state = initState,action){
    switch(action.type){
        case ADD_STOCK:
            return {...state, stockList : action.payload}
        case ERROR_CREATE_STOCK:
            return {...state, errorCreateStock : action.payload}
        default:
            return state;
    }
} 