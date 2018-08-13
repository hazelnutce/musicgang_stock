import React, { Component } from 'react';
import {BrowserRouter,Route} from 'react-router-dom'
import { fetchUser } from '../actions'
import {connect} from 'react-redux'

import MainMenu from './MainMenu'
import Landing from './Landing'
import StockPage from './stocks/StockPage';
import AddNewStockPage from './stocks/AddNewStockPage'

class App extends Component {
  componentDidMount = () => {
    this.props.fetchUser()
    
  }
  
  render() {
    return (
      <div className="container-fluid">
        <BrowserRouter>
          <div>
            <MainMenu />
            <Route exact path="/" component={Landing}></Route>
            <Route exact path="/stocks" component={StockPage}></Route>
            <Route path="/stocks/new" component={AddNewStockPage}></Route>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null,{fetchUser})(App)
