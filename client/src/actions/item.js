import axios from 'axios'
import {FETCH_CATEGORY} from './types'

export const fetchItems = (stockId) => async dispatch => {
    await axios.get(`/api/item/${stockId}`);
}

export const fetchCategory = () => async dispatch => {
    const res = await axios.get('/api/category');
    dispatch({type: FETCH_CATEGORY, payload: res.data})
}

export const addNewItems = (value) => async dispatch => {
    console.log(value)
}

