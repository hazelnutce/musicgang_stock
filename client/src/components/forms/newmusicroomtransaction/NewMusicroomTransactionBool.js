import React, { Component } from 'react'

export class NewMusicroomTransactionBool extends Component {
    handleOnChange(value){
        return this.props.input.onChange(value)
    }

  render() {
    const {checkBoxLabel, classNameForWidth} = this.props
    if(this.props.input.value === null || this.props.input.value === undefined){
        this.props.input.onChange(false)
    }
    return (
        <div>
            <label className={`input-field col ${classNameForWidth}`}>
            <input type="checkbox" className="filled-in" onChange={() => this.handleOnChange(!this.props.input.value)} checked={this.props.input.value === true} />
            <span>{checkBoxLabel}</span>
            </label>
        </div>
    )
  }
}

export default NewMusicroomTransactionBool
