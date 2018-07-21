import React, { Component } from 'react'
import {connect} from 'react-redux'
import {TopbarMenu} from './navigates/topbarMenu';

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
        <TopbarMenu />
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

export default connect(mapStateToProps)(Header)
