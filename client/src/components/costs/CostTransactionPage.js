import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import {fetchStockInTransaction, findSummaryTransaction} from '../../actions/transaction'
import {LoaderSpinner} from '../commons/LoaderSpinner'
import {MonthPicker} from '../commons/MonthPicker'
import _ from 'lodash'
import {CostMonthlySummaryPanel} from './CostMonthlySummaryPanel'

const shiftLeft10 = {
  left: "10px",
  position: "relative"
}

export class CostTransactionPage extends Component {

  constructor(props){
    super(props)

    var d = new Date()
    var n = d.getMonth()
    var y = d.getFullYear()

    this.state = {
      loadingStock: false,
      isShowAllTransaction: true,
      isLoadingTransaction : true,
      isLoadingImportExportCost: false,
      currentMonth :  y * 12 + n,
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.transaction.stockList !== this.props.transaction.stockList) {
      if(this.props.transaction !== null){
        this.setState({loadingStock: true}) 
      }
    }
  }
    
  componentDidMount = () => {
    this.props.fetchStockInTransaction()
    this.props.findSummaryTransaction(this.state.currentMonth)
  }

  handleCheckboxes = (buttonString) => {
      if(buttonString === "1"){
          this.setState({
              isShowAllTransaction : !this.state.isShowAllTransaction,
          })
      }
  }

  handleAddMonth = () => {
      this.setState({isLoadingImportExportCost: true})
      this.props.findSummaryTransaction(this.state.currentMonth + 1)
      this.setState({currentMonth: this.state.currentMonth + 1, 
          isLoadingImportExportCost: false})
    }

    handleMinusMonth = () => {
      this.setState({isLoadingImportExportCost: true})
      this.props.findSummaryTransaction(this.state.currentMonth - 1)
      this.setState({currentMonth: this.state.currentMonth - 1, 
          isLoadingImportExportCost: false})
    }

    handleSetMonth = (integerMonth) => {
      this.setState({isLoadingImportExportCost: true})
      this.props.findSummaryTransaction(integerMonth)
      this.setState({currentMonth: integerMonth, 
          isLoadingImportExportCost: false})
    }

  renderTransactionStock = (stocksInTransaction) => {
    if(stocksInTransaction.length === 0){
      return(
        <div className="card-panel yellow darken-1" style={{marginLeft: "10px",top:"-20px",position:"relative"}}>
          <span className="white-text">
            <span><i className="material-icons" style={{marginLeft: "10px",top:"5px",position:"relative"}}>warning</i></span>
            <span style={{marginLeft: "10px"}}>ไม่มีคลังสินค้าในระบบ</span>
          </span>
        </div>
      )
    }

    var filterStockInTransaction = stocksInTransaction
    return (
        _.map(filterStockInTransaction,(stock) => {
            return(
              <ul className="collapsible" style={{backgroundColor: "#eeeeee"}} key={stock._id}>
                <li>
                  <div className="collapsible-header"><i className="material-icons"><FontAwesomeIcon className="fas fa-sm" icon="boxes"/></i><Link to={{ state: {stockName : stock.stockName, stockId: stock._id}, pathname: `/costs/detail`}}>{stock.stockName}</Link></div>
                </li>
              </ul>
            )
          })
    )
  }

