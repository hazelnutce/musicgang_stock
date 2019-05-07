import {MUSICROOM_TRANSACTION_ERROR, FETCH_MUSICROOM_TRANSACTION} from '../actions/types';

const initState = {
    musicroomTransactions : null,
    musicroomTransactionError : null
}

export default function(state = initState,action){
    switch(action.type){
        case MUSICROOM_TRANSACTION_ERROR:
            return {...state, musicroomTransactionError : action.payload}
        case FETCH_MUSICROOM_TRANSACTION:
            return {...state, musicroomTransactions : action.payload}
        default:
            return state
    }
} 