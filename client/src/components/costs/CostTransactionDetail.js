import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import M from 'materialize-css'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form'
import _ from 'lodash'
import moment from 'moment'
import {Link} from 'react-router-dom'

import './main.css'
import NewCostTransactionForm from '../forms/newcosttransaction/NewCostTransactionForm';
import DayPickerInput from 'react-day-picker/DayPickerInput'
import {MonthPicker} from '../commons/MonthPicker'
import {LoaderSpinner} from '../commons/LoaderSpinner'
import ReactNotification from "react-notifications-component";
import {CostMonthlySummaryPanel} from './CostMonthlySummaryPanel'

import {addNewCostTransaction, 
    fetchTransaction, 
    deleteCostTransaction, 
    editCostTransaction, 
    resetCostTransactionError, 
    getTotalImport,
    getTotalExport
    } from '../../actions/costTransaction'

import MomentLocaleUtils, {
    formatDate,
    parseDate,
  } from 'react-day-picker/moment';
import CostTransactionTableHeader from './CostTransactionTableHeader';
import EmptyTransactionNotice from '../commons/EmptyTransactionNotice';

const shiftLeft10 = {
  left: "10px",
  position: "relative"
}

const sessionEnums = {
    currentPageTrackerCost_1: 'currentPageTrackerCost_1',
    currentPageTrackerCost_2: 'currentPageTrackerCost_2',
    currentPageTrackerCost_month: 'currentPageTrackerCost_month'
}

