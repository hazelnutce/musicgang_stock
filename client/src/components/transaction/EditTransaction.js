import React, { Component } from 'react'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form'
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
        const {itemName, itemAmount, formatDiscount, formatOvercost} = this.props.location.state
        this.setState({editSignal: true}, () => {
            this.props.initialize({
                itemName: itemName,
                itemAmount: itemAmount,
                discount: formatDiscount,
                overcost: formatOvercost
            })
        })
        setTimeout(() => {
            this.setState({editSignal: false})
          }, 250)
        
    }

    render() {
        const {_id, itemName, items} = this.props.location.state
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
                        value={this.state.selectedDay}
                        />
                </div>
                <div className="row">
                    <div className="col xl12 l12 m12 s12">
                        รายละเอียดสินค้า
                    </div>
                    <div className="col xl12 l12 m12 s12">
                        <EditTransactionForm items={items} editSignal={this.state.editSignal}/>
                    </div>
                </div>
            </div>
        )
    }
}

EditTransaction = reduxForm({
    form: 'EditTransaction'
})(EditTransaction)

export default connect(null, null)(EditTransaction)
