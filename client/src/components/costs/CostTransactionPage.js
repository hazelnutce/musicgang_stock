import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import {fetchStockInTransaction} from '../../actions/transaction'
import {LoaderSpinner} from '../commons/LoaderSpinner'
import _ from 'lodash'

const shiftLeft10 = {
  left: "10px",
  position: "relative"
}

export class CostTransactionPage extends Component {

  constructor(props){
    super(props)

    this.state = {
      loadingStock: false
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

  render() {
    if(!this.state.loadingStock){
      return (
        <LoaderSpinner loading={this.state.loadingCategory} color={'#123abc'}/>
      )
    }
    else{
      return (
        <div className="container" style={{position: "relative", top: "5px"}}>
          <div className="row">
            <h5 className="col s12"><i><FontAwesomeIcon className="fas fa-sm" icon="dollar-sign"/></i><span style={shiftLeft10}>ค่าใช้จ่ายคลังสินค้า</span></h5>
          </div>
          <div className="row">
              <div className="col s12">
                  {this.renderTransactionStock(this.props.transaction.stockList)}
               </div>
          </div>
        </div>
      )
    }

  }
}

function mapStateToProp(state){
  return {transaction : state.transaction}
}

export default connect(mapStateToProp, {fetchStockInTransaction})(CostTransactionPage)
