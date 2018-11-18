import axios from 'axios'
import {FETCH_CATEGORY, ERROR_CREATE_STOCK} from './types'
import { reset } from 'redux-form';

export const fetchItems = (stockId) => async dispatch => {
    await axios.get(`/api/item/${stockId}`);
}

export const fetchCategory = () => async dispatch => {
    const res = await axios.get('/api/category');
    dispatch({type: FETCH_CATEGORY, payload: res.data})
}

export const addNewItems = (values, stockId, history) => async dispatch => {
    values = {...values, stockId}
    axios.post('/api/item/add',values).then(async res => {
        //history.push('/stocks')
    }).catch(error => {
        if (error.response) {
            dispatch({type: ERROR_CREATE_STOCK, payload: error.response.data})
            dispatch(reset('newItemForm'))
        }
    })
    console.log(values)
}

