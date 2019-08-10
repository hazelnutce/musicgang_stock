import {ADD_STOCK,ERROR_CREATE_STOCK} from './types';
import { reset } from 'redux-form';
import {app} from './axiosConfig'

export const addNewStock = (values,history) => async dispatch => {
    app.post('/api/stock/add',values).then(async res => {
        history.push('/stocks')
    }).catch(error => {
        if (error.response) {
            dispatch({type: ERROR_CREATE_STOCK, payload: error.response.data})
            dispatch(reset('newStockForm'))
        }
    })
}

export const resetErrorCreateStock = () => async dispatch => {
    dispatch({type: ERROR_CREATE_STOCK, payload: null})
}

export const fetchStock = () => async dispatch => {
    const res = await app.get('/api/stock');
    dispatch({type: ADD_STOCK, payload: res.data})
}

export const deleteStock = (stockId, stockName) => async dispatch => {
    await app.post(`/api/stock/delete/${stockId}`, {stockName});
    const res = await app.get('/api/stock');
    dispatch({type: ADD_STOCK, payload: res.data})
}