import {FETCH_STOCK_IN_TRANSACTION, HANDLE_CHANGE_ON_TRANSACTION} from '../actions/types';

const initState = {
    stockList : null,
    currentItemList : null
}

export default function(state = initState,action){
    switch(action.type){
        case FETCH_STOCK_IN_TRANSACTION:
            return {...state, stockList : action.payload}
        case HANDLE_CHANGE_ON_TRANSACTION:
            return {...state, currentItemList : action.payload}
        default:
            return state;
    }
} 