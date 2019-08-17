import {MUSICROOM_TRANSACTION_ERROR,
        FETCH_MUSICROOM_TRANSACTION,
        GET_MUSICROOM_TRANSACTION} from './types'
import { app } from './axiosConfig';

export const fetchTransaction = () => async dispatch => {
    const res = await app.get('/api/musicroom');
    dispatch({type: FETCH_MUSICROOM_TRANSACTION, payload: res.data})
}

export const addNewMusicroomTransaction = (values, history) => async dispatch => {
    app.post('/api/musicroom/add', values).then(async () => {
        history.goBack()
    }).catch(error => {
        if (error.response) {
            dispatch({type: MUSICROOM_TRANSACTION_ERROR, payload: error.response.data})
        }
    })
}

export const deleteMusicroomTransaction = (id) => async dispatch => {
    app.delete('/api/musicroom/delete/' + id).then(async (res) => {
        dispatch({type: FETCH_MUSICROOM_TRANSACTION, payload: res.data})
    }).catch(error => {
        if (error.response) {
            dispatch({type: MUSICROOM_TRANSACTION_ERROR, payload: error.response.data})
        }
    })
}

export const editMusicroomTransaction = (values, history) => async dispatch => {
    app.post(`/api/musicroom/edit`,values).then(async res => {
        history.goBack()
    }).catch(error => {
        if (error.response) {
            dispatch({type: MUSICROOM_TRANSACTION_ERROR, payload: error.response.data})
        }
    })
}

export const getMusicroomTransaction = (recordId, history) => async dispatch => {
    app.post(`/api/musicroom/get`,{recordId}).then(async res => {
        dispatch({type: GET_MUSICROOM_TRANSACTION, payload: res.data})
    }).catch(error => {
        if (error.response) {
            dispatch({type: MUSICROOM_TRANSACTION_ERROR, payload: error.response.data})
        }
    })
}

export const resetMusicroomTransactionError = () => async dispatch => {
    dispatch({type: MUSICROOM_TRANSACTION_ERROR, payload : null})
}