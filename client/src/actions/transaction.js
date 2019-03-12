import {FETCH_STOCK_IN_TRANSACTION, HANDLE_CHANGE_ON_TRANSACTION, IMPORT_TRANSACTION_ERROR, EXPORT_TRANSACTION_ERROR} from './types'
import { app } from './axiosConfig';

export const fetchStockInTransaction = () => async dispatch => {
    const res = await app.get('/api/transaction/findstock');
    dispatch({type: FETCH_STOCK_IN_TRANSACTION, payload: res.data})
}

export const handleOnChangeInCurrentItem = (values) => async dispatch => {
    dispatch({type: HANDLE_CHANGE_ON_TRANSACTION, payload: values})
}

export const importNewTransaction = (values, history) => async dispatch => {

    app.post('/api/transaction/add', values).then(async res => {
        //history.goBack()
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

