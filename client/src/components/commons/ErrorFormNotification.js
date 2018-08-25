import React, { Component } from 'react'

const shiftErrorMessage = {top:"10px",position:"relative"}

export class ErrorFormNotification extends Component {
  render() {
    const {errorMessage,clearErrorMessage,specificColumn} = this.props
    return (
        <div className="row">
            <div className={`card-panel  ${specificColumn} red lighten-1`} style={{height: "60px"}}>
            <span className="white-text" style={shiftErrorMessage}>
                <span><i className="material-icons" style={{marginLeft: "10px",top:"5px",position:"relative"}}>warning</i></span>
                <a className="btn-flat right" style={shiftErrorMessage} onClick={() => clearErrorMessage()}><i className="close right material-icons  white-text">close</i></a>
                <span style={{marginLeft: "10px"}}>{errorMessage}</span>
            </span>
            </div>
        </div>  
    )
  }
}

export default ErrorFormNotification
