import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export class NewTransactionCounter extends Component {

  handleOnIncrease = () => {
    if(this.props.input.value < 10){
        return this.props.input.onChange(this.props.input.value + 1)
    }
  }

  handleOnDecrease = () => {
      if(this.props.input.value > 1){
        return this.props.input.onChange(this.props.input.value - 1)
      }
  }
    
  render() {
    const {keyLabel} = this.props
    return (
      <div className="input-field col s12 m6 l6 xl6" style={{marginTop: "20px"}}>
        <span>{keyLabel}</span>
        <span style={{padding: "5px"}}>{this.props.input.value}</span>
        <span style={{marginLeft: "20px"}} onClick={() => this.handleOnIncrease()} className="btn-floating btn-small green waves-effect waves-light"><i className="material-icons"><FontAwesomeIcon icon="plus"/></i></span>
        <span style={{marginLeft: "20px"}} onClick={() => this.handleOnDecrease()} className="btn-floating btn-small red waves-effect waves-light"><i className="material-icons"><FontAwesomeIcon icon="minus"/></i></span>
      </div>
    )
  }
}

export default NewTransactionCounter
