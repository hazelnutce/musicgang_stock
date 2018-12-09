import React, { Component } from 'react'
import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import {NewItemForm} from '../forms/newitem/NewItemForm'
import {fetchCategory, addNewItems} from '../../actions/item'

export class AddNewItemPage extends Component {
  componentDidMount = () => {
    this.props.fetchCategory()
  }
  
  render() {
    const {category, history} = this.props
    var currentLocation = this.props.location.pathname.toString()
    var stockId = currentLocation.replace("/items/add/new/", "")
    var stockName = this.props.history.location.state.stockName
    return (
        <div className="container" style={{position: "relative", top: "5px"}}>
          <div className="row">
            <h5>เพิ่มสินค้า</h5>
          </div>
          <div className="row" style={{position: "relative", bottom: "10px"}}>
            <NewItemForm category={category} stockId={stockId}/>
          </div>
          <div className="row">
            <button onClick={this.props.handleSubmit((values) => this.props.addNewItems(values, stockId, stockName, history))} className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 green modal-close waves-effect waves-light btn" style={{marginRight: "20px"}}><i className="material-icons right">add_circle</i>Confirm</button> 
            <Link to={{ state: {stockName}, pathname: `/items/${stockId}`}} className="col xl2 push-xl7 l2 push-l7 m3 push-m6 s5 push-s2 red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>Cancel</Link>
          </div>
        </div>
    )
  }
}

function mapStateToProps(state){
  return {category: state.category}
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
})(connect(mapStateToProps,{fetchCategory, addNewItems})(AddNewItemPage))
