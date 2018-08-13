import {ADD_STOCK} from '../actions/types';

export default function(state = "",action){
    switch(action.type){
        case ADD_STOCK:
            return action.payload
        default:
            return state;
    }
} 