import React, { Component } from 'react';
import {BrowserRouter,Route} from 'react-router-dom'
import { fetchUser } from '../actions'
import {connect} from 'react-redux'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGhost, faTag, faDollarSign, faHandHoldingUsd, faExclamation } from '@fortawesome/free-solid-svg-icons'

import Landing from './Landing'
import StockPage from './stocks/StockPage';
import AddNewStockPage from './stocks/AddNewStockPage'
import CategoryPage from './categories/CategoryPage'
import ItemPage from './items/ItemPage'
import AddNewItemPage from './items/AddNewItemPage'
import MainMenu from './MainMenu';

library.add([faTag, faGhost, faDollarSign, faHandHoldingUsd, faExclamation])

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
            <Route exact path="/categories" component={CategoryPage}></Route>
            <Route exact path="/items/:stockId" component={ItemPage}></Route>
            <Route path="/items/add/new/:stockId" component={AddNewItemPage}></Route>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null,{fetchUser})(App)
