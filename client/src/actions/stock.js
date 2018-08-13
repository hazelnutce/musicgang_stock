import {ADD_STOCK} from './types';
import axios from 'axios'

export const addNewStock = (values,history) => async dispatch => {
    await axios.post('/api/stock/add',values);
    history.push('/stocks')
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