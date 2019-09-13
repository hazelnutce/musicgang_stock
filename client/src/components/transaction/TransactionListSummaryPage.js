import React, { Component } from 'react'
import {MonthPicker} from '../commons/MonthPicker'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import M from 'materialize-css'
import {Link} from 'react-router-dom'

import {fetchTransaction} from '../../actions/transaction'
import {LoaderSpinner} from '../commons/LoaderSpinner'
import {EmptyTransactionNotice} from '../commons/EmptyTransactionNotice'

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
            currentExportPage: parseInt(exportPage)
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
    }

    handleMinusMonth = () => {
        let newMonth = this.state.currentMonth - 1
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_1, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_2, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_month, newMonth.toString())
        this.setState({currentMonth: newMonth, currentImportPage: 1, currentExportPage: 1}, () => {
            this.initToolTip()
        })
    }

    handleSetMonth = (integerMonth) => {
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_1, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_2, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerTransaction_month, integerMonth.toString())
        this.setState({currentMonth: integerMonth, currentImportPage: 1, currentExportPage: 1}, () => {
            this.initToolTip()
        })
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
            }) 
        }
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

    renderRemainingItem(filteredTransaction){
        var additionalRow = 20 - filteredTransaction.length 
                                       
        var loop = 0
        var returnElement = []
        for(loop = 0; loop < additionalRow; loop++){
            returnElement.push(
                <tr key={loop}>
                    <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                    <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                    <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                    <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                    <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                </tr>
            )

        }
        return returnElement
    }

    render() {
      if(this.state.loadingTransaction){
      const {isSelectAllTransaction, isSelectTransactionIn, isSelectTransactionOut, stockId, transaction: {transactions}} = this.props

      var importFilteredTransaction = transactions.filter(x => x.type === "import" && 
                                                      x._stock === stockId &&
                                                      this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth)))
      importFilteredTransaction = importFilteredTransaction.sort(this.sortDayForTransaction)
      var slicedImportFilteredTransaction = importFilteredTransaction.slice((this.state.currentImportPage-1) * 20, this.state.currentImportPage * 20)
      

      var exportFilteredTransaction = transactions.filter(x => x.type === "export" &&
                                                          x._stock === stockId && 
                                                          this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth)))
      exportFilteredTransaction = exportFilteredTransaction.sort(this.sortDayForTransaction)
      var slicedExportFilteredTransaction = exportFilteredTransaction.slice((this.state.currentExportPage-1) * 20, this.state.currentExportPage * 20)

      if(isSelectAllTransaction === true){
        return (
                <div className="container-fluid">
                    <div className="row">
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
                                <h6>สินค้านำเข้า</h6>
                            </div>
                            {slicedImportFilteredTransaction.length === 0 && 
                                <EmptyTransactionNotice message="ไม่มีรายการในขณะนี้"/>}
                            {slicedImportFilteredTransaction.length !== 0 && (
                                <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative", height: "auto"}}>
                                <table className="highlight centered">
                                    <thead>
                                    <tr>
                                        <th>วันที่</th>
                                        <th>ชื่อสินค้า</th>
                                        <th>จำนวน</th>
                                        <th>ราคา</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                    
                                    <tbody>
                                        {this.renderSmallImportTransaction(slicedImportFilteredTransaction)}
                                        {this.renderRemainingItem(slicedImportFilteredTransaction)}
                                    </tbody>
                                </table>
                                </div>
                            )}
                            
                            {this.renderPagination(importFilteredTransaction, "import")}
                        </div>        
                        <div className="col xl6 l6 m12 s12">
                            <div className="col xl12 l12 m12 s12" style={{left: "5px", position: "relative"}}>
                                <h6>สินค้านำออก</h6>
                            </div>
                            {slicedExportFilteredTransaction.length === 0 && 
                                <EmptyTransactionNotice message="ไม่มีรายการในขณะนี้"/>}
                            {slicedExportFilteredTransaction.length !== 0 && (
                                <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative", height: "auto"}}>
                                    <table className="highlight centered">
                                    <thead>
                                    <tr>
                                        <th>วันที่</th>
                                        <th>ชื่อสินค้า</th>
                                        <th>จำนวน</th>
                                        <th>ราคา</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                        
                                    <tbody>
                                        {this.renderSmallExportTransaction(slicedExportFilteredTransaction)}
                                        {this.renderRemainingItem(slicedExportFilteredTransaction)}
                                    </tbody>
                                    </table>
                                </div>
                            )}
                            
                            {this.renderPagination(exportFilteredTransaction, "export")}
                        </div>
                    </div>
                </div>
            
        )
      }
      else if(isSelectTransactionIn === true){
        return (
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
                    <h6>สินค้านำเข้า</h6>
                </div>
                {slicedImportFilteredTransaction.length === 0 && 
                    <EmptyTransactionNotice message="ไม่มีรายการในขณะนี้"/>}
                {slicedImportFilteredTransaction.length !== 0 && (
                    <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative", height: "auto"}}>
                        <table className="highlight centered">
                            <thead>
                                <tr>
                                    <th>วันที่</th>
                                    <th>ชื่อสินค้า</th>
                                    <th>จำนวน</th>
                                    <th>ราคา</th>
                                    <th></th>
                                </tr>
                            </thead>
            
                            <tbody>
                                {this.renderSmallImportTransaction(slicedImportFilteredTransaction)}
                                {this.renderRemainingItem(slicedImportFilteredTransaction)}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {this.renderPagination(importFilteredTransaction, "import")}
            </div>
        )
      }
      else if(isSelectTransactionOut === true){
        return (
            <div className="row">
                <div className="col x12 l12 m12 s12 center">
                    <MonthPicker 
                        handleAddMonth={this.handleAddMonth} 
                        handleMinusMonth={this.handleMinusMonth} 
                        handleSetMonth={this.handleSetMonth}
                        currentMonth={this.state.currentMonth} 
                    />
                </div>
                <div className="col xl12 l12 m12 s12" style={{left: "5px", position: "relative"}}>
                    <h6>สินค้านำออก</h6>
                </div>
                {slicedExportFilteredTransaction.length === 0 && 
                    <EmptyTransactionNotice message="ไม่มีรายการในขณะนี้"/>}
                {slicedExportFilteredTransaction.length !== 0 && (
                    <div className="col card small xl12 l12 m12 s12" style={{left: "5px", position: "relative", height: "auto"}}>
                    <table className="highlight centered">
                    <thead>
                            <tr>
                                <th>วันที่</th>
                                <th>ชื่อสินค้า</th>
                                <th>จำนวน</th>
                                <th>ราคา</th>
                                <th></th>
                            </tr>
                        </thead>
        
                        <tbody>
                            {this.renderSmallExportTransaction(slicedExportFilteredTransaction)}
                            {this.renderRemainingItem(slicedExportFilteredTransaction)}
                        </tbody>
                    </table>
                </div>
                )}    
                
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
