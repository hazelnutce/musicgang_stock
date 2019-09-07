import React, { Component } from 'react'
import {ErrorProcessNotice} from '../commons/ErrorProcessNotice'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import {reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import _ from 'lodash'
import M from 'materialize-css'
import ReactNotification from "react-notifications-component";

import {NewTransactionForm} from '../forms/newtransaction/NewTransactionForm'
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import {fetchItems} from '../../actions/item'
import {exportNewTransaction} from '../../actions/transaction'
import {handleOnChangeInCurrentItem, resetExportTransactionError} from '../../actions/transaction'

import 'moment/locale/th';
import 'react-day-picker/lib/style.css';

export class AddNewTransactionOut extends Component {
  constructor(props){
    super(props)

    this.notificationDOMRef = React.createRef();
    this.state = {
      selectedDay: undefined,
      allRecordedItem: [],
      lastCurrentAction: "create",
      currentItemId: null,
      resetSignal: false,
      editSignal: false
    }
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

  numberWithCommas(x) {
    if(x != null){
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
    return null
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
              ราคาสินค้า  : {this.numberWithCommas(parseFloat(item.revenue).toFixed(2))} บาท <br />
              จำนวนสินค้า : {itemProperties.itemAmount} ชิ้น <br />
              ราคารวม : {this.numberWithCommas(parseFloat(total).toFixed(2))} บาท
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
      this.setState({resetSignal: true}, () => {
        this.props.initialize({
          itemName: "",
          itemAmount: 1,
          isUsedInMusicGang: false
        })
      })
      setTimeout(() => {
        this.setState({resetSignal: false})
      }, 250)
      
    }
    else if(action === "edit"){
      if(item.formatDiscount !== "0.00" || item.formatOvercost !== "0.00"){
        this.setState({editSignal: true}, () => {
          this.props.initialize({
            itemName: item.itemName,
            itemAmount: item.itemAmount,
            discount: item.formatDiscount,
            overcost: item.formatOvercost,
            isUsedInMusicGang: item.isUsedInMusicGang
          })
        })
        setTimeout(() => {
          this.setState({editSignal: false})
        }, 250)
      }
      else{
        this.props.initialize({
          itemName: item.itemName,
          itemAmount: item.itemAmount,
          discount: item.formatDiscount,
          overcost: item.formatOvercost,
          isUsedInMusicGang: item.isUsedInMusicGang
        })
      }
      
    }
  }

  deleteOneTransaction(transactionId){
    var currentItem = this.state.allRecordedItem
    var arrayIndex = currentItem.findIndex(obj => obj._id === transactionId)
    if(arrayIndex > -1){
      currentItem.splice(arrayIndex, 1)
    }

    //set state with new value
    this.setState({allRecordedItem: currentItem}, () => {
      this.props.handleOnChangeInCurrentItem(this.state.allRecordedItem)
    })

  }

  addOneTransaction(values){
    if(this.state.lastCurrentAction === "create"){
      //reset form
      this.props.reset()
      this.setState({resetSignal: true})
      setTimeout(() => {
        this.setState({resetSignal: false})
      }, 250)

      //prepare value
      const {revenue, formatRevenue} = this.filterItem(values.itemName)[0]
      values.discount = parseFloat(values.discount) || 0
      values.formatDiscount = this.numberWithCommas(values.discount === "" ? null :  parseFloat(values.discount).toFixed(2))
      values.overcost = parseFloat(values.overcost) || 0
      values.formatOvercost = this.numberWithCommas(values.overcost === "" ? null :  parseFloat(values.overcost).toFixed(2))
      values.revenue = revenue
      values.formatRevenue = this.numberWithCommas(formatRevenue)
      values.total = parseFloat(revenue * values.itemAmount - (parseFloat(values.discount) || 0) + (parseFloat(values.overcost) || 0))
      values.formatTotal = this.numberWithCommas(parseFloat(revenue * values.itemAmount - (parseFloat(values.discount) || 0) + (parseFloat(values.overcost) || 0)).toFixed(2))
      values.type = "export"
      values._id = this.guid()
      if(values.isUsedInMusicGang === true){
        values.total = 0
        values.formatTotal = "0.00"
        values.discount = 0
        values.formatDiscount = "0.00"
        values.overcost = 0
        values.formatOvercost = "0.00"
      }

      //set state with new value
      this.setState({allRecordedItem: [...this.state.allRecordedItem, values]}, () => {
        this.props.handleOnChangeInCurrentItem(this.state.allRecordedItem)
      })
    }
    else if(this.state.lastCurrentAction === "edit"){
      //reset form
      this.props.reset()
      this.setState({resetSignal: true})
      setTimeout(() => {
        this.setState({resetSignal: false})
      }, 250)

      //prepare value
      const {revenue, formatRevenue} = this.filterItem(values.itemName)[0]
      values.revenue = revenue
      values.formatRevenue = this.numberWithCommas(formatRevenue)
      values.total = parseFloat(revenue * values.itemAmount - (parseFloat(values.discount) || 0) + (parseFloat(values.overcost) || 0))
      values.formatTotal = this.numberWithCommas(parseFloat(revenue * values.itemAmount - (parseFloat(values.discount) || 0) + (parseFloat(values.overcost) || 0)).toFixed(2))
      var currentItem = this.state.allRecordedItem
      var arrayIndex = currentItem.findIndex(obj => obj._id === this.state.currentItemId)
      values._id = this.guid()
      values.discount = parseFloat(values.discount) || 0
      values.formatDiscount = this.numberWithCommas(values.discount === "" ? null :  parseFloat(values.discount).toFixed(2))
      values.overcost = parseFloat(values.overcost) || 0
      values.formatOvercost = this.numberWithCommas(values.overcost === "" ? null :  parseFloat(values.overcost).toFixed(2))
      values.type = "export"
      if(values.isUsedInMusicGang === true){
        values.total = 0
        values.formatTotal = "0.00"
        values.discount = 0
        values.formatDiscount = "0.00"
        values.overcost = 0
        values.formatOvercost = "0.00"
      }
      currentItem[arrayIndex] = values

      //set state with new value
      this.setState({allRecordedItem: currentItem}, () => {
        this.props.handleOnChangeInCurrentItem(this.state.allRecordedItem)
      })
    }
    
  }

  renderRecordedItemBody(){
    if(this.state.allRecordedItem.length !== 0){
      return _.map(this.state.allRecordedItem, item => {
        return (
          <tr key={item._id}>
            <td>{item.itemName}</td>
            <td>{item.formatRevenue}</td>
            <td>{item.itemAmount}</td>
            <td>{item.formatDiscount != null && item.isUsedInMusicGang === false ? item.formatDiscount : "-"}</td>
            <td>{item.formatOvercost != null && item.isUsedInMusicGang === false ? item.formatOvercost : "-"}</td>
            <td>{item.isUsedInMusicGang === false ? item.formatTotal : "0.00"}</td>
            <td>
              <div className="modal-trigger" onClick={() => this.handleCurrentAction("edit", item)} style={{display: "inline-block", marginRight: "10px", cursor: "pointer"}} data-target="addModal"><i className="material-icons black-text">edit</i></div>
              <div onClick={() => this.deleteOneTransaction(item._id)} style={{display: "inline-block", cursor: "pointer"}}><i className="material-icons black-text">delete</i></div>
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
    var currentItem = this.state.allRecordedItem.filter(x => x.isUsedInMusicGang === false)
    var total = currentItem.reduce(function(prev, cur) {
      return prev + cur.total;
    }, 0);

    return this.numberWithCommas(parseFloat(total).toFixed(2))
  }

  componentDidMount(){
    this.props.initialize({
      itemAmount: 1,
      isUsedInMusicGang: false
    })
    var elems = document.querySelectorAll('#addModal');
    M.Modal.init(elems, {
      opacity: 0.6,
      endingTop: '20%',
    });
  }

  componentDidUpdate = (prevProps) => {
    if(this.props.transaction.transactionExportError !== prevProps.transaction.transactionExportError)
    {
      if(this.props.transaction.transactionExportError != null){
        this.addNotification(this.props.transaction.transactionExportError)
      }
    }
  }

  handleDayChange = (day) => {
    if((day instanceof Date)){
      this.setState({ selectedDay: day });
    }
  }

  addTransactions = (values, history) => {
    const {stockId} = this.props.location.state
    if(values.day === null || values.day === undefined){
      values.day = new Date()
    }
    values.record.forEach((e) => {
      return(
        e.day = values.day,
        e._stock = stockId
      )
    })
    this.props.exportNewTransaction(values.record, history)
  }

  render() {
    const {stockName, items} = this.props.location.state
    const {invalid, history, itemProperties, handleSubmit } = this.props
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
        <div className="divider"></div>
        <div className="col xl12 l12 m12 s12" style={{marginTop: "10px"}}>
          <div onClick={() => history.goBack()} className="waves-effect waves-light btn-small right red">
              ยกเลิก  
          </div>
          <div onClick={() => this.addTransactions({day: this.state.selectedDay, record: this.state.allRecordedItem}, history)} className={`waves-effect waves-light btn-small right green ${this.state.allRecordedItem.length === 0 ? "disabled" : ""}`} 
              style={{marginRight: "10px"}}>
              บันทึก  
          </div>
        </div>
        <div id="addModal" className="modal modal-fixed-footer">
          <div className="modal-content">
              <div className="container-fluid">
                <NewTransactionForm items={items} mode={"Export"} resetSignal={this.state.resetSignal} editSignal={this.state.editSignal}/>
              </div>
              <div className="divider"></div>
              <div className="container-fluid">
                {this.calculateSummaryRow(itemProperties)}
              </div>
          </div>
          <div className="modal-footer"> 
            <button onClick={handleSubmit((values) => this.addOneTransaction(values))} className={`modal-close waves-effect waves-light btn-small green white-text ${submitButtonClassName}`} style={{marginRight: "20px"}}>บันทึก</button>
            <button className="modal-close waves-effect red btn-flat white-text" style={{marginRight: "20px"}}>ยกเลิก</button>
          </div>
        </div>
        <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
            this.props.resetExportTransactionError()
         }} />
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
    var filteredCurrentList = null
    if(props.transaction.currentItemList !== null){
      filteredCurrentList = props.transaction.currentItemList.filter(item => item.itemName === values.itemName)
    }

    var currentItemAmount = 0
    if(filteredCurrentList != null){
      currentItemAmount = filteredCurrentList.reduce(function(prev, cur) {
        return prev + cur.itemAmount;
      }, 0);
    }
    
    
    if(filteredItem === null || filteredItem.length === 0){
      errors.itemName = "กรุณาระบุชื่อสินค้าที่มีอยู่ในคลังสินค้า"
    }
    else if(filteredItem.length === 1){
      if(parseFloat(values.discount) >= filteredItem[0].revenue * values.itemAmount){
        errors.discount = "ส่วนลดสินค้าต้องน้อยกว่าราคาสินค้า"
      }

      if(values.itemAmount > filteredItem[0].itemRemaining - currentItemAmount){
        var remainingItem = filteredItem[0].itemRemaining - currentItemAmount
        if(remainingItem === 0){
          errors.itemAmount = `สินค้าหมด`
        }
        else{
          errors.itemAmount = `มากสุด : ${remainingItem}`
        }
        
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
      items: state.items,
      transaction : state.transaction
    }
  }, {fetchItems, handleOnChangeInCurrentItem, exportNewTransaction, resetExportTransactionError}
)(AddNewTransactionOut)

export default AddNewTransactionOut
