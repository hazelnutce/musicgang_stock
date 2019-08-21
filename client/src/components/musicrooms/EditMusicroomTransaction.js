import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import {NewMusicroomTransactionForm} from '../forms/newmusicroomtransaction/NewMusicroomTransactionForm'
import {reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import ReactNotification from "react-notifications-component";

import MomentLocaleUtils, {
    formatDate,
    parseDate,
  } from 'react-day-picker/moment';

  import {editMusicroomTransaction, resetMusicroomTransactionError} from '../../actions/musicroomTransaction'

  const shiftLeft10 = {
    left: "10px",
    position: "relative"
}

export class EditMusicroomTransaction extends Component {
    constructor(props){
        super(props)

        this.notificationDOMRef = React.createRef();

        this.state = {
            selectedDay: this.props.location.state.itemDay,
            resetSignal: false,
            editSignal: false,
            customPrice: "",
            isSelectCustomPrice: false
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

    componentDidMount(){
        const {endTime, startTime, isOverNight, isStudentDiscount, roomSize, isSelectCustomPrice, formatPrice} = this.props.location.state
        this.setState({editSignal: true}, () => {
            this.props.initialize({
                endTime,
                startTime,
                roomSize,
                isOverNight,
                isStudentDiscount
            })

            if(isSelectCustomPrice === true){
                this.setState({customPrice: formatPrice, isSelectCustomPrice: true})
            }
        })
        setTimeout(() => {
            this.setState({editSignal: false})
        }, 100);
        
    }

    handleDayChange = (day) => {
        if((day instanceof Date)){
            this.setState({ selectedDay: day })
        }
    }

    numberWithCommas(x) {
        if(x != null){
          var parts = x.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return parts.join(".");
        }
        return null
      }

      calculatePrice(item){
        const {startTime, endTime, isOverNight, roomSize, isStudentDiscount} = item
        var diff = 0;
        if(startTime != null && endTime != null){
            if(isOverNight === true){
                if(startTime <= 360 && startTime <= endTime){
                    diff = (endTime + 1440) - (startTime + 1440)
                }
                else if(endTime <= 360 && startTime > endTime){
                    diff = (endTime + 1440) - startTime
                }
            }
            else{
                if(startTime <= endTime){
                    diff = endTime - startTime
                }
            }
        }

        var price = 0
        if(roomSize === "Small"){
            price = diff * 3;
            if(isStudentDiscount === true){
                price = price * 0.95
            }
        }
        else if(roomSize === "Large"){
            price = diff * 220 / 60;
            if(isStudentDiscount === true){
                price = price * 0.95
            }
        }

        return {price, diff}
    }

    pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
      }

    editOneTransaction(values, history){
        let result = this.calculatePrice(values)
        const {_id} = this.props.location.state
        let currentPrice = this.state.customPrice

        values.formatStartTime = `${parseInt(values.startTime / 60)}:${this.pad(values.startTime % 60, 2)}`
        values.formatEndTime = `${parseInt(values.endTime / 60)}:${this.pad(values.endTime % 60, 2)}`
        values.formatRoomsize = values.roomSize === "Small" ? "ห้องเล็ก" : "ห้องใหญ่"
        values.formatDiff = `${parseInt(result.diff/60)} ชม. ${parseInt(result.diff%60)} นาที`

        if(this.state.isSelectCustomPrice === true){
            values.isSelectCustomPrice = true
            if(isNaN(parseFloat(currentPrice))){
                if(currentPrice.slice(-1) === "."){
                    let newPrice = currentPrice.substring(0, currentPrice.length - 1);
                    values.formatPrice = `${this.numberWithCommas(parseFloat(newPrice).toFixed(2))}`
                }
                else{
                    values.formatPrice = `0.00`
                }
            }
            else{
                values.formatPrice = `${this.numberWithCommas(parseFloat(currentPrice).toFixed(2))}`
            }
            
        }
        else{
            values.formatPrice = `${this.numberWithCommas(parseFloat(result.price).toFixed(2))}`
        }

        values._id = _id
        values.day = new Date(this.state.selectedDay.setHours(0,0,0,0))

        if(values.day === null || values.day === undefined){
            values.day = new Date(new Date().setHours(0,0,0,0))
        }

        this.props.editMusicroomTransaction(values, history)
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.musicroom.musicroomTransactionError !== prevProps.musicroom.musicroomTransactionError)
        {
          if(this.props.musicroom.musicroomTransactionError != null){
            this.addNotification(this.props.musicroom.musicroomTransactionError)
          }
        }
    }

    handleTwoDecimalPoint(e){
        e.preventDefault()
        let {value} = e.target
        if(value === ""){
            this.setState({customPrice: ""})
        }
        else if((/^\d+\.?\d{0,2}$/.test(value))){
            this.setState({customPrice: value})
        }
    }

    calculatePriceRoom = (diff, roomSize, isStudentDiscount) => {
        var price = 0

        if(roomSize === "Small"){
            price = diff * 3;
            if(isStudentDiscount === true){
                price = price * 0.95
            }
            if(this.state.isSelectCustomPrice === true){
                let labelClassName = ""
                if(this.state.customPrice !== ""){
                    labelClassName = "active"
                }
                return (
                    <div className="row">
                        <div className="input-field col s10 m6 l6 xl6">
                            <i className="prefix"><FontAwesomeIcon icon={"dollar-sign"}/></i>
                            <input value={this.state.customPrice} onChange={(e) => this.handleTwoDecimalPoint(e)} id={"ราคาห้องซ้อม"} type="text" autoComplete="off" className="validate"/>
                            <label className={labelClassName} htmlFor={"ราคาห้องซ้อม"}>{"ราคาห้องซ้อม"}</label>
                        </div>  
                        <span className="input-field col s2 m2 l2 xl2" onClick={() => this.setState({isSelectCustomPrice: false})} style={{position: "relative", left: "20px", top: "20px" ,fontSize: "12px", cursor: "pointer", textDecoration: "underline", color: "#1c90d4"}}>
                            คิดราคาตามปกติ
                        </span>
                    </div>
                    
                )
            }
            else{
                return (
                    <h6>
                        รวมราคา : {this.numberWithCommas(parseFloat(price).toFixed(2))} บาท
                        <span onClick={() => this.setState({isSelectCustomPrice: true})} style={{position: "relative", left: "20px", fontSize: "12px", cursor: "pointer", textDecoration: "underline", color: "#1c90d4"}}>
                            ระบุราคาเอง
                        </span>
                    </h6>
                )
            }
        }
        else if(roomSize === "Large"){
            price = diff * 220 / 60;
            if(isStudentDiscount === true){
                price = price * 0.95
            }
            if(this.state.isSelectCustomPrice === true){
                let labelClassName = ""
                if(this.state.customPrice !== ""){
                    labelClassName = "active"
                }
                return (
                    <div className="row">
                        <div className="input-field col s10 m6 l6 xl6">
                            <i className="prefix"><FontAwesomeIcon icon={"dollar-sign"}/></i>
                            <input value={this.state.customPrice} onChange={(e) => this.handleTwoDecimalPoint(e)} id={"ราคาห้องซ้อม"} type="text" autoComplete="off" className="validate"/>
                            <label className={labelClassName} htmlFor={"ราคาห้องซ้อม"}>{"ราคาห้องซ้อม"}</label>
                        </div>  
                        <span className="input-field col s2 m2 l2 xl2" onClick={() => this.setState({isSelectCustomPrice: false})} style={{position: "relative", left: "20px", top: "20px" ,fontSize: "12px", cursor: "pointer", textDecoration: "underline", color: "#1c90d4"}}>
                            คิดราคาตามปกติ
                        </span>
                    </div>
                    
                )
            }
            else{
                return (
                    <h6>
                        รวมราคา : {this.numberWithCommas(parseFloat(price).toFixed(2))} บาท
                        <span onClick={() => this.setState({isSelectCustomPrice: true})} style={{position: "relative", left: "20px", fontSize: "12px", cursor: "pointer", textDecoration: "underline", color: "#1c90d4"}}>
                            ระบุราคาเอง
                        </span>
                    </h6>
                )
            }
        }
        else{
            return(
                <h6>การระบุเวลาผิดพลาด</h6>
            )
            
        }
    }

    summaryTransaction = (itemProperties) => {
        const {startTime, endTime, isOverNight, roomSize, isStudentDiscount} = itemProperties
        var diff = 0;
        if(startTime != null && endTime != null){
            if(isOverNight === true){
                if(startTime <= 360 && startTime <= endTime){
                    diff = (endTime + 1440) - (startTime + 1440)
                    return this.calculatePriceRoom(diff, roomSize, isStudentDiscount)
                }
                else if(endTime <= 360 && startTime > endTime){
                    diff = (endTime + 1440) - startTime
                    return this.calculatePriceRoom(diff, roomSize, isStudentDiscount)
                }
                else{
                    return(
                        <h6>การระบุเวลาผิดพลาด</h6>
                    )
                }
                
            }
            else{
                if(startTime <= endTime){
                    diff = endTime - startTime
                    return this.calculatePriceRoom(diff, roomSize, isStudentDiscount)
                }
                else{
                    return(
                        <h6>การระบุเวลาผิดพลาด</h6>
                    )
                }
                
            }
        }
        else{
            return(
                <h6>ไม่มีการระบุเวลาห้องซ้อม</h6>
            )
        }
    }

    render() {
        const {history, handleSubmit, itemProperties} = this.props
        return (
            <div className="container" style={{position: "relative", top: "5px"}}>
                <div className="row">
                    <h6>
                        <i>
                            <FontAwesomeIcon className="fas fa-sm" icon="music"/>
                        </i>
                        <span style={shiftLeft10}>แก้ไขรายการห้องซ้อม</span>
                    </h6>
                </div>
                <div className="row">
                    <label className="left">วันที่บันทึก</label>
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
                </div>
                <div className="row" style={{marginTop: "-20px"}}>
                    <div className="col xl12 l12 m12 s12">
                        แก้ไขรายการ
                    </div>
                    <NewMusicroomTransactionForm resetSignal={this.state.resetSignal} editSignal={this.state.editSignal}/>
                    
                    <div className="container-fluid">
                        {this.summaryTransaction(itemProperties)}
                    </div>
                    <div className="divider"></div>
                    <div className="col xl12 l12 m12 s12" style={{marginTop: "10px"}}>
                    <div onClick={() => history.goBack()} className="waves-effect waves-light btn-small right red">
                        ยกเลิก  
                    </div>
                    <div onClick={handleSubmit((values) => this.editOneTransaction(values, history))} className={`waves-effect waves-light btn-small right green`} 
                        style={{marginRight: "10px"}}>
                        บันทึก  
                    </div>
                </div>
                </div>
                <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
                    this.props.resetMusicroomTransactionError()
                }} /> 
            </div>
        )
    }
}

