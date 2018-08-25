import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form';

import authReducer from './authReducer'
import authErrorReducer from './authErrorReducer'
import stockReducer from './stockReducer'
import categoryReducer from './categoryReducer'

export default combineReducers({
    auth: authReducer,
    authError: authErrorReducer,
    stocks: stockReducer,
    category: categoryReducer,
    form: formReducer
});