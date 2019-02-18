import React, { Component } from 'react'

export class NewTransactionCheckbox extends Component {

    handleOnChange(){
        return this.props.input.onChange(!this.props.input.value)
    }

    render() {
        const {checkBoxLabel} = this.props
        return (
            <div>
                <label className="input-field col s12 m4 l3 xl3">
                <input type="checkbox" className="filled-in" onChange={() => this.handleOnChange()} checked={this.props.input.value} />
                <span>{checkBoxLabel}</span>
                </label>
            </div>
        )
    }
}

export default NewTransactionCheckbox
