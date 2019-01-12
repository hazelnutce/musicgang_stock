import React, { Component } from 'react'
import {connect} from 'react-redux'
import LoginPage from './LoginPage'
import DashboardPage from './DashboardPage'
import {loggedOutUser} from '../actions/index'

export class Landing extends Component {

  componentDidUpdate(){
    if(this.props.location.state != null && this.props.location.state.signal === "logout"){
      this.props.loggedOutUser(this.props.history)
    }
  }

  renderContext(){
    switch(this.props.auth){
      case null:
        return ;
      case false:
        return <LoginPage />
      default:
        return <DashboardPage />;
    }
  }

  render() {
    return (
      <div>
        {this.renderContext()}
      </div>
    )
  }
}

function mapStateToProps(state){
  return {auth: state.auth}
}

export default connect(mapStateToProps, {loggedOutUser})(Landing)
