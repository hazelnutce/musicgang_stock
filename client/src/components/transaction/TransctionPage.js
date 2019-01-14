import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {connect} from 'react-redux'

import {fetchStockInTransaction} from '../../actions/transaction'
import {LoaderSpinner} from '../commons/LoaderSpinner'
import {TransactionDetail} from './TransactionDetail'

const shiftLeftMinus45 = {
    left: "-45px",
    position: "relative"
}


export class TransctionPage extends Component {

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

    return (
      <TransactionDetail stocksInTransaction={stocksInTransaction}/>
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
            <h5 className="col s12"><i><FontAwesomeIcon className="fas fa-sm" icon="arrow-up"/></i><i style={shiftLeftMinus45}><FontAwesomeIcon className="fas fa-sm" icon="arrow-down"/></i> นำเข้า - นำออก</h5>
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

export default connect(mapStateToProp, {fetchStockInTransaction})(TransctionPage)
