import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export class NewCategoryDropdown extends Component {

    handleStockNameChange = (e) => {
        e.preventDefault()
        return this.props.input.onChange(e.target.value)
    }

    render() {
        const {faRequire,icon} = this.props
        if(faRequire){
            return(
                <div className="input-field col s12 m6 l6 xl6">
                    <i className="material-icons prefix"><FontAwesomeIcon icon={icon}/></i>
                    <select onChange={(e) => this.handleStockNameChange(e)}>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                    </select>
                    <label>Materialize Select</label>
                </div>     
            )
        }
    }
}

export default NewCategoryDropdown