function validate(values, props){
    const errors = {}

    if(values.startTime === null || values.startTime <= -1){
        errors.startTime = "กรุณาระบุเวลา"
    }

    if(values.endTime === null || values.endTime <= -1){
        errors.endTime = "กรุณาระบุเวลา"
    }

    if(values.endTime > -1 && values.startTime > -1 && ((values.endTime - values.startTime) % 15 !== 0)){
        errors.startTime = "ระยะห่างเวลาควรหารด้วย 15 ลงตัว"
    }

    if(values.isOverNight === true && values.endTime > -1 && values.startTime > -1){
        if(values.startTime > values.endTime){
            if(values.endTime > 360){
                errors.startTime = "เป็นเวลาข้ามคืน"
            }
        }
        else{
            if(!(values.startTime <= 360 && values.endTime <= 360)){
                errors.startTime = "ควรเป็นเวลาช่วงเช้า"
            }
        }
    }
    else if(values.isOverNight === false && values.endTime > -1 && values.startTime > -1){
        if(values.startTime > values.endTime){
            errors.startTime = "เวลาไม่ถูกต้อง"
        }
    }

    return errors
}

EditMusicroomTransaction = reduxForm({
    form: 'editMusicroomTransaction',
    validate
})(EditMusicroomTransaction)

const selector = formValueSelector('editMusicroomTransaction')

EditMusicroomTransaction = connect((state) => {
    const itemProperties = {}
    itemProperties.startTime = selector(state, 'startTime')
    itemProperties.endTime = selector(state, 'endTime')
    itemProperties.isOverNight = selector(state, 'isOverNight')
    itemProperties.roomSize = selector(state, 'roomSize')
    itemProperties.isStudentDiscount = selector(state, 'isStudentDiscount')

    return {
        musicroom: state.musicroom,
        itemProperties
    }
}, {editMusicroomTransaction, resetMusicroomTransactionError})(EditMusicroomTransaction)

export default EditMusicroomTransaction
