import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import M from 'materialize-css'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form'
import './main.css'
import NewCostTransactionForm from '../forms/newcosttransaction/NewCostTransactionForm';
import DayPickerInput from 'react-day-picker/DayPickerInput'
import {MonthPicker} from '../commons/MonthPicker'
import {LoaderSpinner} from '../commons/LoaderSpinner'
import {CostTransactionTableBody} from './CostTransactionTableBody'
import ReactNotification from "react-notifications-component";

import {addNewCostTransaction, fetchTransaction, deleteCostTransaction, editCostTransaction, resetCostTransactionError} from '../../actions/costTransaction'

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

    var d = new Date()
    var n = d.getMonth()
    var y = d.getFullYear()

    this.notificationDOMRef = React.createRef();

    this.state = {
      isSelectAllRecord : true,
      isSelectCostRecord : true,
      isSelectRevenueRecord : true,
      isDisplayEditingMenu : false,
      selectedDay: new Date(new Date().setHours(0,0,0,0)),
      isLoadingTransaction : true,
      currentMonth :  y * 12 + n,
    }
  }

  componentDidMount(){
    var elems = document.querySelectorAll('#addModal');
    M.Modal.init(elems, {
        opacity: 0.6,
        endingTop: '20%',
    });
    this.props.initialize({
        costType: "Cost",
        description : ""
    })
    this.props.fetchTransaction()
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
    if(prevProps.cost.costTransactions !== this.props.cost.costTransactions){
        this.setState({
            isLoadingTransaction: false,
        }) 
    }
    if(prevProps.cost.costTransactions === this.props.cost.costTransactions && this.props.cost.costTransactions != null && this.state.isLoadingTransaction === true){
        this.setState({
            isLoadingTransaction: false,
        }) 
    }

    if(this.props.cost.costTransactionError !== prevProps.cost.costTransactionError)
    {
        if(this.props.cost.costTransactionError != null){
            this.addNotification(this.props.cost.costTransactionError)
        }
    }

  }

  addOneCostTransaction(values, history){
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
    this.props.addNewCostTransaction(values, history)
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

numberWithCommas(x) {
    if(x != null){
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
    return null
  }

handleAddMonth = () => {
    this.setState({currentMonth: this.state.currentMonth + 1})
}

handleMinusMonth = () => {
    this.setState({currentMonth: this.state.currentMonth - 1})
}

handleSetMonth = (integerMonth) => {
    this.setState({currentMonth: integerMonth})
}

handleDayChange = (day) => {
    if((day instanceof Date)){
        this.setState({ selectedDay: day })
    }
}

  render() {
    const {handleSubmit, history, cost: {costTransactions}, invalid} = this.props
    const {stockId} = this.props.location.state
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
                            <span>รายจ่าย</span>
                        </label>
                        <label className="col xl4 l4 m5 s6">
                            <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("3")} checked={this.state.isSelectRevenueRecord} />
                            <span>รายรับ</span>
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
          {this.state.isSelectAllRecord === true && this.state.isLoadingTransaction === false && (
                    <div className="row" style={{marginTop: "-20px"}}>
                        <div className="col x12 l12 m12 s12 center">
                            <MonthPicker 
                                handleAddMonth={this.handleAddMonth} 
                                handleMinusMonth={this.handleMinusMonth} 
                                handleSetMonth={this.handleSetMonth}
                                currentMonth={this.state.currentMonth} 
                            />
                        </div>
                        <div className="col xl6 l6 m12 s12">
                                <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                                    <h6>รายจ่าย</h6>
                                </div>
                                <div className="col card small xl12 l12 m12 s12" style={{ height: "auto"}}>
                                <table className="highlight centered">
                                    <thead>
                                    <tr>
                                        <th>วันที่</th>
                                        <th>รายละเอียด</th>
                                        <th>จำนวนเงิน</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                    
                                    <tbody>
                                        <CostTransactionTableBody 
                                            costType="Cost" 
                                            transactions={costTransactions} 
                                            state={this.state}
                                            stockId={stockId}
                                            deleteCostTransaction={this.props.deleteCostTransaction}
                                            editCostTransaction={this.props.editCostTransaction}
                                        />
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col xl6 l6 m12 s12">
                            <div className="col xl12 l12 m12 s12" style={{left: "5px", position: "relative"}}>
                                <h6>รายรับ</h6>
                            </div>
                            <div className="col card small xl12 l12 m12 s12" style={{ height: "auto"}}>
                                <table className="highlight centered">
                                <thead>
                                <tr>
                                    <th>วันที่</th>
                                    <th>รายละเอียด</th>
                                    <th>จำนวนเงิน</th>
                                    <th></th>
                                </tr>
                                </thead>
                    
                                <tbody>
                                    <CostTransactionTableBody 
                                        costType="Revenue" 
                                        transactions={costTransactions} 
                                        state={this.state}
                                        stockId={stockId}
                                        deleteCostTransaction={this.props.deleteCostTransaction}
                                        editCostTransaction={this.props.editCostTransaction}
                                    />
                                </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
            )}
            {this.state.isSelectCostRecord === true && this.state.isSelectAllRecord === false && this.state.isLoadingTransaction === false && (
                <div className="row">
                        <div className="col x12 l12 m12 s12 center">
                        <MonthPicker 
                            handleAddMonth={this.handleAddMonth} 
                            handleMinusMonth={this.handleMinusMonth} 
                            handleSetMonth={this.handleSetMonth}
                            currentMonth={this.state.currentMonth} 
                        />
                    </div>
                    <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                        <h6>รายจ่าย</h6>
                    </div>
                    <div className="col card small xl12 l12 m12 s12" style={{ height: "auto"}}>
                        <table className="highlight centered">
                            <thead>
                            <tr>
                                <th>วันที่</th>
                                <th>รายละเอียด</th>
                                <th>จำนวนเงิน</th>
                                <th></th>
                            </tr>
                            </thead>
            
                            <tbody>
                                <CostTransactionTableBody 
                                    costType="Cost" 
                                    transactions={costTransactions} 
                                    state={this.state}
                                    stockId={stockId}
                                    deleteCostTransaction={this.props.deleteCostTransaction}
                                    editCostTransaction={this.props.editCostTransaction}
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {this.state.isSelectRevenueRecord === true && this.state.isSelectAllRecord === false && this.state.isLoadingTransaction === false && (
                <div className="row">
                        <div className="col x12 l12 m12 s12 center">
                        <MonthPicker 
                            handleAddMonth={this.handleAddMonth} 
                            handleMinusMonth={this.handleMinusMonth} 
                            handleSetMonth={this.handleSetMonth}
                            currentMonth={this.state.currentMonth} 
                        />
                    </div>
                    <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                        <h6>รายรับ</h6>
                    </div>
                    <div className="col card small xl12 l12 m12 s12" style={{ height: "auto"}}>
                        <table className="highlight centered">
                            <thead>
                            <tr>
                                <th>วันที่</th>
                                <th>รายละเอียด</th>
                                <th>จำนวนเงิน</th>
                                <th></th>
                            </tr>
                            </thead>
            
                            <tbody>
                                <CostTransactionTableBody 
                                    costType="Revenue" 
                                    transactions={costTransactions} 
                                    state={this.state}
                                    stockId={stockId}
                                    deleteCostTransaction={this.props.deleteCostTransaction}
                                    editCostTransaction={this.props.editCostTransaction}
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
                {this.state.isLoadingTransaction === true && (
                    <LoaderSpinner loading={this.state.loadingMusicroomRecord} color={'#123abc'}/>
                )}
          <div id="addModal" className="modal">
            <div className="modal-content">
                <div className="container-fluid">
                    <NewCostTransactionForm>
                    <label style={{left: "10px", position: "relative"}}>วันที่บันทึก</label>
                    <div style={{bottom: "15px", position: "relative"}}>
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
                <div onClick={handleSubmit((values) => this.addOneCostTransaction(values, history))} className={`modal-close waves-effect waves-light btn-small green white-text ${invalid === true ? "disabled" : ""}`} style={{marginRight: "20px", zIndex: "0"}}>บันทึก</div>
                <div className="modal-close waves-effect waves-light btn-small red white-text" style={{marginRight: "20px", zIndex: "0"}}>ยกเลิก</div>
            </div>
          </div> 
          <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
                this.props.resetCostTransactionError()
            }} />  
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

CostTransactionDetail = reduxForm({
    form: 'newCostTransaction',
    validate
})(CostTransactionDetail)

CostTransactionDetail = connect(mapStateToProps,{addNewCostTransaction, fetchTransaction, deleteCostTransaction, editCostTransaction, resetCostTransactionError})(CostTransactionDetail)

export default CostTransactionDetail
