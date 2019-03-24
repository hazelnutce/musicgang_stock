import React, { Component } from 'react'
import {connect} from 'react-redux'
import {reduxForm, formValueSelector} from 'redux-form'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import MomentLocaleUtils, {
    formatDate,
    parseDate,
  } from 'react-day-picker/moment';

import {EditTransactionForm} from '../forms/newtransaction/EditTransactionForm'
import {ErrorProcessNotice} from '../commons/ErrorProcessNotice'

export class EditTransaction extends Component {
    constructor(props){
        super(props)
        
        var {itemDay} = this.props.location.state
        this.state = {
          selectedDay: itemDay,
          editSignal: false
        }
      }

    handleDayChange = (day) => {
        if((day instanceof Date)){
            this.setState({ selectedDay: day });
        }
    }

    componentDidMount = () => {
        const {itemName, itemAmount, formatDiscount, formatOvercost, isExportMode, isUsedInMusicGang } = this.props.location.state
        this.setState({editSignal: true}, () => {
            if(isExportMode){
                this.props.initialize({
                    itemName: itemName,
                    itemAmount: itemAmount,
                    discount: formatDiscount,
                    overcost: formatOvercost,
                    isUsedInMusicGang: isUsedInMusicGang
                })
            }
            else{
                this.props.initialize({
                    itemName: itemName,
                    itemAmount: itemAmount,
                    discount: formatDiscount,
                    overcost: formatOvercost
                })
            }
            
        })
        setTimeout(() => {
            this.setState({editSignal: false})
          }, 250)
        
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

    filterItem(itemName){
      return this.props.location.state.items.filter(item => item.itemName === itemName)
    }

    modifyTransaction = (values) => {
      const {isExportMode, _id} = this.props.location.state
      if(isExportMode){
        console.log(values)
        const {revenue, formatRevenue} = this.filterItem(values.itemName)[0]
        values.revenue = revenue
        values.formatRevenue = this.numberWithCommas(formatRevenue)
        values.total = parseFloat(revenue * values.itemAmount - (parseFloat(values.discount) || 0) + (parseFloat(values.overcost) || 0))
        values.formatTotal = this.numberWithCommas(parseFloat(revenue * values.itemAmount - (parseFloat(values.discount) || 0) + (parseFloat(values.overcost) || 0)).toFixed(2))
        values._id = _id
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
      }
      else{
        console.log(values)
        const {revenue, formatRevenue} = this.filterItem(values.itemName)[0]
        values.revenue = revenue
        values.formatRevenue = this.numberWithCommas(formatRevenue)
        values.total = parseFloat(revenue * values.itemAmount - (parseFloat(values.discount) || 0) + (parseFloat(values.overcost) || 0))
        values.formatTotal = this.numberWithCommas(parseFloat(revenue * values.itemAmount - (parseFloat(values.discount) || 0) + (parseFloat(values.overcost) || 0)).toFixed(2))
        values._id = _id
        values.discount = parseFloat(values.discount) || 0
        values.formatDiscount = this.numberWithCommas(values.discount === "" ? null :  parseFloat(values.discount).toFixed(2))
        values.overcost = parseFloat(values.overcost) || 0
        values.formatOvercost = this.numberWithCommas(values.overcost === "" ? null :  parseFloat(values.overcost).toFixed(2))
        values.type = "import"
      }
      
    }

    render() {
        const {_id, itemName, items, isExportMode} = this.props.location.state
        const {itemProperties, invalid, handleSubmit, history} = this.props
        var submitButtonClassName = invalid ? "disabled" : ""
        if(itemName == null || _id == null || items == null){
            return(
                <ErrorProcessNotice />
            )
        }
        return (
            <div className="container" style={{position: "relative", top: "5px"}}>
                <div className="row">
                    <h6>เปลี่ยนแปลงรายการสินค้า</h6>
                </div>
                <div className="row">
                    <label className="left">{isExportMode ? "วันที่นำออก" : "วันที่นำเข้า"}</label>
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
                        value={this.state.selectedDay}
                        />
                      <div className="col xl6 l4 m4 s12">
                        <button className={`waves-effect waves-light btn-small amber darken-4 white-text right`} style={{marginRight: "20px"}}>{isExportMode ? "คืนสินค้าสู่คลัง" : "คืนสินค้าสู่ผู้จำหน่าย"}</button>
                      </div>
                      <div className="col xl12 l12 m12 s12">
                            รายละเอียดสินค้า
                        </div>
                        <div className="col xl12 l12 m12 s12" style={{position: "relative", top: "10px"}}>
                            <EditTransactionForm items={items} editSignal={this.state.editSignal} isExportMode={isExportMode}/>
                            <div className="divider"></div>
                            <div className="container-fluid">
                              {this.calculateSummaryRow(itemProperties)}
                            </div>
                            <div className="divider"></div>
                            <div className="container-fluid">
                              <div className="row" style={{position: "relative", top: "5px"}}>
                                  <button onClick={handleSubmit((values) => this.modifyTransaction(values))} className={`waves-effect waves-light btn-small green white-text ${submitButtonClassName}`} style={{marginRight: "20px"}}>บันทึก</button>
                                  <button onClick={() => history.goBack()} className="waves-effect red btn-small white-text" style={{marginRight: "20px"}}>ยกเลิก</button>
                              </div>
                            </div>
                        </div>
                    </div>
                <div className="row">
                </div>
            </div>
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
        if(parseFloat(values.discount) >= filteredItem[0].revenue * values.itemAmount){
          errors.discount = "ส่วนลดสินค้าต้องน้อยกว่าราคาสินค้า"
        }
        
        if(values.itemAmount > filteredItem[0].itemRemaining){
          errors.itemAmount = `มากสุด : ${filteredItem[0].itemRemaining}`
        }
      }
    }
  
    if(parseFloat(values.overcost) >= 1000){
      errors.overcost = "ส่วนเกินสินค้าไม่ควรเกิน 1,000 บาท"
    }
  
    return errors
  }

EditTransaction = reduxForm({
    form: 'EditTransaction',
    validate
})(EditTransaction)

const selector = formValueSelector('EditTransaction')

EditTransaction = connect(
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
  }, null
)(EditTransaction)

export default EditTransaction
