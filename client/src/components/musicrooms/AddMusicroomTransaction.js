import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import M from 'materialize-css'
import {reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import _ from 'lodash'
import ReactNotification from "react-notifications-component";

import MomentLocaleUtils, {
    formatDate,
    parseDate,
  } from 'react-day-picker/moment';

import {NewMusicroomTransactionForm} from '../forms/newmusicroomtransaction/NewMusicroomTransactionForm'
import {addNewMusicroomTransaction, resetMusicroomTransactionError} from '../../actions/musicroomTransaction'

const shiftLeft10 = {
    left: "10px",
    position: "relative"
}

export class AddMusicroomTransaction extends Component {
    constructor(props){
        super(props)

        this.notificationDOMRef = React.createRef();

        this.state = {
            selectedDay: new Date(new Date().setHours(0,0,0,0)),
            allRecordedItem: [],
            lastCurrentAction: "create",
            currentItemId: null,
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

    handleDayChange = (day) => {
        if((day instanceof Date)){
            this.setState({ selectedDay: day })
        }
    }

    pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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

    calculatePrice(item){
        const {startTime, endTime, isOverNight, roomSize, isStudentDiscount} = item
        var diff = 0;
        if(startTime != null && endTime != null){
            if(isOverNight === true){
                if(startTime <= 360 && startTime <= endTime){
                    diff = (endTime + 1440) - (startTime + 1440)
                    this.calculatePriceRoom(diff, roomSize, isStudentDiscount)
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

    renderRecordedItemBody(){
        if(this.state.allRecordedItem.length !== 0){
            return _.map(this.state.allRecordedItem, item => {

                return (
                <tr key={item._id}>
                    <td>{item.formatRoomsize}</td>
                    <td>{item.formatStartTime}</td>
                    <td>{item.formatEndTime}</td>
                    <td>{item.formatDiff}</td>
                    <td>{item.formatPrice}</td>
                    <td>
                        <div className="modal-trigger" onClick={() => this.handleCurrentAction("edit", item)} style={{display: "inline-block", marginRight: "10px", cursor: "pointer"}} data-target="addModal"><i className="material-icons black-text">edit</i></div>
                        <div onClick={() => this.deleteOneTransaction(item._id)} style={{display: "inline-block", cursor: "pointer"}}><i className="material-icons black-text">delete</i></div>
                    </td>
                </tr>
                )
            })
        }
    }

    handleCurrentAction(action, item = null){
        this.setState({lastCurrentAction: action, currentItemId: item != null ? item._id : null})
        
        if(action === "create"){
                this.setState({resetSignal: true}, () => {
                    this.props.initialize({
                        startTime: -1,
                        endTime: -1,
                        roomSize: "Small",
                        isOverNight: false,
                        isStudentDiscount: false
                    })

                this.setState({isSelectCustomPrice: false, customPrice: ""})

                setTimeout(() => {
                    this.setState({resetSignal: false})
                }, 250)
            })
        }

        else if(action === "edit"){
            this.setState({editSignal: true}, () => {
                this.props.initialize({
                    startTime: item.startTime,
                    endTime: item.endTime,
                    roomSize: item.roomSize,
                    isOverNight: item.isOverNight,
                    isStudentDiscount: item.isStudentDiscount
                })
            })

            if(item.isSelectCustomPrice === true){
                this.setState({isSelectCustomPrice: true, customPrice: item.formatPrice})
            }

            setTimeout(() => {
                this.setState({editSignal: false})
            }, 250)
        }
      }

    renderRecordedItem(){
        return(
            <table className="highlight reponsive-table centered">
              <thead>
                <tr>
                    <td style={{textAlign: "center"}}>ขนาดห้อง</td>
                    <td style={{textAlign: "center"}}>เวลาเริ่ม</td>
                    <td style={{textAlign: "center"}}>เวลาสิ้นสุด</td>
                    <td style={{textAlign: "center"}}>จำนวน ชม.</td>
                    <td style={{textAlign: "center"}}>ราคา</td>
                    <td style={{textAlign: "center"}}></td>
                </tr>
              </thead>
      
              <tbody>
                  {this.renderRecordedItemBody()}
              </tbody>
            </table>  
          )
      }

    componentDidMount = () => {
        this.props.initialize({
            startTime: -1,
            endTime: -1,
            roomSize: "Small",
            isOverNight: false,
            isStudentDiscount: false
        })
        var elems = document.querySelectorAll('#addModal');
        M.Modal.init(elems, {
            opacity: 0.6,
            endingTop: '20%',
        }); 
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

    numberWithCommas(x) {
        if(x != null){
          var parts = x.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return parts.join(".");
        }
        return null
      }

    calculatePriceRoom = (diff, roomSize, isStudentDiscount) => {
        console.log(this.state.isSelectCustomPrice)
        var price = 0
        if(roomSize === "Small"){
            price = diff * 3;
            if(isStudentDiscount === true){
                price = price * 0.95
            }
            if(this.state.isSelectCustomPrice === true){
                return (
                    <div className="row">
                        <div className="input-field col s10 m6 l6 xl6">
                            <i className="prefix"><FontAwesomeIcon icon={"dollar-sign"}/></i>
                            <input value={this.state.customPrice} onChange={(e) => this.handleTwoDecimalPoint(e)} id={"ราคาห้องซ้อม"} type="text" autoComplete="off" className="validate"/>
                            <label htmlFor={"ราคาห้องซ้อม"}>{"ราคาห้องซ้อม"}</label>
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
                return (
                    <div className="row">
                        <div className="input-field col s10 m6 l6 xl6">
                            <i className="prefix"><FontAwesomeIcon icon={"dollar-sign"}/></i>
                            <input value={this.state.customPrice} onChange={(e) => this.handleTwoDecimalPoint(e)} id={"ราคาห้องซ้อม"} type="number" autoComplete="off" className="validate"/>
                            <label htmlFor={"ราคาห้องซ้อม"}>{"ราคาห้องซ้อม"}</label>
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

    guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      }

    addOneMusicroomTransaction = (values) => {
        if(this.state.lastCurrentAction === "create"){
            values.isSelectCustomPrice = false
            this.props.reset()

            this.setState({resetSignal: true})
            setTimeout(() => {
                this.setState({resetSignal: false})
            }, 250)

            let result = this.calculatePrice(values)
            let currentPrice = this.state.customPrice

            values._id = this.guid()
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
           
            //set state with new value
            this.setState({allRecordedItem: [...this.state.allRecordedItem, values]})
        }
        else if(this.state.lastCurrentAction === "edit"){
            values.isSelectCustomPrice = false
            this.props.reset()
            this.setState({resetSignal: true})
            setTimeout(() => {
                this.setState({resetSignal: false})
            }, 250)

            //prepare value
            var currentItem = this.state.allRecordedItem
            var arrayIndex = currentItem.findIndex(obj => obj._id === this.state.currentItemId)

            let result = this.calculatePrice(values)
            let currentPrice = this.state.customPrice

            values._id = this.guid()
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
            
            currentItem[arrayIndex] = values

            //set state with new value
            this.setState({allRecordedItem: currentItem})
        }
    }

    addTransactions(values, history){
        if(values.day === null || values.day === undefined){
          values.day = new Date(new Date().setHours(0,0,0,0))
        }
        values.record.forEach((e) => {
          return(
            e.day = values.day
          )
        })
        this.props.addNewMusicroomTransaction(values.record, history)
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.musicroom.musicroomTransactionError !== prevProps.musicroom.musicroomTransactionError)
        {
          if(this.props.musicroom.musicroomTransactionError != null){
            this.addNotification(this.props.musicroom.musicroomTransactionError)
          }
        }
    }

  render() {
    const {handleSubmit, itemProperties, invalid, history} = this.props
    var submitButtonClassName = invalid ? "disabled" : ""
    return (
        <div className="container" style={{position: "relative", top: "5px"}}>
            <div className="row">
                <h6>
                    <i>
                        <FontAwesomeIcon className="fas fa-sm" icon="music"/>
                    </i>
                    <span style={shiftLeft10}>เพิ่มรายการห้องซ้อม</span>
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
            <div className="row" style={{bottom: "35px", position: "relative"}}>
                <div className="col xl12 l12 m12 s12">
                    รายการห้องซ้อม
                </div>
                <div className="col xl12 l12 m12 s12">
                    {this.state.allRecordedItem.length === 0 ? 
                    <div className="card-panel yellow darken-1">
                        <span className="white-text">
                        <span><i className="material-icons" style={{marginLeft: "10px",top:"5px",position:"relative"}}>warning</i></span>
                        <span style={{marginLeft: "10px"}}>ไม่มีรายการที่ต้องการบันทึก กรุณาเพิ่มรายการห้องซ้อม</span>
                        </span>
                    </div> : 
                        this.renderRecordedItem()
                    }
                 </div>
                 <div className="col xl12 l12 m12 s12" style={{marginTop: "10px"}}>
                    <div onClick={() => this.handleCurrentAction("create")} data-target="addModal" className="waves-effect waves-light btn-small modal-trigger" style={{position: "absolute", left: 0, zIndex: 0}}>
                        เพิ่มรายการห้องซ้อม 
                    </div>
                </div>
            </div>
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
            <div id="addModal" className="modal">
            <div className="modal-content">
                <div className="container-fluid">
                    <NewMusicroomTransactionForm resetSignal={this.state.resetSignal} editSignal={this.state.editSignal}/>
                </div>
                <div className="divider"></div>
                <div className="container-fluid">
                    {this.summaryTransaction(itemProperties)}
                </div>
            </div>
            <div className="modal-footer"> 
                <div onClick={handleSubmit((values) => this.addOneMusicroomTransaction(values))} className={`modal-close waves-effect waves-light btn-small green white-text ${submitButtonClassName}`} style={{marginRight: "20px"}}>บันทึก</div>
                <div className="modal-close waves-effect waves-light btn-small red white-text" style={{marginRight: "20px"}}>ยกเลิก</div>
            </div>
            </div> 
            <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
                this.props.resetMusicroomTransactionError()
            }} />       
        </div>//container      
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

AddMusicroomTransaction = reduxForm({
    form: 'newMusicroomTransaction',
    validate
})(AddMusicroomTransaction)

const selector = formValueSelector('newMusicroomTransaction')

AddMusicroomTransaction = connect(
  state => {
    const itemProperties = {}
    itemProperties.startTime = selector(state, 'startTime')
    itemProperties.endTime = selector(state, 'endTime')
    itemProperties.isOverNight = selector(state, 'isOverNight')
    itemProperties.roomSize = selector(state, 'roomSize')
    itemProperties.isStudentDiscount = selector(state, 'isStudentDiscount')
    return{
      musicroom: state.musicroom,
      itemProperties,
    }
  }, {addNewMusicroomTransaction, resetMusicroomTransactionError}
)(AddMusicroomTransaction)

export default AddMusicroomTransaction
