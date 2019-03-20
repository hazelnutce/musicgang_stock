import {FETCH_STOCK_IN_TRANSACTION, HANDLE_CHANGE_ON_TRANSACTION, FETCH_TRANSACTIONS} from '../actions/types';

const initState = {
    stockList : null,
    currentItemList : null,
    transactions : null
}

export default function(state = initState,action){
    switch(action.type){
        case FETCH_STOCK_IN_TRANSACTION:
            return {...state, stockList : action.payload}
        case HANDLE_CHANGE_ON_TRANSACTION:
            return {...state, currentItemList : action.payload}
        case FETCH_TRANSACTIONS:
            return {...state, transactions : action.payload}
        default:
            return state;
    }
} 