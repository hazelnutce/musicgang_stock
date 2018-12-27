import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash'

export class NewCategoryDropdown extends Component {

    handleStockNameChange = (e) => {
        e.preventDefault()
        return this.props.input.onChange(e.target.value)
    }

    renderOption(stocks){
        return _.map(stocks, stock => {
            return <option value={stock.stockName} key={stock._id}>{stock.stockName}</option>
        })
    }

    render() {
        const {faRequire,icon} = this.props
        if(faRequire){
            return(
                <div className="input-field col s12 m6 l6 xl6">
                    <i className="material-icons prefix"><FontAwesomeIcon icon={icon}/></i>
                    <select onChange={(e) => this.handleStockNameChange(e)}>
                        {this.renderOption(this.props.stockName)}
                    </select>
                    <label>คลังสินค้า</label>
                </div>     
            )
        }
    }
}

export default NewCategoryDropdown
