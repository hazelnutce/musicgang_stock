import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'

import NewStockForm from '../forms/newstock/NewStockForm'
import {addNewStock} from '../../actions/stock'

export class AddNewStockPage extends Component {
  render() {
    return (
      <div className="container" style={{position: "relative", top: "5px"}}>
        <div className="row">
            <h5 className="header col s6">Add new stock
                <i className="material-icons" style={{marginLeft: "10px"}}>input</i>
            </h5>
        </div>
        <div className="row">
            <div className="card small col s12 yellow lighten-4" style={{height: "150px"}}>
                <NewStockForm />
            </div>
        </div>
        <div className="row">    
            <a onClick={this.props.handleSubmit((values) => this.props.addNewStock(values))} className="green waves-effect waves-light btn col s2 offset-s7" style={{position: "relative", left: "75px"}}><i className="material-icons right">add_circle</i>Add stock</a>
            <Link to="/stocks" className="red waves-effect waves-light btn col s2 offset-s1"><i className="material-icons right">cancel</i>Cancel</Link>
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
})(connect(null,{addNewStock})(AddNewStockPage))
