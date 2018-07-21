import {LOGIN_USER_FAILED} from '../actions/types';

export default function(state = "",action){
    switch(action.type){
        case LOGIN_USER_FAILED:
            return action.payload;
        default:
            return state;
    }
} 