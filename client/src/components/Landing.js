import React, { Component } from 'react'
import {connect} from 'react-redux'
import LoginPage from './LoginPage'

export class Landing extends Component {
  renderContext(){
    switch(this.props.auth){
      case null:
        return ;
      case false:
        return <LoginPage />
      default:
        return <div>You logged in!</div>
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

export default connect(mapStateToProps)(Landing)
