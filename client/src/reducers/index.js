import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form';

import authReducer from './authReducer'
import authErrorReducer from './authErrorReducer'
import stockReducer from './stockReducer'
import categoryReducer from './categoryReducer'
import itemReducer from './itemReducer';
import transactionReducer from './transactionReducer';
import musicroomReducer from './musicroomReducer'
import costReducer from './costReducer'
import transactionSummaryReducer from './transactionSummaryReducer'

export default combineReducers({
    auth: authReducer,
    authError: authErrorReducer,
    stocks: stockReducer,
    category: categoryReducer,
    item : itemReducer,
    form: formReducer,
    transaction: transactionReducer,
    musicroom: musicroomReducer,
    cost: costReducer,
    summaryTransaction: transactionSummaryReducer,
});