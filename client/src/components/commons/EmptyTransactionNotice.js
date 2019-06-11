import React, { Component } from 'react'

const shiftErrorMessage = {top:"10px",position:"relative"}

export class EmptyTransactionNotice extends Component {

  render() {
    const {message} = this.props
    return (
        <div className={`card-panel col xl12 l12 m12 s12 yellow darken-1`} style={{height: "60px"}}>
        <span className="white-text" style={shiftErrorMessage}>
            <span><i className="material-icons" style={{marginLeft: "10px",top:"5px",position:"relative"}}>warning</i></span>
            <span style={{marginLeft: "10px"}}>{message}</span>
        </span>
        </div>
    )
  }
}

export default EmptyTransactionNotice