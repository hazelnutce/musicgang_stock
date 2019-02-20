import React, { Component } from 'react'
import {ErrorProcessNotice} from '../commons/ErrorProcessNotice'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import {reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import {NewTransactionForm} from '../forms/newtransaction/NewTransactionForm'
import M from 'materialize-css'

import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import {fetchItems} from '../../actions/item'

import 'moment/locale/th';
import 'react-day-picker/lib/style.css';

export class AddNewTransactionOut extends Component {
  constructor(props){
    super(props)

    this.state = {
      selectedDay: undefined
    }
  }

  calculateSummaryRow = (itemProperties) => {
    console.log(itemProperties)
    if(itemProperties.itemName != null){
      const filteredItem = this.props.location.state.items.filter(item => item.itemName === itemProperties.itemName)
      if(filteredItem.length !== 1){
        return(
          <h6>ชื่อสินค้าไม่ถูกต้อง</h6>
        )
      }
      else{
        const item = filteredItem[0]
        let total = item.revenue * itemProperties.itemAmount
        if(itemProperties.overcost > 0){
          total += itemProperties.overcost
        }
        if(itemProperties.discount > 0){
          total -= itemProperties.discount
        }
        if(itemProperties.isUsedInMusicGang){
          total = 0
        }
        if(itemProperties.discountBy5 === true && itemProperties.discountBy10 === false){
          total = total * 0.95
        }
        if(itemProperties.discountBy10){
          total = total * 0.9
        }
        
        
        return(
          <div className="section"> 
            <h6>สรุปรายการสินค้า</h6>
            <p>
              ชื่อสินค้า : {item.itemName} <br/> 
              ราคาสินค้า  : {item.revenue} บาท <br />
              จำนวนสินค้า : {itemProperties.itemAmount} ชิ้น <br />
              ราคารวม : {total} บาท
            </p>
          </div>
          
        )
      }
    }
    else{
      return(
        <h6>ไม่มีการระบุสินค้า</h6>
      )
    }

  }

  addOneTransaction(values){
    console.log(values)
  }

  componentDidMount(){
    this.props.initialize({
      itemAmount: 1,
      overcost: 0,
      discountBy5 : false,
      discountBy10 : false
    })
    var elems = document.querySelectorAll('#modal1');
    M.Modal.init(elems, {
      opacity: 0.6,
      endingTop: '20%',
    });
  }

  handleDayChange = (day) => {
    this.setState({ selectedDay: day });
  }

  render() {
    const {stockName, items} = this.props.location.state
    if(stockName == null || items == null){
        return(
            <ErrorProcessNotice />
        )
    }
    return (
      <div className="container" style={{position: "relative", top: "5px"}}>
        <div className="row">
          <h6>นำเข้าสินค้า / คลัง : {stockName}</h6>
        </div>
        <div className="row">
          <label className="left">วันที่นำเข้า</label>
        </div>
        <div className="row" style={{bottom: "35px", position: "relative"}}>
              <DayPickerInput 
                classNames={{
                  container: "input-field col xl6 l8 m8 s12",
                  overlayWrapper: "DayPickerInput-OverlayWrapper",
                  overlay: "DayPickerInput-Overlay"
                }}
                onDayChange={this.handleDayChange} 
                formatDate={formatDate}
                parseDate={parseDate}
                format={"LL"}
                placeholder={`${formatDate(new Date(), 'LL', 'th')}`}
                dayPickerProps={{
                  locale: 'th',
                  localeUtils: MomentLocaleUtils,
                }}
              />
        </div>
        <div className="row" style={{bottom: "35px", position: "relative"}}>
          <div className="col xl12 l12 m12 s12">
            <h6>no record added</h6>
          </div>
          <div className="col xl12 l12 m12 s12">
            <div data-target="modal1" className="waves-effect waves-light btn-small modal-trigger" style={{position: "absolute", left: 0, zIndex: 0}}>
                เพิ่มรายการสินค้า  
            </div>
          </div>
        </div> {/*row*/}
        <div id="modal1" className="modal modal-fixed-footer">
          <div className="modal-content">
              <div className="container-fluid">
                <NewTransactionForm items={items} mode={"Export"}/>
              </div>
              <div className="divider"></div>
              <div className="container-fluid">
                {this.calculateSummaryRow(this.props.itemProperties)}
              </div>
          </div>
          <div className="modal-footer"> 
            <button onClick={this.props.handleSubmit((values) => this.addOneTransaction(values))} className="modal-close waves-effect green btn btn-flat white-text" style={{marginRight: "20px"}}>บันทึก</button>
            <button className="modal-close waves-effect red btn-flat white-text" style={{marginRight: "20px"}}>ยกเลิก</button>
          </div>
        </div>
    </div> //container
    )
  }
}

function validate(values, props){
  const errors = {}

  if(!values.itemName){
      errors.itemName = "กรุณาระบุชื่อสินค้า"
  }

  if(values.itemName){
    var filteredItem = props.location.state.items.filter(item => item.itemName === values.itemName)
    if(filteredItem === null || filteredItem.length === 0){
      errors.itemName = "กรุณาระบุชื่อสินค้าที่มีอยู่ในคลังสินค้า"
    }
  }

  return errors
}

AddNewTransactionOut = reduxForm({
  form: 'newTransactionFormExport',
  validate
})(AddNewTransactionOut)

const selector = formValueSelector('newTransactionFormExport')

AddNewTransactionOut = connect(
  state => {
    const itemProperties = {}
    itemProperties.itemName = selector(state, 'itemName')
    itemProperties.itemAmount = selector(state, 'itemAmount')
    itemProperties.discount = parseInt(selector(state, 'discount'))
    itemProperties.discountBy5 = selector(state, 'discountBy5')
    itemProperties.discountBy10 = selector(state, 'discountBy10')
    itemProperties.isUsedInMusicGang = selector(state, 'isUsedInMusicGang')
    itemProperties.overcost = parseInt(selector(state, 'overcost'))
    return{
      itemProperties,
      items: state.items
    }
  }, {fetchItems}
)(AddNewTransactionOut)

export default AddNewTransactionOut
