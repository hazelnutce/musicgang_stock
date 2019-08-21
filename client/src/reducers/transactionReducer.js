import {FETCH_STOCK_IN_TRANSACTION, 
    HANDLE_CHANGE_ON_TRANSACTION, 
    FETCH_TRANSACTIONS,
    EDIT_TRANSACTION_ERROR,
    IMPORT_TRANSACTION_ERROR,
    EXPORT_TRANSACTION_ERROR,
    GET_TRANSACTION} from '../actions/types';

const initState = {
    stockList : null,
    currentItemList : null,
    transactions : null,
    currentRecord : null,
    transactionEditError : null,
    transactionImportError : null,
    transactionExportError : null
}

export default function(state = initState,action){
    switch(action.type){
        case FETCH_STOCK_IN_TRANSACTION:
            return {...state, stockList : action.payload}
        case HANDLE_CHANGE_ON_TRANSACTION:
            return {...state, currentItemList : action.payload}
        case FETCH_TRANSACTIONS:
            return {...state, transactions : action.payload}
        case GET_TRANSACTION:
            return {...state, currentRecord : action.payload}
        case EDIT_TRANSACTION_ERROR:
            return {...state, transactionEditError : action.payload}
        case IMPORT_TRANSACTION_ERROR:
            return {...state, transactionImportError : action.payload}
        case EXPORT_TRANSACTION_ERROR:
            return {...state, transactionExportError : action.payload}
        default:
            return state;
    }
} 