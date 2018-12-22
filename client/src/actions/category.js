import {FETCH_CATEGORY,FETCH_STOCK_IN_CATEGORY} from './types'
import { app } from './axiosConfig';

export const fetchCategory = () => async dispatch => {
    const res = await app.get('/api/category');
    const stockRes = await app.get('/api/stock/stockName')
    
    dispatch({type: FETCH_CATEGORY, payload: res.data})
    dispatch({type: FETCH_STOCK_IN_CATEGORY, payload: stockRes.data})
}

export const addCategory = (values) => async dispatch => {
    console.log(values)
}

export const addCategory2 = (values,categoryDetail) => async dispatch => {
    var query = (categoryDetail.filter((item) => item.stockName === values.stockSelector))
    const res = await app.post('/api/category/new',{...values, id : query[0]._id})
    dispatch({type: FETCH_CATEGORY, payload: res.data})
}

export const deleteCategory = (categoryId) => async dispatch => {
    const res = await app.delete(`/api/category/delete/${categoryId}`);
    dispatch({type: FETCH_CATEGORY, payload: res.data})
}

