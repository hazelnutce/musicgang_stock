import React, { Component } from 'react'

export class NewItemCheckboxBoolean extends Component {
    handleOnChange(){
        return this.props.input.onChange(!this.props.input.value)
    }

    render() {
        const {checkBoxLabel} = this.props
        return (
            <div>
                <label className="input-field col s12 m6 l6 xl6">
                <input type="checkbox" className="filled-in" onChange={() => this.handleOnChange()} checked={this.props.input.value} />
                <span>{checkBoxLabel}</span>
                </label>
            </div>
        )
    }
}

export default NewItemCheckboxBoolean