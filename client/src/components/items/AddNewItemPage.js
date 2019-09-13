import React, { Component } from 'react'
import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import ReactNotification from "react-notifications-component";

import {NewItemForm} from '../forms/newitem/NewItemForm'
import {fetchCategory, addNewItems, resetCreateError} from '../../actions/item'
import "react-notifications-component/dist/theme.css";

export class AddNewItemPage extends Component {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
  }

  componentDidMount = () => {
    this.props.fetchCategory()
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
    if(this.props.createError !== prevProps.createError){
      if(this.props.createError != null){
        this.addNotification(this.props.createError)
      }
    }
    if(this.props.category.categories !== prevProps.category.categories){
      let stockName = this.props.history.location.state.stockName
      let categories = this.props.category.categories.filter(item => item.stockName === stockName)
      this.props.initialize({
        category: categories[0].categoryNameTh
      })
    }
  }
  
  render() {
    const {category, history} = this.props
    var currentLocation = this.props.location.pathname.toString()
    var stockId = currentLocation.replace("/items/add/new/", "")
    var stockName = this.props.history.location.state.stockName
    return (
        <div className="container undernav">
          <div className="row" style={{position: "relative", top: "20px"}}>
            <div style={{fontSize: "20px"}}>เพิ่มสินค้า / คลัง : {stockName}</div>
          </div>
          <div className="row" style={{position: "relative", top: "20px"}}>
            <NewItemForm category={category} stockName={stockName}/>
          </div>
          <div className="row" style={{position: "relative", bottom: "30px"}}>
            <button onClick={this.props.handleSubmit((values) => this.props.addNewItems(values, stockId, stockName, history))} className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 green modal-close waves-effect waves-light btn" style={{marginRight: "20px"}}><i className="material-icons right">add_circle</i>Confirm</button>
            <button onClick={() => this.props.history.goBack()} className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>Cancel</button>
          </div>
          <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
              this.props.resetCreateError();
            }} />
        </div>
    )
  }
}

function mapStateToProps(state){
  return {category: state.category, createError: state.item.errorCreateMessage}
}

function validate(values){
  const errors = {}

  if(!values.category){
      errors.category = "กรุณาระบุหมวดหมู่ของสินค้า"
  }

  if(!values.cost){
    errors.cost = "กรุณาระบุต้นทุนของสินค้า"
  }

  if(!values.income){
    errors.income = "กรุณาระบุราคาขายของสินค้า"
  }

  if(!values.initialItem){
    errors.initialItem = "กรุณาระบุจำนวนสินค้าคงคลังเริ่มต้น"
  }

  if(!values.itemName){
    errors.itemName = "กรุณาระบุชื่อของสินค้า"
  }

  if(!values.itemWarning){
    errors.itemWarning = "กรุณาระบุจำนวนสินค้าที่ต้องแจ้งเตือนเมื่อใกล้หมด"
  }

  return errors
}

export default reduxForm({
  form : 'newItemForm',
  validate
})(connect(mapStateToProps,{fetchCategory, addNewItems, resetCreateError})(AddNewItemPage))
