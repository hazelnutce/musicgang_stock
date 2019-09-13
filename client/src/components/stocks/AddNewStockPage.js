import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import ReactNotification from "react-notifications-component";

import NewStockForm from '../forms/newstock/NewStockForm'
import {addNewStock, resetErrorCreateStock} from '../../actions/stock'
import "react-notifications-component/dist/theme.css";


export class AddNewStockPage extends Component {
    constructor(props) {
        super(props);
        this.notificationDOMRef = React.createRef();
    }

    addNotification = (message) => {
        this.notificationDOMRef.current.addNotification({
          title: "ข้อผิดพลาด",
          message: message,
          type: "danger",
          insert: "buttom",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 },
          dismissable: { click: true }
        });
    }

    componentDidUpdate(prevProps){
        if(this.props.stocks.errorCreateStock !== prevProps.stocks.errorCreateStock){
          if(this.props.stocks.errorCreateStock != null){
            this.addNotification(this.props.stocks.errorCreateStock)
          }
        }
      }

    render() {
        const {history} = this.props
        return (
        <div className="container undernav">
            <div className="row">
                <h5 className="header col s6">เพิ่มคลังสินค้า
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
                    <button onClick={this.props.handleSubmit((values) => this.props.addNewStock(values,history))} className="green waves-effect waves-light btn" style={{position: "relative", right: "10px"}}><i className="material-icons right">add_circle</i>ยืนยัน</button>
                    <Link to="/stocks" className="red waves-effect waves-light btn"><i className="material-icons right">cancel</i>ยกเลิก</Link>
                </span>   
            </div>
            <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
              this.props.resetErrorCreateStock()
            }} />
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
})(connect(mapStateToProps,{addNewStock,resetErrorCreateStock})(withRouter(AddNewStockPage)))
