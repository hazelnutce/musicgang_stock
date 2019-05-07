import {MUSICROOM_TRANSACTION_ERROR,
        FETCH_MUSICROOM_TRANSACTION} from './types'
import { app } from './axiosConfig';

export const fetchTransaction = () => async dispatch => {
    const res = await app.get('/api/musicroom');
    dispatch({type: FETCH_MUSICROOM_TRANSACTION, payload: res.data})
}

export const AddNewMusicroomTransaction = (values, history) => async dispatch => {
    app.post('/api/musicroom/add', values).then(async () => {
        history.goBack()
    }).catch(error => {
        if (error.response) {
            dispatch({type: MUSICROOM_TRANSACTION_ERROR, payload: error.response.data})
        }
    })
}

export const resetMusicroomTransactionError = () => async dispatch => {
    dispatch({type: MUSICROOM_TRANSACTION_ERROR, payload : null})
}