  renderAllTransactionForAllStock = () => {
    let {stockList} = this.props.transaction
    let {currentAllTransaction} = this.props.summary
    return _.map(stockList, (stock) => {
      let {stockName, _id} = stock
      let {cost, transaction} = currentAllTransaction
      let totalOtherCost = cost.filter(x => x.costType === "Cost" && x._stock === _id).reduce(function(prev, cur) {
        return prev + parseFloat(cur.formatCost.replace(',', ''));
      }, 0)
      let totalOtherRevenue = cost.filter(x => x.costType === "Revenue" && x._stock === _id).reduce(function(prev, cur) {
        return prev + parseFloat(cur.formatCost.replace(',', ''));
      }, 0)

      let totalImportTransaction = transaction.filter(x => x.type === "import" && x._stock === _id).reduce(function(prev, cur) {
        return prev + parseFloat(cur.formatTotal.replace(',', ''));
      }, 0)

      let totalExportTransaction = transaction.filter(x => x.type === "export" && x._stock === _id).reduce(function(prev, cur) {
        return prev + parseFloat(cur.formatTotal.replace(',', ''));
      }, 0)

      return (
        <div  key={_id}>
          <div className="col xl12 l12 m12 s12">
          <h6>{`คลังสินค้า : ${stockName}`}</h6>
          </div>
          <CostMonthlySummaryPanel color={"red lighten-1"} message={"รายจ่ายจากการนำเข้าสินค้า"} currentMonth={this.state.currentMonth} cost={totalImportTransaction}/>
          <CostMonthlySummaryPanel color={"green lighten-1"} message={"รายรับจากการนำออกสินค้า"} currentMonth={this.state.currentMonth} cost={totalExportTransaction}/>
          <CostMonthlySummaryPanel color={"red lighten-1"} message={"ค่าใช้จ่ายอื่นๆ"} currentMonth={this.state.currentMonth} cost={totalOtherCost}/>
          <CostMonthlySummaryPanel color={"green lighten-1"} message={"รายรับอื่นๆ"} currentMonth={this.state.currentMonth} cost={totalOtherRevenue}/>
        </div>
        
      )
    })
    
  }

  render() {
    if(!this.state.loadingStock){
      return (
        <LoaderSpinner loading={this.state.loadingCategory} color={'#123abc'}/>
      )
    }
    else{
      let {isCurrentAllTransactionLoading, currentAllTransaction : {musicroom}} = this.props.summary
      let  resultTotal = musicroom.reduce(function(prev, cur) {
          return prev + parseFloat(cur.formatPrice);
      }, 0)
      
      return (
        <div className="container undernav">
          <div className="row">
            <h5 className="col xl12 l12 m12 s12"><i><FontAwesomeIcon className="fas fa-sm" icon="dollar-sign"/></i><span style={shiftLeft10}>ค่าใช้จ่ายคลังสินค้า</span></h5>
            <div className="col s12 m12 l12 xl12">
              <div className="row">
                  <label className="col xl4 l4 m5 s6">
                      <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("1")} checked={this.state.isShowAllTransaction} />
                      <span>แสดงยอดรวมทุกรายการ</span>
                  </label>
              </div>
            </div>
          </div>
           
            <div className="row">
              <div className="col xl12 l12 m12 s12">
                  {this.renderTransactionStock(this.props.transaction.stockList)}
                  <div className="divider"></div>
              </div>
              {this.state.isShowAllTransaction && (
                 <>
                 {!isCurrentAllTransactionLoading && (
                   <div>
                       <div className="col xl12 l12 m12 s12 center">
                       <MonthPicker 
                           handleAddMonth={this.handleAddMonth} 
                           handleMinusMonth={this.handleMinusMonth} 
                           handleSetMonth={this.handleSetMonth}
                           currentMonth={this.state.currentMonth}
                           disabled={this.state.isLoadingImportExportCost} 
                       />
                     </div>
                     <div className="col xl12 l12 m12 s12">
                       <h6>ค่าห้องซ้อมรวม</h6>
                     </div>
                     <CostMonthlySummaryPanel color={"green lighten-1"} message={"รายรับรวมห้องซ้อมดนตรี"} currentMonth={this.state.currentMonth} cost={resultTotal}/>
                     {this.renderAllTransactionForAllStock()}
                   </div>
                 )}
                 {isCurrentAllTransactionLoading && (
                   <div className="row">
                     <LoaderSpinner loading={!isCurrentAllTransactionLoading} color={'#123abc'}/>
                   </div>
                 )}
                 </>
              )}
          </div>
          
          
        </div>
      )
    }

  }
}

function mapStateToProp(state){
  return {transaction : state.transaction, summary : state.summaryTransaction}
}

export default connect(mapStateToProp, {fetchStockInTransaction, findSummaryTransaction})(CostTransactionPage)
