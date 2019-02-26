import React, { Component } from 'react'
import {ErrorProcessNotice} from '../commons/ErrorProcessNotice'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import {reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import _ from 'lodash'
import M from 'materialize-css'

import {NewTransactionForm} from '../forms/newtransaction/NewTransactionForm'
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
      selectedDay: undefined,
      allRecordedItem: [],
      lastCurrentAction: "create",
      currentItemId: null
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
 
        return(
          <div className="section"> 
            <h6>สรุปรายการสินค้า</h6>
            <p>
              ชื่อสินค้า : {item.itemName} <br/> 
              ราคาสินค้า  : {item.revenue} บาท <br />
              จำนวนสินค้า : {itemProperties.itemAmount} ชิ้น <br />
              ราคารวม : {total.toFixed(2)} บาท
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

  handleCurrentAction(action, item = null){
    this.setState({lastCurrentAction: action, currentItemId: item != null ? item._id : null})
    if(action === "create"){
      this.props.initialize({
        itemName: "",
        itemAmount: 1,
      })
    }
    else if(action === "edit"){
      this.props.initialize({
        itemName: item.itemName,
        itemAmount: item.itemAmount,
        discount: item.formatDiscount,
        overcost: item.formatOvercost
      })
    }
  }

  deleteOneTransaction(transactionId){
    var currentItem = this.state.allRecordedItem
    var arrayIndex = currentItem.findIndex(obj => obj._id === transactionId)
    if(arrayIndex > -1){
      currentItem.splice(arrayIndex, 1)
    }

    //set state with new value
    this.setState({allRecordedItem: currentItem})

  }

  addOneTransaction(values){
    if(this.state.lastCurrentAction === "create"){
      //reset form
      this.props.reset()

      //prepare value
      const {cost, formatCost} = this.filterItem(values.itemName)[0]
      values.discount = parseFloat(values.discount) || 0
      values.formatDiscount = values.discount === "" ? null :  values.discount
      values.overcost = parseFloat(values.overcost) || 0
      values.formatOvercost = values.overcost === "" ? null :  values.overcost
      values.cost = cost
      values.formatCost = formatCost
      values.total = parseFloat(cost * values.itemAmount - (parseFloat(values.discount) || 0) + (parseFloat(values.overcost) || 0))
      values.formatTotal = parseFloat(cost * values.itemAmount - (parseFloat(values.discount) || 0) + (parseFloat(values.overcost) || 0)).toFixed(2)
      values._id = this.guid()

      //set state with new value
      this.setState({allRecordedItem: [...this.state.allRecordedItem, values]})
    }
    else if(this.state.lastCurrentAction === "edit"){
      //reset form
      this.props.reset()

      //prepare value
      const {cost, formatCost} = this.filterItem(values.itemName)[0]
      values.cost = cost
      values.formatCost = formatCost
      values.total = parseFloat(cost * values.itemAmount - (parseFloat(values.discount) || 0) + (parseFloat(values.overcost) || 0))
      values.formatTotal = parseFloat(cost * values.itemAmount - (parseFloat(values.discount) || 0) + (parseFloat(values.overcost) || 0)).toFixed(2)
      var currentItem = this.state.allRecordedItem
      var arrayIndex = currentItem.findIndex(obj => obj._id === this.state.currentItemId)
      values._id = this.guid()
      values.discount = parseFloat(values.discount) || 0
      values.formatDiscount = values.discount === "" ? null :  values.discount
      values.overcost = parseFloat(values.overcost) || 0
      values.formatOvercost = values.overcost === "" ? null :  values.overcost
      currentItem[arrayIndex] = values

      //set state with new value
      this.setState({allRecordedItem: currentItem})
    }
    
  }

  renderRecordedItemBody(){
    if(this.state.allRecordedItem.length !== 0){
      return _.map(this.state.allRecordedItem, item => {
        return (
          <tr key={item._id}>
            <td>{item.itemName}</td>
            <td>{item.formatCost}</td>
            <td>{item.itemAmount}</td>
            <td>{item.formatDiscount != null ? parseFloat(item.formatDiscount).toFixed(2) : "-"}</td>
            <td>{item.formatOvercost != null ? parseFloat(item.formatOvercost).toFixed(2) : "-"}</td>
            <td>{item.formatTotal}</td>
            <td>
              <div className="modal-trigger" onClick={() => this.handleCurrentAction("edit", item)} style={{display: "inline-block", marginRight: "10px", cursor: "pointer"}} data-target="addModal"><i className="material-icons black-text">edit</i></div>
              <div className="modal-trigger" onClick={() => this.deleteOneTransaction(item._id)} style={{display: "inline-block", cursor: "pointer"}} data-target="deleteModal"><i className="material-icons black-text">delete</i></div>
            </td>
            <td>
              <div id={item._id} className="modal">
                <div className="modal-content">
                    <h4>ยืนยันการลบ</h4>
                    <p>คุณต้องการจะลบสินค้า <b>{item.itemName}</b> ใช่หรือไม่ ?</p>
                </div>
                <div className="modal-footer">
                    <button className="green modal-close waves-effect waves-light btn" style={{position: "relative", right: "20px"}}><i className="material-icons right">add_circle</i>ยืนยัน</button> 
                    <button className="red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>ยกเลิก</button>
                </div>
              </div>
            </td>
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
        <thead>
          <tr>
              <td style={{textAlign: "center"}}>ชื่อสินค้า</td>
              <td style={{textAlign: "center"}}>ราคา</td>
              <td style={{textAlign: "center"}}>จำนวนสินค้า</td>
              <td style={{textAlign: "center"}}>ส่วนลด</td>
              <td style={{textAlign: "center"}}>คิดเงินเกิน</td>
              <td style={{textAlign: "center"}}>ราคารวม</td>
              <td style={{textAlign: "center"}}></td>
          </tr>
        </thead>

        <tbody>
            {this.renderRecordedItemBody()}
        </tbody>
      </table>  
    )
  }

  calculateTotalCost(){
    var currentItem = this.state.allRecordedItem
    var total = currentItem.reduce(function(prev, cur) {
      return prev + cur.total;
    }, 0);

    return parseFloat(total).toFixed(2)
  }

  componentDidMount(){
    this.props.initialize({
      itemAmount: 1,
      discountBy5 : false,
      discountBy10 : false
    })
    var elems = document.querySelectorAll('#addModal');
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
    const {invalid} = this.props
    var submitButtonClassName = invalid ? "disabled" : ""
    if(stockName == null || items == null){
        return(
            <ErrorProcessNotice />
        )
    }
    return (
      <div className="container" style={{position: "relative", top: "5px"}}>
        <div className="row">
          <h6>นำออกสินค้า / คลัง : {stockName}</h6>
        </div>
        <div className="row">
          <label className="left">วันที่นำออก</label>
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
            {this.state.allRecordedItem.length === 0 ? 
            <div className="card-panel yellow darken-1">
              <span className="white-text">
                <span><i className="material-icons" style={{marginLeft: "10px",top:"5px",position:"relative"}}>warning</i></span>
                <span style={{marginLeft: "10px"}}>ไม่มีรายการที่ต้องการบันทึก กรุณาเพิ่มรายการสินค้า</span>
              </span>
            </div> : 
              this.renderRecordedItem()
            }
          </div>
          <div className="col xl12 l12 m12 s12">
            <h6 className="right">ยอดรวม : {this.calculateTotalCost()}</h6>
          </div>
          <div className="col xl12 l12 m12 s12" style={{marginTop: "10px"}}>
            <div onClick={() => this.handleCurrentAction("create")} data-target="addModal" className="waves-effect waves-light btn-small modal-trigger" style={{position: "absolute", left: 0, zIndex: 0}}>
                เพิ่มรายการสินค้า  
            </div>
          </div>
        </div> {/*row*/}
        <div id="addModal" className="modal modal-fixed-footer">
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
            <button onClick={this.props.handleSubmit((values) => this.addOneTransaction(values))} className={`modal-close waves-effect waves-light btn-small green white-text ${submitButtonClassName}`} style={{marginRight: "20px"}}>บันทึก</button>
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
    else if(filteredItem.length === 1){
      if(parseFloat(values.discount) >= filteredItem[0].cost){
        errors.discount = "ส่วนลดสินค้าต้องน้อยกว่าราคาสินค้า"
      }
    }
  }

  if(parseFloat(values.overcost) >= 1000){
    errors.overcost = "ส่วนเกินสินค้าไม่ควรเกิน 1,000 บาท"
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
    itemProperties.isUsedInMusicGang = selector(state, 'isUsedInMusicGang')
    itemProperties.overcost = parseFloat(selector(state, 'overcost'))
    itemProperties.discount = parseFloat(selector(state, 'discount'))
    return{
      itemProperties,
      items: state.items
    }
  }, {fetchItems}
)(AddNewTransactionOut)

export default AddNewTransactionOut
