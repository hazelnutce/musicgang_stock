import 'materialize-css/dist/css/materialize.css'
import 'materialize-css/dist/js/materialize.js'
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore,  applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk'

import App from './components/App';
import registerServiceWorker, {unregister} from './registerServiceWorker';
import reducers from './reducers'

const store = createStore(reducers,{},applyMiddleware(reduxThunk))

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root'));

if(process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'production'){
    unregister()
}
else{
    registerServiceWorker()
}



