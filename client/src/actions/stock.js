import {ADD_STOCK,ERROR_CREATE_STOCK} from './types';
import { reset } from 'redux-form';
import axios from 'axios'

export const addNewStock = (values,history) => async dispatch => {
    axios.post('/api/stock/add',values).then(async res => {
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
    const res = await axios.get('/api/stock');
    dispatch({type: ADD_STOCK, payload: res.data})
}

export const deleteStock = (stockId) => async dispatch => {
    await axios.delete(`/api/stock/delete/${stockId}`);
    const res = await axios.get('/api/stock');
    dispatch({type: ADD_STOCK, payload: res.data})
}