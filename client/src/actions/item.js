import axios from 'axios'
import {FETCH_CATEGORY, ERROR_CREATE_STOCK, FETCH_ITEM} from './types'
import { reset } from 'redux-form';

export const fetchItems = (stockId) => async dispatch => {
    const res = await axios.get(`/api/item/${stockId}`);
    dispatch({type: FETCH_ITEM, payload: res.data})
}

export const fetchCategory = () => async dispatch => {
    const res = await axios.get('/api/category');
    dispatch({type: FETCH_CATEGORY, payload: res.data})
}

export const addNewItems = (values, stockId, stockName, history) => async dispatch => {
    values = {...values, stockId}
    axios.post('/api/item/add',values).then(async res => {
        history.push({
            pathname: `/items/${stockId}`,
            state: { stockName: stockName }
        })
    }).catch(error => {
        if (error.response) {
            dispatch({type: ERROR_CREATE_STOCK, payload: error.response.data})
            dispatch(reset('newItemForm'))
        }
    })
    console.log(values)
}

export const deleteItem = (itemId, stockId) => async dispatch => {
    var values = {stockId}
    const res = await axios.delete(`/api/item/delete/${itemId}`,{ data: { values } });
    console.log(res)
    dispatch({type: FETCH_ITEM, payload: res.data})
}

