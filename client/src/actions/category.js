import {FETCH_CATEGORY,FETCH_STOCK_IN_CATEGORY} from './types'
import { app } from './axiosConfig';

export const fetchCategory = () => async dispatch => {
    const res = await app.get('/api/category');
    const stockRes = await app.get('/api/stock/stockName')
    
    dispatch({type: FETCH_CATEGORY, payload: res.data})
    dispatch({type: FETCH_STOCK_IN_CATEGORY, payload: stockRes.data})
}

export const addCategory = (values, stocks) => async dispatch => {
    console.log(values)
}

export const deleteCategory = (categoryId) => async dispatch => {
    const res = await app.delete(`/api/category/delete/${categoryId}`);
    dispatch({type: FETCH_CATEGORY, payload: res.data})
}

