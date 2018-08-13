import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'

import NewStockForm from '../forms/newstock/NewStockForm'
import {addNewStock} from '../../actions/stock'

export class AddNewStockPage extends Component {
  render() {
    const {history} = this.props
    return (
      <div className="container" style={{position: "relative", top: "5px"}}>
        <div className="row">
            <h5 className="header col s6">Add new stock
                <i className="material-icons" style={{marginLeft: "10px"}}>input</i>
            </h5>
        </div>
        <div className="row">
            <div className="card small col s12 amber lighten-1" style={{height: "150px"}}>
                <NewStockForm />
            </div>
        </div>
        <div className="row">
            <span className="right">
                <a onClick={this.props.handleSubmit((values) => this.props.addNewStock(values,history))} className="green waves-effect waves-light btn" style={{position: "relative", right: "10px"}}><i className="material-icons right">add_circle</i>Add stock</a>
                <Link to="/stocks" className="red waves-effect waves-light btn"><i className="material-icons right">cancel</i>Cancel</Link>
            </span>   
        </div>
        <div>
        
        </div>
      </div>
    )
  }
}

function validate(values){
    const errors = {}

    if(!values.stockName){
         errors.stockName = "you must provide a stock name"
    }

    if(!values.description){
        errors.description = "you must provide a description"
    }

    return errors
}

export default reduxForm({
    form : 'newStockForm',
    validate
})(connect(null,{addNewStock})(withRouter(AddNewStockPage)))
