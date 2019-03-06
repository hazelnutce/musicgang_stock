import React, { Component } from 'react'

export class NewTransactionCounter extends Component {

  handleOnIncrease = () => {
    if(this.props.input.value < 50){
      return this.props.input.onChange(this.props.input.value + 1)
    }
  }

  handleOnDecrease = () => {
    if(this.props.input.value > 1){
      return this.props.input.onChange(this.props.input.value - 1)
    }
  }
   
  render() {
    const {keyLabel, meta: {error}} = this.props
    return (
      <div className="input-field col s12 m6 l6 xl6" style={{marginTop: "20px"}}>
        <div className="col s12 m12 l12 xl12">
          <span>{keyLabel}</span>
          <span style={{padding: "5px"}}>{this.props.input.value}</span>
          <span style={{marginLeft: "5px"}} onClick={() => this.handleOnIncrease()} className="btn-floating btn-small green waves-effect waves-light"><i className="material-icons">arrow_drop_up</i></span>
          <span style={{marginLeft: "5px"}} onClick={() => this.handleOnDecrease()} className="btn-floating btn-small red waves-effect waves-light"><i className="material-icons">arrow_drop_down</i></span>
        </div>
        <div className="col s6 m6 l6 xl6">
          {
            error && 
            <span className="red-text" style={{marginLeft: '20px'}}>
                {error}
            </span>
          } 
        </div>
        
      </div>
    )
  }
}

export default NewTransactionCounter
