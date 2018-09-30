import {FETCH_CATEGORY,FETCH_STOCK_IN_CATEGORY} from './types'
import {reset} from 'redux-form'

import axios from 'axios'

export const fetchCategory = () => async dispatch => {
    const res = await axios.get('/api/category');
    const stockRes = await axios.get('/api/stock/stockName')
    
    dispatch({type: FETCH_CATEGORY, payload: res.data})
    dispatch({type: FETCH_STOCK_IN_CATEGORY, payload: stockRes.data})
}

export const addCategory = (values,categoryDetail) => async dispatch => {
    var query = (categoryDetail.filter((item) => item.stockName === values.stockSelector))
    const res = await axios.post('/api/category/new',{...values, id : query[0]._id})
    dispatch({type: FETCH_CATEGORY, payload: res.data})
}

export const deleteCategory = (categoryId) => async dispatch => {
    const res = await axios.delete(`/api/category/delete/${categoryId}`);
    dispatch({type: FETCH_CATEGORY, payload: res.data})
}

