import {FETCH_USER} from './types';
import axios from "axios";

export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/currentuser')
    dispatch({ type: FETCH_USER , payload: res});
}

export const loggedInUser = (values,history) => async dispatch => {
    const res = await axios.post('/api/login',values)
    history.push('/')
    dispatch({ type: FETCH_USER , payload: res});
}