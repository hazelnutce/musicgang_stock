import {FETCH_CATEGORY,FETCH_STOCK_IN_CATEGORY,ERROR_CREATE_CATEGORY} from './types'
import { app } from './axiosConfig';
import { reset } from 'redux-form';

export const fetchCategory = () => async dispatch => {
    const res = await app.get('/api/category');
    const stockRes = await app.get('/api/stock/stockName')
    
    dispatch({type: FETCH_CATEGORY, payload: res.data})
    dispatch({type: FETCH_STOCK_IN_CATEGORY, payload: stockRes.data})
}

export const addCategory = (values, history, mode) => async dispatch => {
    if(mode === "create"){
        app.post('/api/category/new',values).then(async res => {
            history.push('/categories')
        }).catch(error => {
            if (error.response) {
                dispatch({type: ERROR_CREATE_CATEGORY, payload: error.response.data})
                dispatch(reset('newCategoryForm'))
            }
        })
    }
    else if(mode === "edit"){
        app.post('/api/category/edit', values).then(async res => {
            history.push('/categories')
        }).catch(error => {
            if (error.response) {
                dispatch({type: ERROR_CREATE_CATEGORY, payload: error.response.data})
                dispatch(reset('newCategoryForm'))
            }
        })
    }
    
}

export const resetCreateError = () => async dispatch => {
    dispatch({type: ERROR_CREATE_CATEGORY, payload: null})
} 

export const deleteCategory = (categoryId) => async dispatch => {
    const res = await app.delete(`/api/category/delete/${categoryId}`);
    dispatch({type: FETCH_CATEGORY, payload: res.data})
}

