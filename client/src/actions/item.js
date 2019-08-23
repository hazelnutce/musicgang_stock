import {app} from './axiosConfig'
import {FETCH_CATEGORY, FETCH_ITEMS, FETCH_ITEM, ERROR_CREATE_ITEM, ERROR_EDIT_ITEM, GET_ITEM} from './types'

export const fetchItems = (stockId) => async dispatch => {
    const res = await app.get(`/api/item/${stockId}`);
    dispatch({type: FETCH_ITEMS, payload: res.data})
}

export const fetchItem = (itemId) => async dispatch => {
    const res = await app.get(`/api/itemdetail/${itemId}`);
    dispatch({type: FETCH_ITEM, payload: res.data})
}

export const fetchCategory = () => async dispatch => {
    const res = await app.get('/api/category');
    dispatch({type: FETCH_CATEGORY, payload: res.data})
}

export const addNewItems = (values, stockId, stockName, history) => async dispatch => {
    values = {...values, stockId}
    app.post('/api/item/add',values).then(async res => {
        history.push({
            pathname: `/items/${stockId}`,
            state: { stockName: stockName }
        })
    }).catch(error => {
        if (error.response) {
            dispatch({type: ERROR_CREATE_ITEM, payload: error.response.data})
        }
    })
}

export const getItem = (recordId) => async dispatch => {
    app.post(`/api/item/get`,{recordId}).then(async res => {
        dispatch({type: GET_ITEM, payload: res.data})
    }).catch(error => {
        if (error.response) {
            dispatch({type: ERROR_EDIT_ITEM, payload: error.response.data})
        }
    })
}

export const editItem = (values, itemId, stockId, stockName, history) => async dispatch => {
    values.stockId = stockId
    values.currentDay = new Date(new Date().setHours(0,0,0,0))
    app.post(`/api/item/edit/${itemId}`,values).then(async res => {
        history.goBack()
    }).catch(error => {
        if (error.response) {
            dispatch({type: ERROR_EDIT_ITEM, payload: error.response.data})
        }
    })
}

export const deleteItem = (itemId, stockId) => async dispatch => {
    var values = {stockId}
    const res = await app.delete(`/api/item/delete/${itemId}`,{ data: { values } });
    dispatch({type: FETCH_ITEMS, payload: res.data})
}

export const resetEditError = () => async dispatch => {
    dispatch({type: ERROR_EDIT_ITEM, payload: null})
}

export const resetCreateError = () => async dispatch => {
    dispatch({type: ERROR_CREATE_ITEM, payload: null})
}

