import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import M from 'materialize-css'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form'
import './main.css'
import NewCostTransactionForm from '../forms/newcosttransaction/NewCostTransactionForm';
import DayPickerInput from 'react-day-picker/DayPickerInput'

import MomentLocaleUtils, {
    formatDate,
    parseDate,
  } from 'react-day-picker/moment';

const shiftLeft10 = {
  left: "10px",
  position: "relative"
}

export class CostTransactionDetail extends Component {
  constructor(props){
    super(props)

    this.state = {
      isSelectAllRecord : true,
      isSelectCostRecord : true,
      isSelectRevenueRecord : true,
      isDisplayEditingMenu : false,
      selectedDay: new Date(new Date().setHours(0,0,0,0))
    }
  }

  componentDidMount(){
    var elems = document.querySelectorAll('#addModal');
    M.Modal.init(elems, {
        opacity: 0.6,
        endingTop: '20%',
    });
  }

  handleCheckboxes = (buttonString) => {
    if(buttonString === "1"){
        if(this.state.isSelectAllRecord === false){
            this.setState({
                isSelectAllRecord : true,
                isSelectCostRecord : true,
                isSelectRevenueRecord : true,
            })
        }
    }
    else if(buttonString === "2"){
        this.setState({
            isSelectAllRecord : false,
            isSelectCostRecord : true,
            isSelectRevenueRecord : false,
        })
    }
    else if(buttonString === "3"){
        this.setState({
            isSelectAllRecord : false,
            isSelectCostRecord : false,
            isSelectRevenueRecord : true,
        })
    }
    else if(buttonString === "4"){
        this.setState({isDisplayEditingMenu: !this.state.isDisplayEditingMenu})
    }
}

handleDayChange = (day) => {
    if((day instanceof Date)){
        this.setState({ selectedDay: day })
    }
}

  render() {
    return (
      <div className="container" style={{position: "relative", top: "5px"}}>
        <div className="row">
            <div className="col xl9 l9 m8 s12">
                <h5 className="col s12 m12 l12 xl12">
                    <i >
                        <FontAwesomeIcon className="fas fa-sm" icon="dollar-sign"/>
                    </i>
                    <span style={shiftLeft10}>ค่าใช้จ่ายคลังสินค้า</span>
                </h5>
                <div className="col s12 m12 l12 xl12">
                    <div className="row">
                        <label className="col xl4 l4 m5 s6">
                            <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("1")} checked={this.state.isSelectAllRecord} />
                            <span>รายการทั้งหมด</span>
                        </label>
                        <label className="col xl4 l4 m5 s6">
                            <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("2")} checked={this.state.isSelectCostRecord} />
                            <span>รายรับ</span>
                        </label>
                        <label className="col xl4 l4 m5 s6">
                            <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("3")} checked={this.state.isSelectRevenueRecord} />
                            <span>รายจ่าย</span>
                        </label>
                    </div>
                    <div className="row" style={{marginTop:"-10px"}}>
                        <label className="col xl4 l4 m5 s6">
                            <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("4")} checked={this.state.isDisplayEditingMenu} />
                            <span>แสดงเมนูแก้ไขรายการ</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="col xl3 l3 m4 s12" >
                  <div className="col xl12 l12 m12 s12" id="addNewRecordButton">
                      <div data-target="addModal" className="modal-trigger 88waves-effect waves-light btn-small green accent-3"><i className="material-icons right">arrow_upward</i>เพิ่มรายการ</div>
                  </div>
              </div>
          </div>
          <div id="addModal" className="modal">
            <div className="modal-content">
                <div className="container-fluid">
                    <NewCostTransactionForm>
                    <label className="left" style={{left: "10px", position: "relative"}}>วันที่บันทึก</label>
                    <div style={{bottom: "20px", position: "relative"}}>
                        <DayPickerInput 
                            classNames={{
                            container: "input-field col xl6 l6 m6 s12",
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
                    
                    </NewCostTransactionForm>
                    
                </div>
                        
                
            </div>
            <div className="modal-footer"> 
                <div className={`modal-close waves-effect waves-light btn-small green white-text`} style={{marginRight: "20px", zIndex: "0"}}>บันทึก</div>
                <div className="modal-close waves-effect waves-light btn-small red white-text" style={{marginRight: "20px", zIndex: "0"}}>ยกเลิก</div>
            </div>
          </div> 
      </div>
    )
  }
}

CostTransactionDetail = reduxForm({
    form: 'newCostTransaction'
})(CostTransactionDetail)

CostTransactionDetail = connect(null,null)(CostTransactionDetail)

export default CostTransactionDetail
