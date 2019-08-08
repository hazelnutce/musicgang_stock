import {COST_TRANSACTION_ERROR,
    FETCH_COST_TRANSACTION} from './types'
import { app } from './axiosConfig';

export const fetchTransaction = () => async dispatch => {
    const res = await app.get('/api/cost');
    dispatch({type: FETCH_COST_TRANSACTION, payload: res.data})
}

export const addNewCostTransaction = (values, history) => async dispatch => {
    app.post('/api/cost/add', values).then(async (res) => {
        dispatch({type: FETCH_COST_TRANSACTION, payload: res.data})
    }).catch(error => {
        if (error.response) {
            dispatch({type: COST_TRANSACTION_ERROR, payload: error.response.data})
        }
    })
}

export const deleteCostTransaction = (id) => async dispatch => {
    app.delete('/api/cost/delete/' + id).then(async (res) => {
        dispatch({type: FETCH_COST_TRANSACTION, payload: res.data})
    }).catch(error => {
        if (error.response) {
            dispatch({type: COST_TRANSACTION_ERROR, payload: error.response.data})
        }
    })
}

export const editCostTransaction = (values, history) => async dispatch => {
    app.post(`/api/cost/edit`,values).then(async res => {
        history.goBack()
    }).catch(error => {
        if (error.response) {
            dispatch({type: COST_TRANSACTION_ERROR, payload: error.response.data})
        }
    })
}

export const getTotalImport = (month, stockId) => async dispatch => {
    var values = {stockId}
    return app.post(`/api/transaction/getTotalImport/${month}`, values)
}

export const getTotalExport = (month, stockId) => async dispatch => {
    var values = {stockId}
    return app.post(`/api/transaction/getTotalExport/${month}`, values)
}

export const getTotalMusicroom = (month) => async dispatch => {
    return app.post(`/api/musicroom/getTotalRevenue/${month}`)
}

export const resetCostTransactionError = () => async dispatch => {
    dispatch({type: COST_TRANSACTION_ERROR, payload : null})
}