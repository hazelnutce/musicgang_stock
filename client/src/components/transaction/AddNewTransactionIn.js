import React, { Component } from 'react'
import {ErrorProcessNotice} from '../commons/ErrorProcessNotice'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import {reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {NewTransactionForm} from '../forms/newtransaction/NewTransactionForm'

import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';

import 'moment/locale/th';
import 'react-day-picker/lib/style.css';

export class AddNewTransactionIn extends Component {
  constructor(props){
    super(props)

    this.state = {
      selectedDay: undefined
    }
  }

  handleDayChange = (day) => {
    this.setState({ selectedDay: day });
  }

  render() {
    const { selectedDay } = this.state;
    const {stockName} = this.props.location.state
    if(stockName == null){
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
            <NewTransactionForm />
          </div> 
      </div>
    )
  }
}


export default reduxForm({
  form: "newTransactionForm"
})(connect(null,null)(AddNewTransactionIn))

