import {FETCH_TRANSACTION_BYMONTH, FETCH_TRANSACTION_BYMONTH_LOADING} from '../actions/types';

const initState = {
    currentAllTransaction : {
        musicroom : [],
        cost: [],
        transaction: []
    },
    isCurrentAllTransactionLoading: false
}

export default function(state = initState,action){
    switch(action.type){
        case FETCH_TRANSACTION_BYMONTH:
            return {...state, currentAllTransaction : action.payload}
        case FETCH_TRANSACTION_BYMONTH_LOADING:
            return {...state, isCurrentAllTransactionLoading : action.payload}
        default:
            return state;
    }
} 