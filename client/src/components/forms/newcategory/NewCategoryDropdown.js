import React, { Component } from 'react'
import {connect} from 'react-redux'
import M from 'materialize-css'
import _ from 'lodash'
import {formValueSelector} from 'redux-form'

const marginForInput = {
    marginTop: "25px",
    marginLeft: "25px"
}

const selector = formValueSelector('newCategoryForm')

export class NewCategoryDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
      }

    componentDidMount = () => {
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.stockSelected != prevProps.stockSelected && this.props.stockSelected == null && this.state.value != null){
            this.setState({value: ''})
        }
    }
    

    renderStockList = (stocks) => {
        return _.map(stocks,stock => {
            return <option key={stock._id} value={stock.stockName}>{stock.stockName}</option>
        })
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }
    
    render() {
        return (
            <div className="row">
                <div className="input-field col s8" {...this.props.input} style={marginForInput}>
                    <i className="material-icons prefix">{this.props.icon}</i>
                    <select value={this.state.value} onChange={this.handleChange}>
                        <option value="" disabled>Choose your stock</option>
                        {this.renderStockList(this.props.stocks)}
                    </select>
                    <label>Stock</label>
                </div>
            </div>   
        )
    }
}

function mapStateToProps(state){
    return { 
        stocks: state.category.stockDetails,
        stockSelected: selector(state, 'stockSelector')
    }
}

export default connect(mapStateToProps,null)(NewCategoryDropdown)
