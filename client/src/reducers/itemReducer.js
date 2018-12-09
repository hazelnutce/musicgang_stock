import {FETCH_ITEMS, ERROR_CREATE_ITEM, ERROR_EDIT_ITEM, FETCH_ITEM} from '../actions/types'

const initState = {
    items: null,
    currentItem: null,
    errorCreateMessage: null,
    errorEditMessage: null
}

export default function(state = initState,action){
    switch(action.type){
        case FETCH_ITEM:
            return {...state, currentItem: action.payload}
        case FETCH_ITEMS:
            return {...state, items: action.payload}
        case ERROR_CREATE_ITEM:
            return {...state, errorCreateMessage: action.payload}
        case ERROR_EDIT_ITEM:
            return {...state, errorEditMessage: action.payload}
        default:
            return state
    }
}