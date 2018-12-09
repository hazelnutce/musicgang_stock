import axios from 'axios'
import {FETCH_CATEGORY, FETCH_ITEMS, FETCH_ITEM, ERROR_CREATE_ITEM, ERROR_EDIT_ITEM} from './types'

export const fetchItems = (stockId) => async dispatch => {
    const res = await axios.get(`/api/item/${stockId}`);
    dispatch({type: FETCH_ITEMS, payload: res.data})
}

export const fetchItem = (itemId) => async dispatch => {
    const res = await axios.get(`/api/itemdetail/${itemId}`);
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
            dispatch({type: ERROR_CREATE_ITEM, payload: error.response.data})
        }
    })
    console.log(values)
}

export const editItem = (values, itemId, stockId, stockName, history) => async dispatch => {
    axios.post(`/api/item/edit/${itemId}`,values).then(async res => {
        history.push({
            pathname: `/items/${stockId}`,
            state: { stockName: stockName }
        })
    }).catch(error => {
        if (error.response) {
            console.log("errorrrrr")
            dispatch({type: ERROR_EDIT_ITEM, payload: error.response.data})
        }
    })
}

export const deleteItem = (itemId, stockId) => async dispatch => {
    var values = {stockId}
    const res = await axios.delete(`/api/item/delete/${itemId}`,{ data: { values } });
    console.log(res)
    dispatch({type: FETCH_ITEMS, payload: res.data})
}

