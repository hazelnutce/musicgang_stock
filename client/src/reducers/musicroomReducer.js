import {MUSICROOM_TRANSACTION_ERROR, FETCH_MUSICROOM_TRANSACTION, GET_MUSICROOM_TRANSACTION} from '../actions/types';

const initState = {
    musicroomTransactions : null,
    musicroomTransactionError : null,
    currentMusicroomTransaction : null
}

export default function(state = initState,action){
    switch(action.type){
        case MUSICROOM_TRANSACTION_ERROR:
            return {...state, musicroomTransactionError : action.payload}
        case FETCH_MUSICROOM_TRANSACTION:
            return {...state, musicroomTransactions : action.payload}
        case GET_MUSICROOM_TRANSACTION:
            return {...state, currentMusicroomTransaction : action.payload}
        default:
            return state
    }
} 