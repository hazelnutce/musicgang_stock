import React, { Component } from 'react'

export class NewMusicroomTransactionCheckBox extends Component {
    handleOnChange(value){
        return this.props.input.onChange(value)
    }

  render() {
    const {checkBoxLabel, boxValue} = this.props
        return (
            <div>
                <label className="input-field col s6 m3 l3 xl3">
                <input type="checkbox" className="filled-in" checked={this.props.input.value === boxValue} onChange={() => this.handleOnChange(boxValue)}/>
                <span>{checkBoxLabel}</span>
                </label>
            </div>
        )
  }
}

export default NewMusicroomTransactionCheckBox