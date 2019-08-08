import React, { Component } from 'react'

export class NewItemCheckbox extends Component {
    handleOnChange(value){
        return this.props.input.onChange(value)
    }

  render() {
    const {checkBoxLabel, boxValue, labelColor, textColor} = this.props
        return (
            <div>
                <label className="input-field col s3 m2 l2 xl2">
                <input type="checkbox" className="filled-in" checked={this.props.input.value === boxValue} onChange={() => this.handleOnChange(boxValue)}/>
                <span><span style={{backgroundColor : labelColor, color: textColor, fontWeight: "bold"}} className="new badge " data-badge-caption={checkBoxLabel}></span></span>
                </label>
            </div>
        )
  }
}

export default NewItemCheckbox
