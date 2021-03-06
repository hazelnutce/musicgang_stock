import {FETCH_USER,LOGIN_USER_FAILED} from './types';
import { app } from './axiosConfig';
import { reset } from 'redux-form';

export const fetchUser = () => async dispatch => {
    const res = await app.get('/api/currentuser')
    dispatch({ type: FETCH_USER , payload: res});
}

export const loggedOutUser = () => async dispatch => {
    app.get("/api/logout").then(async res => {
        const userRes = await app.get('/api/currentuser')
        dispatch({ type: FETCH_USER , payload: userRes});
    })
}

export const loggedInUser = (values,history) => dispatch => {
    app.post('/api/login',values).then(async res => {
        const userRes = await app.get('/api/currentuser')
        history.push({
            pathname: "/",
            state: { signal: "login" }
        })
        dispatch({ type: FETCH_USER , payload: userRes});
    }).catch(error => {
        if (error.response) {
            history.push('/')
            dispatch(reset('login'))
            dispatch({ type: LOGIN_USER_FAILED, payload: error.response.data.message});
        }
    })
}

export const clearErrorAuth = () => dispatch => {
    dispatch({type: LOGIN_USER_FAILED, payload: null})
}
