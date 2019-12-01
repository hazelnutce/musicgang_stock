import 'materialize-css/dist/css/materialize.css'
import 'materialize-css/dist/js/materialize.js'
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore,  applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk'
import moment from 'moment'

import App from './components/App';
import registerServiceWorker, {unregister} from './registerServiceWorker';
import reducers from './reducers'

const store = createStore(reducers,{},applyMiddleware(reduxThunk))

var d = new Date()
var n = d.getMonth()
var y = d.getFullYear()

var month = y * 12 + n
var monthString = month.toString()
var stringDate = moment().format("D/MM/YYYY")

var sessionStorageObject = {
    currentPageTrackerTransaction_1 : "1",
    currentPageTrackerTransaction_2 : "1",
    currentPageTrackerTransaction_month : monthString,
    currentModeTrackerTransaction : "import",
    currentDayFilterBoolTransaction : "false",
    currentDayFilterTransaction : stringDate,

    currentPageTrackerMusicroom_1 : "1",
    currentPageTrackerMusicroom_2 : "1",
    currentPageTrackerMusicroom_month : monthString,
    currentModeTrackerMusicroom : "small",
    currentDayFilterBoolMusicroom : "false",
    currentDayFilterMusicroom : stringDate,

    currentPageTrackerCost_1 : "1",
    currentPageTrackerCost_2 : "1",
    currentPageTrackerCost_month : monthString,
    currentModeTrackerCost : "cost",
    currentDayFilterBoolCost : "false",
    currentDayFilterCost : stringDate,
}

for(var p in sessionStorageObject){
    sessionStorage.setItem(p.toString(), sessionStorageObject[p])
}

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



