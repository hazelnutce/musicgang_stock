import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'

import NewStockForm from '../forms/newstock/NewStockForm'
import {addNewStock,clearErrorCreateStock} from '../../actions/stock'
import {ErrorFormNotification} from '../commons/ErrorFormNotification'

export class AddNewStockPage extends Component {
  render() {
    const {history,stocks,clearErrorCreateStock} = this.props
    return (
      <div className="container" style={{position: "relative", top: "5px"}}>
        <div className="row">
            <h5 className="header col s6">เพิ่มคลังสินค้า
                <i className="material-icons" style={{marginLeft: "10px"}}>input</i>
            </h5>
        </div>
        {
            stocks.errorCreateStock !== "" &&
             <ErrorFormNotification errorMessage={stocks.errorCreateStock} clearErrorMessage={clearErrorCreateStock} specificColumn={"col s12"}/>
          }
        <div className="row">
            <div className="card small col s12 amber lighten-1" style={{height: "150px"}}>
                <NewStockForm />
            </div>
        </div>
        <div className="row">
            <span className="right">
                <a onClick={this.props.handleSubmit((values) => this.props.addNewStock(values,history))} className="green waves-effect waves-light btn" style={{position: "relative", right: "10px"}}><i className="material-icons right">add_circle</i>ยืนยัน</a>
                <Link to="/stocks" className="red waves-effect waves-light btn"><i className="material-icons right">cancel</i>ยกเลิก</Link>
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
         errors.stockName = "กรุณาระบุชื่อคลังสินค้า"
    }

    if(!values.description){
        errors.description = "กรุณาระบุคำจำกัดความของคลังสินค้านี้"
    }

    return errors
}

function mapStateToProps(state){
    return {stocks : state.stocks}
}

export default reduxForm({
    form : 'newStockForm',
    validate
})(connect(mapStateToProps,{addNewStock,clearErrorCreateStock})(withRouter(AddNewStockPage)))
