import React, { Component } from 'react'
import {MonthPicker} from '../commons/MonthPicker'
import {connect} from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import M from 'materialize-css'
import {Link} from 'react-router-dom'

import {fetchTransaction} from '../../actions/transaction'
import {LoaderSpinner} from '../commons/LoaderSpinner'

export class TransactionListSummaryPage extends Component {
    constructor(props){
        super(props)

        var d = new Date()
        var n = d.getMonth()
        var y = d.getFullYear()

        this.state = {
            currentMonth :  y * 12 + n,
            loadingTransaction : false
        }
    }

    handleAddMonth = () => {
        this.setState({currentMonth: this.state.currentMonth + 1}, () => {
            this.initToolTip()
        })
    }

    handleMinusMonth = () => {
        this.setState({currentMonth: this.state.currentMonth - 1}, () => {
            this.initToolTip()
        })
    }

    handleSetMonth = (integerMonth) => {
        this.setState({currentMonth: integerMonth}, () => {
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
        if(newADay < newBDay)
            return -1
        if(a.newADay > b.newBDay)
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
    
    renderSmallImportTransaction = () => {
        var {items} = this.props
        var {transactions} = this.props.transaction
        var filteredTransaction = transactions.filter(x => x.type === "import" && this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth)))
        filteredTransaction = filteredTransaction.sort(this.sortDayForTransaction)
        return _.map(filteredTransaction, (item, index) => {
            const {_id, itemName, itemAmount, formatTotal, discount, overcost, formatDiscount, formatOvercost, day} = item
            var itemDay = new Date(day)
            var copiedItemDay = itemDay
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
                    <td>{itemName}</td>
                    <td>{itemAmount}</td>
                    {tooltipMessage !== null && <td className="tooltipped" data-tooltip={tooltipMessage}>{formatTotal}</td>}
                    {tooltipMessage === null && <td>{formatTotal}</td>}
                    <td>
                        <Link to={{ pathname: `/transactions/edit`, 
                                state: { _id, itemDay: copiedItemDay, itemName, itemAmount, formatDiscount, formatOvercost, formatTotal, items }}}
                                className="material-icons black-text">edit
                        </Link>
                    </td>
                </tr>
            )
        })
    }

    renderSmallExportTransaction = () => {
        var {items} = this.props
        var {transactions} = this.props.transaction
        var filteredTransaction = transactions.filter(x => x.type === "export" && this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth)))
        filteredTransaction = filteredTransaction.sort(this.sortDayForTransaction)
        return _.map(filteredTransaction, (item, index) => {
            const {_id, itemName, itemAmount, formatTotal, discount, overcost, formatDiscount, formatOvercost, day} = item
            var itemDay = new Date(day)
            var copiedItemDay = itemDay
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
                    <td>{itemName}</td>
                    <td>{itemAmount}</td>
                    {tooltipMessage !== null && <td className="tooltipped" data-tooltip={tooltipMessage}>{formatTotal}</td>}
                    {tooltipMessage === null && <td>{formatTotal}</td>}
                    <td>
                        <Link to={{ pathname: `/transactions/edit`, 
                                state: { _id, itemDay: copiedItemDay, itemName, itemAmount, formatDiscount, formatOvercost, formatTotal, items }}}
                                className="material-icons black-text">edit
                        </Link>
                    </td>
                </tr>
            )
        })
    }

    render() {
      if(this.state.loadingTransaction){
      const {isSelectAllTransaction, isSelectTransactionIn, isSelectTransactionOut} = this.props
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
                                    {this.renderSmallImportTransaction()}
                                </tbody>
                            </table>
                        </div>
                        </div>        
                        <div className="col xl6 l6 m12 s12">
                            <div className="col xl12 l12 m12 s12" style={{left: "5px", position: "relative"}}>
                                <h6>สินค้านำออก</h6>
                            </div>
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
                                    {this.renderSmallExportTransaction()}
                                </tbody>
                                </table>
                            </div>
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
                            {this.renderSmallImportTransaction()}
                        </tbody>
                    </table>
                </div>
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
                            {this.renderSmallExportTransaction()}
                        </tbody>
                    </table>
                </div>
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
