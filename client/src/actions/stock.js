import {ADD_STOCK} from './types';
import axios from 'axios'

export const addNewStock = (values) => async dispatch => {
    const res = await axios.post('/api/stock/add',values);
    console.log(res)
}

export const fetchStock = () => async dispatch => {
    const res = await axios.get('/api/stock');
    dispatch({type: ADD_STOCK, payload: res.data})
}