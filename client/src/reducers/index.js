import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form';

import authReducer from './authReducer'
import authErrorReducer from './authErrorReducer'
import stockReducer from './stockReducer'

export default combineReducers({
    auth: authReducer,
    authError: authErrorReducer,
    stocks: stockReducer,
    form: formReducer
});