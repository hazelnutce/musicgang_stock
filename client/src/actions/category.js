import {FETCH_CATEGORY,FETCH_STOCK_IN_CATEGORY} from './types'

import axios from 'axios'

export const fetchCategory = () => async dispatch => {
    const res = await axios.get('/api/category');
    const stockRes = await axios.get('/api/stock/stockName')
    dispatch({type: FETCH_CATEGORY, payload: res.data})
    dispatch({type: FETCH_STOCK_IN_CATEGORY, payload: stockRes.data})
}

