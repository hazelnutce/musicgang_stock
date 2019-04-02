import {FETCH_STOCK_IN_TRANSACTION, 
    HANDLE_CHANGE_ON_TRANSACTION, 
    IMPORT_TRANSACTION_ERROR, 
    EXPORT_TRANSACTION_ERROR,
    FETCH_TRANSACTIONS,
    EDIT_TRANSACTION_ERROR} from './types'
import { app } from './axiosConfig';

export const fetchStockInTransaction = () => async dispatch => {
    const res = await app.get('/api/transaction/findstock');
    dispatch({type: FETCH_STOCK_IN_TRANSACTION, payload: res.data})
}

export const fetchTransaction = () => async dispatch => {
    const res = await app.get('/api/transaction');
    dispatch({type: FETCH_TRANSACTIONS, payload: res.data})
}

export const handleOnChangeInCurrentItem = (values) => async dispatch => {
    dispatch({type: HANDLE_CHANGE_ON_TRANSACTION, payload: values})
}

export const importNewTransaction = (values, history) => async dispatch => {
    app.post('/api/transaction/add', values).then(async res => {
        history.goBack()
    }).catch(error => {
        if (error.response) {
            dispatch({type: IMPORT_TRANSACTION_ERROR, payload: error.response.data})
        }
    })
}

export const exportNewTransaction = (values, history) => async dispatch => {
    app.post('/api/transaction/add',values).then(async res => {
        history.goBack()
    }).catch(error => {
        if (error.response) {
            dispatch({type: EXPORT_TRANSACTION_ERROR, payload: error.response.data})
        }
    })
}

export const modifyImportTransaction = (values, history) => async dispatch => {
    app.post('/api/transaction/edit', values).then(async res => {
        history.goBack()
    }).catch(error => {
        if (error.response) {
            dispatch({type: EDIT_TRANSACTION_ERROR, payload: error.response.data})
        }
    })
}

export const modifyExportTransaction = (values, history) => async dispatch => {
    app.post('/api/transaction/edit', values).then(async res => {
        history.goBack()
    }).catch(error => {
        if (error.response) {
            dispatch({type: EDIT_TRANSACTION_ERROR, payload: error.response.data})
        }
    })
}

export const refundTransaction = (id, history) => async dispatch => {
    app.post('/api/transaction/refund', {id}).then(async res => {
        history.goBack()
    }).catch(error => {
        if(error.response) {
            dispatch({type: EDIT_TRANSACTION_ERROR, payload: error.response.data})
        }
    })
}

export const resetEditTransactionError = () => async dispatch => {
    dispatch({type: EDIT_TRANSACTION_ERROR, payload : null})
}

export const resetImportTransactionError = () => async dispatch => {
    dispatch({type: IMPORT_TRANSACTION_ERROR, payload : null})
}

export const resetExportTransactionError = () => async dispatch => {
    dispatch({type: EXPORT_TRANSACTION_ERROR, payload : null})
}

