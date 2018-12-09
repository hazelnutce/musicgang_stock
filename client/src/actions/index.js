import {FETCH_USER,LOGIN_USER_FAILED} from './types';
import axios from "axios";
import { reset } from 'redux-form';

export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/currentuser')
    dispatch({ type: FETCH_USER , payload: res});
}

export const loggedInUser = (values,history) => dispatch => {
    axios.post('/api/login',values).then(async res => {
        const userRes = await axios.get('/api/currentuser')
        history.push('/')
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