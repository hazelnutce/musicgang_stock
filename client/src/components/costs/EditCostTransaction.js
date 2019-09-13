import React, { Component } from 'react'
import {reduxForm} from 'redux-form'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import ReactNotification from "react-notifications-component";

import NewCostTransactionForm from '../forms/newcosttransaction/NewCostTransactionForm';
import MomentLocaleUtils, {
    formatDate,
    parseDate,
  } from 'react-day-picker/moment';
  import {editCostTransaction, resetCostTransactionError} from '../../actions/costTransaction'

  const shiftLeft10 = {
    left: "10px",
    position: "relative"
  }

export class EditCostTransaction extends Component {

    constructor(props){
        super(props)

        this.notificationDOMRef = React.createRef();

        this.state = {
            selectedDay: this.props.location.state.itemDay,
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

      componentDidUpdate(prevProps){
        if(this.props.cost.costTransactionError !== prevProps.cost.costTransactionError)
        {
            if(this.props.cost.costTransactionError != null){
                this.addNotification(this.props.cost.costTransactionError)
            }
        }
      }

    componentDidMount(){
        const {description, cost, costType} = this.props.location.state
        this.props.initialize({
            description,
            cost,
            costType
        })
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

    editOneTransaction(values, history){
        if(this.state.selectedDay === null || this.state.selectedDay === undefined){
            values.day = new Date(new Date().setHours(0,0,0,0))
        }
        else{
            values.day = this.state.selectedDay
        }
    
        this.props.reset()
    
        values.formatCost = this.numberWithCommas(parseFloat(values.cost).toFixed(2))
        values.cost =+ parseFloat(values.cost).toFixed(2)
        
        values._stock = this.props.location.state.stockId
        values._id = this.props.location.state._id
        this.props.editCostTransaction(values,history)
    }

    render() {
        const {history, handleSubmit, invalid} = this.props

        return (
            <div className="container undernav">
                <div className="row">
                    <h6 className="col s12 m12 l12 xl12">
                        <i >
                            <FontAwesomeIcon className="fas fa-sm" icon="dollar-sign"/>
                        </i>
                        <span style={shiftLeft10}>แก้ไขค่าใช้จ่าย</span>
                    </h6>
                </div>
                <div className="row">
                    <NewCostTransactionForm>
                    <label style={{left: "10px", position: "relative"}}>วันที่บันทึก</label>
                    <div style={{bottom: "15px", position: "relative"}}>
                        <DayPickerInput 
                            classNames={{
                            container: "input-field col xl6 l6 m6 s12",
                            overlayWrapper: "DayPickerInput-OverlayWrapper",
                            overlay: "DayPickerInput-Overlay"
                            }}
                            onDayChange={this.handleDayChange} f
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
                    </NewCostTransactionForm>
                    <div className="divider"></div>
                    <div className="col xl12 l12 m12 s12" style={{marginTop: "10px"}}>
                    <div onClick={() => history.goBack()} className="waves-effect waves-light btn-small right red">
                        ยกเลิก  
                    </div>
                    <div onClick={handleSubmit((values) => this.editOneTransaction(values, history))} className={`waves-effect waves-light btn-small right green ${invalid === true ? "disabled" : ""}`} 
                        style={{marginRight: "10px"}}>
                        บันทึก  
                    </div>
                </div>
                <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
                    this.props.resetCostTransactionError()
                }} />  
                </div>
            </div>
        )
    }
}

function validate(values){
    const errors = {}
    
    if(!values.description){
        errors.description = "กรุณาระบุคำอธิบายรายการ"
    }

    else if(values.description.length > 50){
        errors.description = "คำอธิบายรายการต้องไม่เกิน 50 อักษร"
    }

    if(!values.cost){
        errors.cost = "กรุณาระบุค่าใช้จ่ายของรายการ"
    }

    else if(parseFloat(values.cost) >= 1000000){
        errors.cost = "มูลค่ารายการควรน้อยกว่า 1,000,000 บาท"
    }

    return errors
}

function mapStateToProps(state){
    return {cost : state.cost}
}

EditCostTransaction = reduxForm({
    form: 'editCostTransaction',
    validate
})(EditCostTransaction)

export default connect(mapStateToProps,{editCostTransaction, resetCostTransactionError})(EditCostTransaction)

