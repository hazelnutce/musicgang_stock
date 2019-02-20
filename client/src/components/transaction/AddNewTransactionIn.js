import React, { Component } from 'react'
import {ErrorProcessNotice} from '../commons/ErrorProcessNotice'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import {reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import _ from 'lodash'
import M from 'materialize-css'

import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import {fetchItems} from '../../actions/item'
import {NewTransactionForm} from '../forms/newtransaction/NewTransactionForm'
import 'moment/locale/th';
import 'react-day-picker/lib/style.css';

export class AddNewTransactionIn extends Component {
  constructor(props){
    super(props)

    this.state = {
      selectedDay: undefined,
      allRecordedItem: []
    }
  }

  filterItem(itemName){
    return this.props.location.state.items.filter(item => item.itemName === itemName)
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  calculateSummaryRow = (itemProperties) => {
    if(itemProperties.itemName != null){
      const filteredItem = this.filterItem(itemProperties.itemName)
      if(filteredItem.length !== 1){
        return(
          <h6>ชื่อสินค้าไม่ถูกต้อง</h6>
        )
      }
      else{
        const item = filteredItem[0]
        let total = item.cost * itemProperties.itemAmount
        if(itemProperties.overcost > 0){
          total += itemProperties.overcost
        }
        if(itemProperties.discount > 0){
          total -= itemProperties.discount
        }

        return(
          <div className="section"> 
            <h6>สรุปรายการสินค้า</h6>
            <p>
              ชื่อสินค้า : {item.itemName} <br/> 
              ราคาสินค้า  : {parseFloat(item.cost).toFixed(2)} บาท <br />
              จำนวนสินค้า : {itemProperties.itemAmount} ชิ้น <br />
              ราคารวม : {parseFloat(total).toFixed(2)} บาท
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
    const {cost, formatCost} = this.filterItem(values.itemName)[0]
    values.cost = formatCost
    values.total = parseFloat(cost * values.itemAmount - (parseInt(values.discount) || 0) + (parseInt(values.overcost) || 0)).toFixed(2)
    values._id = this.guid()
    this.setState({allRecordedItem: [...this.state.allRecordedItem, values]})
  }

  renderRecordedItemBody(){
    if(this.state.allRecordedItem.length !== 0){
      return _.map(this.state.allRecordedItem, item => {
        return (
          <tr key={item._id}>
            <td>{item.itemName}</td>
            <td>{item.cost}</td>
            <td>{item.itemAmount}</td>
            <td>{item.discount != null ? item.discount : "-"}</td>
            <td>{item.overcost != null ? item.overcost : "-"}</td>
            <td>{item.total}</td>
          </tr>
        )
      })
    }
    else{
      return null
    }
  }

  renderRecordedItem(){
    return(
      <table className="highlight reponsive-table centered">
        <thead >
          <tr>
              <td style={{textAlign: "center"}}>ชื่อสินค้า</td>
              <td style={{textAlign: "center"}}>ราคา</td>
              <td style={{textAlign: "center"}}>จำนวนสินค้า</td>
              <td style={{textAlign: "center"}}>ส่วนลด</td>
              <td style={{textAlign: "center"}}>คิดเงินเกิน</td>
              <td style={{textAlign: "center"}}>ราคารวม</td>
          </tr>
        </thead>

        <tbody>
            {this.renderRecordedItemBody()}
        </tbody>
      </table>  
    )
    
  }

  componentDidMount(){
    this.props.initialize({
      itemAmount: 1,
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
            {this.state.allRecordedItem.length === 0 ? <div>No record</div> : 
              this.renderRecordedItem()
            }
          </div>
          <div className="col xl12 l12 m12 s12" style={{marginTop: "10px"}}>
            <div data-target="modal1" className="waves-effect waves-light btn-small modal-trigger" style={{position: "absolute", left: 0, zIndex: 0}}>
                เพิ่มรายการสินค้า  
            </div>
          </div>
        </div> {/*row*/}
        <div id="modal1" className="modal modal-fixed-footer">
          <div className="modal-content">
              <div className="container-fluid">
                <NewTransactionForm items={items} mode={"Import"}/>
              </div>
              <div className="divider"></div>
              <div className="container-fluid">
                {this.calculateSummaryRow(this.props.itemProperties)}
              </div>
          </div>
          <div className="modal-footer"> 
            <div onClick={this.props.handleSubmit((values) => this.addOneTransaction(values))} className="modal-close waves-effect waves-light btn-small green white-text" style={{marginRight: "20px"}}>บันทึก</div>
            <div className="modal-close waves-effect waves-light btn-small red white-text" style={{marginRight: "20px"}}>ยกเลิก</div>
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
    else if(filteredItem.length === 1){
      if(parseInt(values.discount) >= filteredItem[0].cost){
        errors.discount = "ส่วนลดสินค้าต้องน้อยกว่าราคาสินค้า"
      }
    }
  }

  if(parseInt(values.overcost) >= 1000){
    errors.overcost = "ส่วนเกินสินค้าไม่ควรเกิน 1,000 บาท"
  }

  return errors
}

AddNewTransactionIn = reduxForm({
  form: 'newTransactionFormImport',
  validate
})(AddNewTransactionIn)

const selector = formValueSelector('newTransactionFormImport')

AddNewTransactionIn = connect(
  state => {
    const itemProperties = {}
    itemProperties.itemName = selector(state, 'itemName')
    itemProperties.itemAmount = selector(state, 'itemAmount')
    itemProperties.discount = parseInt(selector(state, 'discount'))
    itemProperties.overcost = parseInt(selector(state, 'overcost'))
    return{
      itemProperties,
      items: state.items
    }
  }, {fetchItems}
)(AddNewTransactionIn)

export default AddNewTransactionIn

