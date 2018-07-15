import React, { Component } from 'react';
import {BrowserRouter,Route} from 'react-router-dom'
import { fetchUser } from '../actions/index'
import {connect} from 'react-redux'

import Header from './Header'
import Landing from './Landing'

class App extends Component {
  componentDidMount = () => {
    this.props.fetchUser()
  }
  
  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />
            <Route exact path="/" component={Landing}></Route>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null,{fetchUser})(App)
