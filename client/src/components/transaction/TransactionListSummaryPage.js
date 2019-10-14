import React, { Component } from 'react'
import {MonthPicker} from '../commons/MonthPicker'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import M from 'materialize-css'
import {Link} from 'react-router-dom'

import {fetchTransaction} from '../../actions/transaction'
import {LoaderSpinner} from '../commons/LoaderSpinner'

import DayPickerInput from 'react-day-picker/DayPickerInput'
import MomentLocaleUtils, {
    formatDate,
    parseDate,
  } from 'react-day-picker/moment';

const sessionEnums = {
    currentPageTrackerTransaction_1: 'currentPageTrackerTransaction_1',
    currentPageTrackerTransaction_2: 'currentPageTrackerTransaction_2',
    currentPageTrackerTransaction_month: 'currentPageTrackerTransaction_month'
}

export class TransactionListSummaryPage extends Component {
    constructor(props){
        super(props)

        var importPage = sessionStorage.getItem(sessionEnums.currentPageTrackerTransaction_1)
        var exportPage = sessionStorage.getItem(sessionEnums.currentPageTrackerTransaction_2)
        var month = sessionStorage.getItem(sessionEnums.currentPageTrackerTransaction_month)

        this.state = {
            currentMonth :  parseInt(month),
            loadingTransaction : false,
            currentImportPage: parseInt(importPage),
            currentExportPage: parseInt(exportPage),
            currentDaySetting: false,
            currentDaySettingValue: new Date(new Date().setHours(0,0,0,0))
        }
    }

    handleDaySetting = () => {
        this.setState({currentDaySetting: !this.state.currentDaySetting})
    }

    handleSettingDayChange = (day) => {
        if((day instanceof Date)){
          this.setState({ currentDaySettingValue: day });
        }
      }

