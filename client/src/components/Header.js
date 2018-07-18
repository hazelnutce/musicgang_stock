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
        <TopbarMenu />
      )
    }
    else{
      return (
        <TopbarMenu />
      )
    }
  }


  render() {
    console.log(this.props.auth)
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
