import axios from 'axios'
import {FETCH_CATEGORY} from './types'

export const fetchItems = (stockId) => async dispatch => {
    console.log(stockId)
    const res = await axios.get(`/api/item/${stockId}`);
    console.log(res)
}

export const fetchCategory = () => async dispatch => {
    const res = await axios.get('/api/category');
    dispatch({type: FETCH_CATEGORY, payload: res.data})
}