    handleAddMonth = () => {
        let newMonth = this.state.currentMonth + 1
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_1, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_2, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_month, newMonth.toString())
        this.setState({currentMonth: newMonth, currentImportPage: 1, currentExportPage: 1}, () => {
            this.initToolTip()
        })
        this.setState({currentDaySettingValue : new Date(newMonth/12, newMonth%12, 1)})
    }

    handleMinusMonth = () => {
        let newMonth = this.state.currentMonth - 1
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_1, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_2, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_month, newMonth.toString())
        this.setState({currentMonth: newMonth, currentImportPage: 1, currentExportPage: 1}, () => {
            this.initToolTip()
        })
        this.setState({currentDaySettingValue : new Date(newMonth/12, newMonth%12, 1)})
    }

    handleSetMonth = (integerMonth) => {
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_1, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_2, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_month, integerMonth.toString())
        this.setState({currentMonth: integerMonth, currentImportPage: 1, currentExportPage: 1}, () => {
            this.initToolTip()
        })
        this.setState({currentDaySettingValue : new Date(integerMonth/12, integerMonth%12, 1)})
    }

    componentWillReceiveProps = () => {
        setTimeout(() => {
            this.initToolTip()
        }, 200);
        
    }

    componentDidMount = () => {
        this.props.fetchTransaction()
    }

    componentDidUpdate = (prevProps) => {
        if(prevProps.transaction !== this.props.transaction){
            this.setState({
                loadingTransaction: true,
            }, () => {
                this.initToolTip()
                setTimeout(() => {
                    this.initPagingModal()
                }, 100);
            }) 
        }
    }

    isSameDaySetting = (d1) => {
        let d2 = this.state.currentDaySettingValue
        if(this.state.currentDaySetting === true){
            return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
        }
        return true
    }

    isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
    }

    isSameMonth = (d1, d2) => {
        return d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();
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

    handleTooltipMessage = (discount, overcost, formatDiscount, formatOvercost) => {
        if(discount === 0 && overcost !== 0){
            return `คิดเงินเกิน : ${formatOvercost}`
        }
        else if(discount !== 0 && overcost === 0){
            return `ส่วนลด : ${formatDiscount}`
        }
        else if(discount !== 0 && overcost !== 0){
            return `ส่วนลด : ${formatDiscount} <br/> คิดเงินเกิน : ${formatOvercost}`
        }
        return null
    }

    handleMonthFilter = (monthConst) => {
        var monthFilter = monthConst % 12
        var yearFilter = monthConst / 12
        return new Date(yearFilter, monthFilter, 1)
    }



    initToolTip = () => {
        var elems = document.querySelectorAll('.tooltipped');
        var options = {
            position: "right"
        }
        M.Tooltip.init(elems, options);
    }

    initPagingModal = () => {
        var elems = document.querySelectorAll('#pagingModal');
        M.Modal.init(elems, {
            opacity: 0.6
        });
    }
    
    renderSmallImportTransaction = (filteredTransaction) => {
        const {stockId} = this.props
        return _.map(filteredTransaction, (item, index) => {
            var {_id, itemName, itemAmount, formatTotal, discount, overcost, formatDiscount, formatOvercost, day} = item
            var itemDay = new Date(day)
            
            if(index > 0){
                var previousItemDay = new Date(filteredTransaction[index-1].day)
                if(this.isSameDay(itemDay, previousItemDay)){
                    itemDay = null
                }
            }
            var tooltipMessage = this.handleTooltipMessage(discount, overcost, formatDiscount, formatOvercost)
            moment.locale('th')
            
            return(
                <tr key={_id}>
                    <td className="smaller_gap">{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                    <td className="smaller_gap">
                        <Link to={{pathname: `/transactions/view`,
                                    state: {_id, stockId} }}>
                                {itemName}
                        </Link>
                    </td>
                    <td className="smaller_gap">{itemAmount}</td>
                    {tooltipMessage !== null && <td className="tooltipped smaller_gap" data-tooltip={tooltipMessage}>{formatTotal}</td>}
                    {tooltipMessage === null && <td className="smaller_gap">{formatTotal}</td>}
                </tr>
            )
        })
    }

    renderSmallExportTransaction = (filteredTransaction) => {
        const {stockId} = this.props
        return _.map(filteredTransaction, (item, index) => {
            var {_id, itemName, itemAmount, formatTotal, discount, overcost, formatDiscount, formatOvercost, day} = item
            var itemDay = new Date(day)

            if(index > 0){
                var previousItemDay = new Date(filteredTransaction[index-1].day)
                if(this.isSameDay(itemDay, previousItemDay)){
                    itemDay = null
                }
            }

            var tooltipMessage = this.handleTooltipMessage(discount, overcost, formatDiscount, formatOvercost)
            if(item.isUsedInMusicGang === true){
                tooltipMessage = "ใช้ในห้องซ้อม"
            }
            
            moment.locale('th')
            return(
                <tr key={_id}>
                    <td>{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                    <td>
                        <Link to={{pathname: `/transactions/view`,
                                    state: {_id, stockId} }}>
                                {itemName}
                        </Link>
                    </td>
                    <td>{itemAmount}</td>
                    {tooltipMessage !== null && <td className="tooltipped" data-tooltip={tooltipMessage}>{formatTotal}</td>}
                    {tooltipMessage === null && <td>{formatTotal}</td>}
                </tr>
            )
        })
    }

    setCurrentPage(page, type, canClick){
        if(type === "import" && canClick){
            sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_1, page.toString())
            this.setState({currentImportPage: page})
        }
        else if(type === "export" && canClick){
            sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_2, page.toString())
            this.setState({currentExportPage: page})
        }
    }

    renderPaginationBodyModal(arrayOfPage, type){
        let activePage = 0
        if(type === "import"){
            activePage = this.state.currentImportPage
        }
        else if(type === "export"){
            activePage = this.state.currentExportPage
        }
        var returnElement = []
        _.map(arrayOfPage, (page, index) => {
            returnElement.push(<li key={index}  onClick={() => this.setCurrentPage(arrayOfPage[index], type, !(activePage === arrayOfPage[index]))} className={activePage === arrayOfPage[index] ? "active" : "waves-effect"} style={{width: "25px"}}>{arrayOfPage[index]}</li>)
            if(page % 10 === 0){
                returnElement.push(<br />)
            }
        })

        return returnElement
    }

    renderPaginationBody(arrayOfPage, type){
        arrayOfPage.unshift(-1)
        arrayOfPage.push(-2)
        let isFirstPage = true
        let isLastPage = true
        let activePage = 0
        if(type === "import"){
            isFirstPage = this.state.currentImportPage === arrayOfPage[1]
            isLastPage = this.state.currentImportPage === arrayOfPage[arrayOfPage.length - 2]
            activePage = this.state.currentImportPage
        }
        else if(type === "export"){
            isFirstPage = this.state.currentExportPage === arrayOfPage[1]
            isLastPage = this.state.currentExportPage === arrayOfPage[arrayOfPage.length - 2]
            activePage = this.state.currentExportPage
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
        var numberOfPage = type === "import" ? this.state.currentImportPage : this.state.currentExportPage
        var loop = 0
        var arrayOfPage = []
        
        // case 1 - space between current and maximum more than or equal 2
        // case 1.1 maximum page less than 5 -> show all
        // case 1.2 maximum page more 5 or equal and current >= 3 -> make current into be a middle page
        // case 1.3 same in 1.2 but current less than 3 -> show page from 1 to 5
        // case 2 - space between current and maximum less than 2
        // case 2.1 maximum page less than 5 -> show all
        // case 2.2 maximum page more than 5 or equal -> show with 5 page from (maximum - 4) to (maximum)

        let maximumPage = parseInt(((filteredTransaction.length - 1) / 50) + 1)
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

        var arrayOfPageModal = []
        for(loop = 1; loop <= maximumPage; loop++){
            arrayOfPageModal.push(loop)
        }
        
        return(
            <div>
                <div style={{display : 'inline-block'}}>
                    <ul className="col xl12 l12 m12 s12 pagination center">
                        <span style={{fontSize: "17px"}}>หน้า : </span>
                        {this.renderPaginationBody(arrayOfPage, type)}
                    </ul>
                </div>
                
                <div data-target="pagingModal" className="modal-trigger" style={{display : 'inline-block', bottom: "15px", position: "relative", cursor: "pointer"}}>
                    <i className="material-icons">menu</i>
                </div>

                <div id="pagingModal" className="modal">
                    <div className="modal-content">
                       <h6>เลือกหน้าแสดงผล</h6>
                       <ul className="col xl12 l12 m12 s12 pagination center">
                            {this.renderPaginationBodyModal(arrayOfPageModal, type)}
                       </ul>
                    </div>
                    <div className="modal-footer">
                        <div className="modal-close waves-effect waves-light btn-small red white-text" style={{marginRight: "20px"}}>ปิด</div>
                    </div>
                </div>
            </div>
        )
    }

    renderRemainingItem(filteredTransaction){
        var additionalRow = 50 - filteredTransaction.length 
                                       
        var loop = 0
        var returnElement = []
        for(loop = 0; loop < additionalRow; loop++){
            returnElement.push(
                <tr key={loop}>
                    <td className="smaller_gap">&nbsp;</td>
                    <td className="smaller_gap">&nbsp;</td>
                    <td className="smaller_gap">&nbsp;</td>
                    <td className="smaller_gap">&nbsp;</td>
                </tr>
            )

        }
        return returnElement
    }

    render() {
      if(this.state.loadingTransaction){
        const {isSelectTransactionIn, isSelectTransactionOut, stockId, transaction: {transactions}} = this.props

        var importFilteredTransaction = transactions.filter(x => x.type === "import" && 
                                                        x._stock === stockId &&
                                                        this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth)) &&
                                                        this.isSameDaySetting(new Date(x.day)))
        importFilteredTransaction = importFilteredTransaction.sort(this.sortDayForTransaction)
        var slicedImportFilteredTransaction = importFilteredTransaction.slice((this.state.currentImportPage-1) * 50, this.state.currentImportPage * 50)
        

        var exportFilteredTransaction = transactions.filter(x => x.type === "export" &&
                                                            x._stock === stockId && 
                                                            this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth))&& 
                                                            this.isSameDaySetting(new Date(x.day)))

        exportFilteredTransaction = exportFilteredTransaction.sort(this.sortDayForTransaction)
        var slicedExportFilteredTransaction = exportFilteredTransaction.slice((this.state.currentExportPage-1) * 50, this.state.currentExportPage * 50)

        if(isSelectTransactionIn === true){
            return (
                <div className="row">
                    <div className="col xl12 l12 m12 s12 center">
                        <MonthPicker 
                            handleAddMonth={this.handleAddMonth} 
                            handleMinusMonth={this.handleMinusMonth} 
                            handleSetMonth={this.handleSetMonth}
                            currentMonth={this.state.currentMonth}
                        >
                            <span onClick={() => this.handleDaySetting()} style={{top: "10px", left: "10px", position: "relative", cursor: "pointer"}}>
                                 <i className="material-icons">settings</i>
                            </span>
                        </MonthPicker>
                    </div>
                    {
                        this.state.currentDaySetting === true && (
                            <div className="col xl12 l12 m12 s12">
                                <DayPickerInput 
                                    classNames={{
                                        container: "input-field col xl6 l8 m8 s12",
                                        overlayWrapper: "DayPickerInput-OverlayWrapper",
                                        overlay: "DayPickerInput-Overlay"
                                    }}
                                    value={this.state.currentDaySettingValue}
                                    onDayChange={this.handleSettingDayChange} 
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    format={"LL"}
                                    placeholder={`${formatDate(new Date(), 'LL', 'th')}`}
                                    dayPickerProps={{
                                        locale: 'th',
                                        localeUtils: MomentLocaleUtils,
                                        canChangeMonth: false
                                    }}
                                />
                            </div>
                        )
                    }
                    <div className="col xl6 l6 m6 s6" style={{right: "5px", top: "10px", position: "relative"}}>
                        <h6>สินค้านำเข้า</h6>
                    </div>
                    <div className="col xl6 l6 m6 s6">
                        <div className="right">
                            {this.renderPagination(importFilteredTransaction, "import")} 
                        </div>
                    </div>
                    <div className="col xl12 l12 m12 s12 import-table">
                        <table className="table-bordered center">
                            <thead>
                                <tr>
                                    <th className="smaller_height_header smaller_gap">วันที่</th>
                                    <th className="smaller_height_header smaller_gap">ชื่อสินค้า</th>
                                    <th className="smaller_height_header smaller_gap">จำนวน</th>
                                    <th className="smaller_height_header smaller_gap">ราคา</th>
                                </tr>
                            </thead>
            
                            <tbody>
                                {this.renderSmallImportTransaction(slicedImportFilteredTransaction)}
                                {this.renderRemainingItem(slicedImportFilteredTransaction)}
                            </tbody>
                        </table>
                    </div>
                    {this.renderPagination(importFilteredTransaction, "import")}
                </div>
            )
        }
        else if(isSelectTransactionOut === true){
            return (
                <div className="row">
                    <div className="col xl12 l12 m12 s12 center">
                    <MonthPicker 
                            handleAddMonth={this.handleAddMonth} 
                            handleMinusMonth={this.handleMinusMonth} 
                            handleSetMonth={this.handleSetMonth}
                            currentMonth={this.state.currentMonth}
                        >
                            <span onClick={() => this.handleDaySetting()} style={{top: "10px", left: "10px", position: "relative", cursor: "pointer"}}>
                                 <i className="material-icons">settings</i>
                            </span>
                        </MonthPicker>
                    </div>
                    {
                        this.state.currentDaySetting === true && (
                            <div className="col xl12 l12 m12 s12">
                                <DayPickerInput 
                                    classNames={{
                                    container: "input-field col xl6 l8 m8 s12",
                                    overlayWrapper: "DayPickerInput-OverlayWrapper",
                                    overlay: "DayPickerInput-Overlay"
                                    }}
                                    value={this.state.currentDaySettingValue}
                                    onDayChange={this.handleSettingDayChange} 
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    format={"LL"}
                                    placeholder={`${formatDate(new Date(), 'LL', 'th')}`}
                                    dayPickerProps={{
                                        locale: 'th',
                                        localeUtils: MomentLocaleUtils,
                                        canChangeMonth: false
                                    }}
                                />
                            </div>
                        )
                    }
                    <div className="col xl6 l6 m6 s6" style={{right: "5px", top: "10px", position: "relative"}}>
                        <h6>สินค้านำเข้า</h6>
                    </div>
                    <div className="col xl6 l6 m6 s6">
                        <div className="right">
                            {this.renderPagination(importFilteredTransaction, "import")} 
                        </div>
                    </div>
                    <div className="col xl12 l12 m12 s12 import-table">
                        <table className="table-bordered center">
                            <thead>
                                <tr>
                                    <th className="smaller_height_header smaller_gap">วันที่</th>
                                    <th className="smaller_height_header smaller_gap">ชื่อสินค้า</th>
                                    <th className="smaller_height_header smaller_gap">จำนวน</th>
                                    <th className="smaller_height_header smaller_gap">ราคา</th>
                                </tr>
                            </thead>
            
                            <tbody>
                                {this.renderSmallImportTransaction(slicedExportFilteredTransaction)}
                                {this.renderRemainingItem(slicedExportFilteredTransaction)}
                            </tbody>
                        </table>
                    </div>
                    {this.renderPagination(exportFilteredTransaction, "export")}
                </div>
            )
        }
      }

      else{
          return(
            <LoaderSpinner loading={this.state.loadingTransaction} color={'#123abc'}/>
          )
      }
    }
}

function mapStateToProps(state){
    return {transaction : state.transaction}
}

export default connect(mapStateToProps, {fetchTransaction})(TransactionListSummaryPage)
