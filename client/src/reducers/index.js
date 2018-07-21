import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form';

import authReducer from './authReducer'
import authErrorReducer from './authErrorReducer'

export default combineReducers({
    auth: authReducer,
    authError: authErrorReducer,
    form: formReducer
});