import {FETCH_STOCK_IN_TRANSACTION} from './types'
import { app } from './axiosConfig';

export const fetchStockInTransaction = () => async dispatch => {
    const res = await app.get('/api/transaction/findstock');
    dispatch({type: FETCH_STOCK_IN_TRANSACTION, payload: res.data})
}