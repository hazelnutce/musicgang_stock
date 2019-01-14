import {FETCH_STOCK_IN_TRANSACTION} from '../actions/types';

const initState = {
    stockList : null,
}

export default function(state = initState,action){
    switch(action.type){
        case FETCH_STOCK_IN_TRANSACTION:
            return {...state, stockList : action.payload}
        default:
            return state;
    }
} 