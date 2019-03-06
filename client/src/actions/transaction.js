import {FETCH_STOCK_IN_TRANSACTION, HANDLE_CHANGE_ON_TRANSACTION} from './types'
import { app } from './axiosConfig';

export const fetchStockInTransaction = () => async dispatch => {
    const res = await app.get('/api/transaction/findstock');
    dispatch({type: FETCH_STOCK_IN_TRANSACTION, payload: res.data})
}

export const handleOnChangeInCurrentItem = (values) => async dispatch => {
    dispatch({type: HANDLE_CHANGE_ON_TRANSACTION, payload: values})
}

