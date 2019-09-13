import React, { Component } from 'react';
import {BrowserRouter,Route, Switch} from 'react-router-dom'
import { fetchUser } from '../actions'
import {connect} from 'react-redux'
import { library } from '@fortawesome/fontawesome-svg-core'
import './common.css'
import { faGhost, 
  faTag, 
  faDollarSign, 
  faHandHoldingUsd, 
  faExclamation,
  faTags,
  faBoxes,
  faSignOutAlt,
  faArrowUp,
  faArrowDown,
  faPlus,
  faMinus, 
  faMusic,
  faClock,
  faInfo } from '@fortawesome/free-solid-svg-icons'

import Landing from './Landing'
import StockPage from './stocks/StockPage';
import AddNewStockPage from './stocks/AddNewStockPage'
import CategoryPage from './categories/CategoryPage'
import ItemPage from './items/ItemPage'
import AddNewItemPage from './items/AddNewItemPage'
import EditItemPage from './items/EditItemPage'
import ViewItemPage from './items/ViewItemPage'
import MainMenu from './MainMenu';
import AddNewCategoryPage from './categories/AddNewCategoryPage'
import TransactionPage from './transaction/TransctionPage'
import TransactionSummaryPage from './transaction/TransactionSummaryPage'
import TransactionImport from './transaction/AddNewTransactionIn'
import TransactionExport from './transaction/AddNewTransactionOut'
import EditTransaction from './transaction/EditTransaction'
import ViewTransaction from './transaction/ViewTransaction'
import MusicroomTransactionPage from './musicrooms/MusicroomTransactionPage'
import AddMusicroomTransaction from './musicrooms/AddMusicroomTransaction'
import EditMusicroomTransaction from "./musicrooms/EditMusicroomTransaction";
import ViewMusicroomTransaction from './musicrooms/ViewMusicroomTransaction'
import CostTransactionPage from './costs/CostTransactionPage'
import CostTransactionDetailPage from './costs/CostTransactionDetail'
import EditCostTransaction from './costs/EditCostTransaction'
import ViewCostTransaction from './costs/ViewCostTransaction'
import ErrorNoticePage from './commons/ErrorProcessNotice'

library.add([faTag, faGhost, faDollarSign, faHandHoldingUsd, faExclamation, faTags, faBoxes, faBoxes,
  faSignOutAlt, faArrowUp, faArrowDown, faPlus, faMinus, faMusic, faClock, faInfo])

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
              <Switch>
                <Route exact path="/" component={Landing}></Route>
                <Route exact path="/stocks" component={StockPage}></Route>
                <Route exact path="/stocks/new" component={AddNewStockPage}></Route>
                <Route exact path="/categories/new" component={AddNewCategoryPage}></Route>
                <Route exact path="/categories" component={CategoryPage}></Route>
                <Route exact path="/items/view" component={ViewItemPage}></Route>
                <Route exact path="/items/:stockId" component={ItemPage}></Route>
                <Route exact path="/items/add/new/:stockId" component={AddNewItemPage}></Route>
                <Route exact path="/items/edit/:itemId" component={EditItemPage}></Route>
                <Route exact path="/transactions" component={TransactionPage}></Route>
                <Route exact path="/transactions/view" component={ViewTransaction}></Route>
                <Route exact path="/transactions/new/import" component={TransactionImport}></Route>
                <Route exact path="/transactions/new/export" component={TransactionExport}></Route>
                <Route exact path="/transactions/detail" component={TransactionSummaryPage}></Route>
                <Route exact path="/transactions/edit" component={EditTransaction}></Route>
                <Route exact path="/musicrooms" component={MusicroomTransactionPage}></Route>
                <Route exact path="/musicrooms/new" component={AddMusicroomTransaction}></Route>
                <Route exact path="/musicrooms/view" component={ViewMusicroomTransaction}></Route>
                <Route exact path="/musicrooms/edit" component={EditMusicroomTransaction}></Route>
                <Route exact path="/costs" component={CostTransactionPage}></Route>
                <Route exact path="/costs/view" component={ViewCostTransaction}></Route>
                <Route exact path="/costs/detail" component={CostTransactionDetailPage}></Route>
                <Route exact path="/costs/edit" component={EditCostTransaction}></Route>
                <Route component={ErrorNoticePage} />
              </Switch>
            {/* <Route path="/setting" component={SettingPage}></Route> */}
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null,{fetchUser})(App)
