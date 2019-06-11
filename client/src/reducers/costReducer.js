import {COST_TRANSACTION_ERROR, FETCH_COST_TRANSACTION} from '../actions/types';

const initState = {
    costTransactions : null,
    costTransactionError : null
}

export default function(state = initState,action){
    switch(action.type){
        case COST_TRANSACTION_ERROR:
            return {...state, costTransactionError : action.payload}
        case FETCH_COST_TRANSACTION:
            return {...state, costTransactions : action.payload}
        default:
            return state
    }
} 