import React, { Component } from 'react'
import {connect} from 'react-redux'
import {SidebarMenu} from './navigates/sidebarMenu';
import {withRouter} from 'react-router-dom'

export class Header extends Component {
  

  renderContext(){
    if(this.props.auth === null){
      return ;
    }
    else if(this.props.auth === false){
      return (
        <div></div>
      )
    }
    else{
      return (
        <SidebarMenu history={this.props.history}/>
      )
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

function mapStateToProps(states){
  return {auth: states.auth}
}

export default withRouter(connect(mapStateToProps)(Header))