export class CostTransactionDetail extends Component {
  constructor(props){
    super(props)

    var costPage = sessionStorage.getItem(sessionEnums.currentPageTrackerCost_1)
    var revenuePage = sessionStorage.getItem(sessionEnums.currentPageTrackerCost_2)
    var month = sessionStorage.getItem(sessionEnums.currentPageTrackerCost_month)

    this.notificationDOMRef = React.createRef();

    this.state = {
      isSelectAllRecord : true,
      isSelectCostRecord : true,
      isSelectRevenueRecord : true,
      selectedDay: new Date(new Date().setHours(0,0,0,0)),
      isLoadingTransaction : true,
      currentMonth :  parseInt(month),
      currentCostPage : parseInt(costPage),
      currentRevenuePage : parseInt(revenuePage),
      currentImportTotal: 0,
      currentExportTotal: 0,
      currentMusicroomTotal: 0,
      isLoadingImportExportCost: false
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
    this.setState({isLoadingImportExportCost: true})
    let promiseImport = this.props.getTotalImport(this.state.currentMonth, this.props.location.state.stockId)
    let promiseExport = this.props.getTotalExport(this.state.currentMonth, this.props.location.state.stockId)
    Promise.all([promiseImport, promiseExport]).then(values => {
        this.setState({currentImportTotal: values[0].data,
            currentExportTotal: values[1].data,
            isLoadingImportExportCost: false})
    })
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
    //need to handle changed page between month
    var newMonth = this.state.currentMonth + 1
    sessionStorage.setItem(sessionEnums.currentPageTrackerCost_month, newMonth.toString())
    sessionStorage.setItem(sessionEnums.currentPageTrackerCost_1, "1")
    sessionStorage.setItem(sessionEnums.currentPageTrackerCost_2, "1")
    this.setState({
        isLoadingImportExportCost: true,
        currentCostPage: 1,
        currentRevenuePage: 1
    })
    let promiseImport = this.props.getTotalImport(newMonth, this.props.location.state.stockId)
    let promiseExport = this.props.getTotalExport(newMonth, this.props.location.state.stockId)
    Promise.all([promiseImport, promiseExport]).then(values => {
        this.setState({currentMonth: newMonth, 
            currentImportTotal: values[0].data,
            currentExportTotal: values[1].data,
            isLoadingImportExportCost: false})
    })
}

handleMinusMonth = () => {
    //need to handle changed page between month
    var newMonth = this.state.currentMonth - 1
    sessionStorage.setItem(sessionEnums.currentPageTrackerCost_month, newMonth.toString())
    sessionStorage.setItem(sessionEnums.currentPageTrackerCost_1, "1")
    sessionStorage.setItem(sessionEnums.currentPageTrackerCost_2, "1")
    this.setState({
        isLoadingImportExportCost: true,
        currentCostPage: 1,
        currentRevenuePage: 1
    })
    let promiseImport = this.props.getTotalImport(newMonth, this.props.location.state.stockId)
    let promiseExport = this.props.getTotalExport(newMonth, this.props.location.state.stockId)
    Promise.all([promiseImport, promiseExport]).then(values => {
        this.setState({currentMonth: newMonth, 
            currentImportTotal: values[0].data,
            currentExportTotal: values[1].data,
            isLoadingImportExportCost: false})
    })
}

handleSetMonth = (integerMonth) => {
    //need to handle changed page between month
    var newMonth = integerMonth
    sessionStorage.setItem(sessionEnums.currentPageTrackerCost_month, newMonth.toString())
    sessionStorage.setItem(sessionEnums.currentPageTrackerCost_1, "1")
    sessionStorage.setItem(sessionEnums.currentPageTrackerCost_2, "1")
    this.setState({
        isLoadingImportExportCost: true,
        currentCostPage: 1,
        currentRevenuePage: 1
    })
    let promiseImport = this.props.getTotalImport(integerMonth, this.props.location.state.stockId)
    let promiseExport = this.props.getTotalExport(integerMonth, this.props.location.state.stockId)
    Promise.all([promiseImport, promiseExport]).then(values => {
        this.setState({currentMonth: integerMonth, 
            currentImportTotal: values[0].data,
            currentExportTotal: values[1].data,
            isLoadingImportExportCost: false})
    })
}

handleDayChange = (day) => {
    if((day instanceof Date)){
        this.setState({ selectedDay: day })
    }
}

sortDayForTransaction = (a,b) => {
    var newADay = new Date(a.day)
    var newBDay = new Date(b.day)
    var newATime = newADay.getTime()
    var newBTime = newBDay.getTime()
    if(newATime < newBTime)
        return -1
    if(newATime > newBTime)
        return 1
    return 0
}

isSameMonth = (d1, d2) => {
    return d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();
}
isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
}

handleMonthFilter = (monthConst) => {
    var monthFilter = monthConst % 12
    var yearFilter = monthConst / 12
    return new Date(yearFilter, monthFilter, 1)
}

renderTableBody(costType, transactionList){
    const {stockId} = this.props.location.state
    let returnTableRow = []
    let fontSize = ""

    _.map(transactionList, (item, index) => {
        let {description, day, formatCost, _id} = item
        var itemDay = new Date(day)
        var preparedDescription = description

        if(index > 0){
            var previousItemDay = new Date(transactionList[index-1].day)
            if(this.isSameDay(itemDay, previousItemDay)){
                itemDay = null
            }
        }

        moment.locale('th')

        if(preparedDescription.length > 25){
            preparedDescription = preparedDescription.substring(0,22)
            preparedDescription = preparedDescription + "..."
        }
        else{
            fontSize = "15px"
        }
        
        returnTableRow.push(
            <React.Fragment key={_id}>
            <tr>
                <td>{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                <td style={{fontSize}}>
                    <Link to={{pathname: `/costs/view`,
                            state: {_id, stockId}}}>
                            {preparedDescription}
                    </Link>
                </td>
                <td>{formatCost}</td>
            </tr>
            </React.Fragment>
        )

    })

    var additionalRow = 20 - transactionList.length
                                       
    var loop = 0
    for(loop = 0; loop < additionalRow; loop++){
        returnTableRow.push(
            <tr key={loop}>
                <td style={{lineHeight: "22px"}}>&nbsp;</td>
                <td style={{lineHeight: "22px"}}>&nbsp;</td>
                <td style={{lineHeight: "22px"}}>&nbsp;</td>
            </tr>
        )
    }

    return returnTableRow

}

setCurrentPage(page, type, canClick){
    if(type === "Cost" && canClick){
        sessionStorage.setItem(sessionEnums.currentPageTrackerCost_1, page.toString())
        this.setState({currentCostPage: page})
    }
    else if(type === "Revenue" && canClick){
        sessionStorage.setItem(sessionEnums.currentPageTrackerCost_2, page.toString())
        this.setState({currentRevenuePage: page})
    }
}

renderPaginationBody(arrayOfPage, type){
    arrayOfPage.unshift(-1)
    arrayOfPage.push(-2)
    let isFirstPage = true
    let isLastPage = true
    let activePage = 0
    if(type === "Cost"){
        isFirstPage = this.state.currentCostPage === arrayOfPage[1]
        isLastPage = this.state.currentCostPage === arrayOfPage[arrayOfPage.length - 2]
        activePage = this.state.currentCostPage
    }
    else if(type === "Revenue"){
        isFirstPage = this.state.currentRevenuePage === arrayOfPage[1]
        isLastPage = this.state.currentRevenuePage === arrayOfPage[arrayOfPage.length - 2]
        activePage = this.state.currentRevenuePage
    }

    return _.map(arrayOfPage, (page, index) => {
        if(page === -1){
            return <li key={index} onClick={() => this.setCurrentPage(activePage - 1, type, !isFirstPage)} className={isFirstPage ? "disabled" : "waves-effect"} style={{width: "25px"}}><i className="material-icons">chevron_left</i></li>
        }
        else if(page === -2){
            return <li key={index} onClick={() => this.setCurrentPage(activePage + 1, type, !isLastPage)} className={isLastPage ? "disabled" : "waves-effect"} style={{width: "25px", left: "-5px", position: "relative"}}><i className="material-icons">chevron_right</i></li>
        }
        else{
            return <li key={index}  onClick={() => this.setCurrentPage(arrayOfPage[index], type, !(activePage === arrayOfPage[index]))} className={activePage === arrayOfPage[index] ? "active" : "waves-effect"} style={{width: "25px"}}>{arrayOfPage[index]}</li>
        }
    })
}

renderPagination(filteredTransaction, type){
    var numberOfPage = type === "Cost" ? this.state.currentCostPage : this.state.currentRevenuePage
    var loop = 0
    var arrayOfPage = []
    
    // case 1 - space between current and maximum more than or equal 2
    // case 1.1 maximum page less than 5 -> show all
    // case 1.2 maximum page more 5 or equal and current >= 3 -> make current into be a middle page
    // case 1.3 same in 1.2 but current less than 3 -> show page from 1 to 5
    // case 2 - space between current and maximum less than 2
    // case 2.1 maximum page less than 5 -> show all
    // case 2.2 maximum page more than 5 or equal -> show with 5 page from (maximum - 4) to (maximum)

    let maximumPage = parseInt(((filteredTransaction.length - 1) / 20) + 1)
    maximumPage = maximumPage === 0 ? 1 : maximumPage 
    
    if(maximumPage < 5){
        for(loop = 1; loop <= maximumPage; loop++){
            arrayOfPage.push(loop)
        }
    }
    else{
        if(maximumPage - numberOfPage >= 2){
            if(numberOfPage > 2){
                for(loop = numberOfPage - 2; loop <= numberOfPage + 2; loop++){
                    arrayOfPage.push(loop)
                }
            }
            else{
                for(loop = 1; loop <= 5; loop++){
                    arrayOfPage.push(loop)
                }
            }
        }
        else{
            for(loop = maximumPage - 4; loop <= maximumPage; loop++){
                arrayOfPage.push(loop)
            }
        }
    }
    
    return(
        <ul className="col xl12 l12 m12 s12 pagination center">
            {this.renderPaginationBody(arrayOfPage, type)}
        </ul>
    )
}

  render() {
    const {handleSubmit, history, cost: {costTransactions}, invalid} = this.props
    const {stockId} = this.props.location.state

    if(costTransactions != null){
        var costFilteredTransaction = costTransactions.filter(x => x.costType === "Cost" && x._stock === stockId && this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth)))
        costFilteredTransaction = costFilteredTransaction.sort(this.sortDayForTransaction)
        var slicedCostFilteredTransaction = costFilteredTransaction.slice((this.state.currentCostPage - 1) * 20, this.state.currentCostPage * 20)

        var revenueFilteredTransaction = costTransactions.filter(x => x.costType === "Revenue" && x._stock === stockId && this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth)))
        revenueFilteredTransaction = revenueFilteredTransaction.sort(this.sortDayForTransaction)
        var slicedRevenueFilteredTransaction = revenueFilteredTransaction.slice((this.state.currentRevenuePage - 1) * 20, this.state.currentRevenuePage * 20)
    }

    return (
      <div className="container undernav">
        <div className="row">
            <div className="col xl9 l9 m8 s12">
                <h5 className="col s12 m12 l12 xl12">
                    <i >
                        <FontAwesomeIcon className="fas fa-sm" icon="dollar-sign"/>
                    </i>
                    <span style={shiftLeft10}>{`ค่าใช้จ่ายคลังสินค้า / คลัง : ${this.props.location.state.stockName}`}</span>
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
                </div>
            </div>
            <div className="col xl3 l3 m4 s12" >
                  <div className="col xl12 l12 m12 s12" id="addNewRecordButton">
                      <div data-target="addModal" className="modal-trigger waves-effect waves-light btn-small green accent-3"><i className="material-icons right">arrow_upward</i>เพิ่มรายการ</div>
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
                                disabled={this.state.isLoadingImportExportCost} 
                            />
                        </div>
                        {
                            this.state.isLoadingTransaction === false && (
                                <div>
                                    <CostMonthlySummaryPanel color={"red lighten-1"} message={"รายจ่ายจากการนำเข้าสินค้า"} currentMonth={this.state.currentMonth} cost={this.state.currentImportTotal}/>
                                    <CostMonthlySummaryPanel color={"green lighten-1"} message={"รายรับจากการนำออกสินค้า"} currentMonth={this.state.currentMonth} cost={this.state.currentExportTotal}/>
                                </div>
                            )
                        }
                        <div className="col xl6 l6 m12 s12">
                                <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                                    <h6>รายจ่าย</h6>
                                </div>
                                    {costTransactions.length === 0 && (
                                        <EmptyTransactionNotice message="ไม่มีค่าใช้จ่ายขณะนี้"/>
                                    )}
                                    {costTransactions.length !== 0 && (
                                        <div className="col card small xl12 l12 m12 s12" style={{ height: "auto"}}>
                                            <table className="highlight centered">
                                                <thead>
                                                <tr>
                                                    <CostTransactionTableHeader />
                                                </tr>
                                                </thead>
                                                <tbody>
                                                    {this.renderTableBody("Cost", slicedCostFilteredTransaction)}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    
                            {this.renderPagination(costFilteredTransaction, "Cost")}
                        </div>
                        
                        <div className="col xl6 l6 m12 s12">
                            <div className="col xl12 l12 m12 s12" style={{left: "5px", position: "relative"}}>
                                <h6>รายรับ</h6>
                            </div>
                            {costTransactions.length === 0 && (
                                        <EmptyTransactionNotice message="ไม่มีค่าใช้จ่ายขณะนี้"/>
                             )}
                             {costTransactions.length !== 0 && (
                                <div className="col card small xl12 l12 m12 s12" style={{ height: "auto"}}>
                                    <table className="highlight centered">
                                    <thead>
                                    <tr>
                                        <CostTransactionTableHeader />
                                    </tr>
                                    </thead>
                        
                                    <tbody>
                                        {this.renderTableBody("Revenue", slicedRevenueFilteredTransaction)}
                                    </tbody>
                                    </table>
                                </div>
                             )}
                                
                            {this.renderPagination(revenueFilteredTransaction, "Revenue")}
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
                            disabled={this.state.isLoadingImportExportCost} 
                        />
                    </div>
                    <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                        <h6>รายจ่าย</h6>
                    </div>
                        {costTransactions.length === 0 && (
                            <EmptyTransactionNotice message="ไม่มีค่าใช้จ่ายขณะนี้"/>
                        )}
                        {costTransactions.length !== 0 && (
                            <div className="col card small xl12 l12 m12 s12" style={{ height: "auto"}}>
                                <table className="highlight centered">
                                    <thead>
                                    <tr>
                                        <CostTransactionTableHeader />
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderTableBody("Cost", slicedCostFilteredTransaction)}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                    {this.renderPagination(costFilteredTransaction, "Cost")}
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
                            disabled={this.state.isLoadingImportExportCost} 
                        />
                    </div>
                    <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                        <h6>รายรับ</h6>
                    </div>
                    {costTransactions.length === 0 && (
                        <EmptyTransactionNotice message="ไม่มีค่าใช้จ่ายขณะนี้"/>
                    )}
                    {costTransactions.length !== 0 && (
                        <div className="col card small xl12 l12 m12 s12" style={{ height: "auto"}}>
                            <table className="highlight centered">
                            <thead>
                            <tr>
                                <CostTransactionTableHeader />
                            </tr>
                            </thead>
                
                            <tbody>
                                {this.renderTableBody("Revenue", slicedRevenueFilteredTransaction)}
                            </tbody>
                            </table>
                        </div>
                    )}
                        
                    {this.renderPagination(revenueFilteredTransaction, "Revenue")}
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

CostTransactionDetail = connect(mapStateToProps,{addNewCostTransaction, 
    fetchTransaction, deleteCostTransaction, editCostTransaction, resetCostTransactionError,
    getTotalImport, getTotalExport})(CostTransactionDetail)

export default CostTransactionDetail
