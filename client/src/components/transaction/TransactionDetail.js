import React, { Component } from 'react'
import M from 'materialize-css'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom'

export class TransactionDetail extends Component {
    initCollapsible = () => {
        var elems = document.querySelectorAll('.collapsible');
        M.Collapsible.init(elems, {});
    }

    componentDidMount(){
        setTimeout(() => {
          this.initCollapsible()
        }, 250);
    }

  render() {  
    var filterStockInTransaction = this.props.stocksInTransaction
    return (
        _.map(filterStockInTransaction,(stock) => {
           if(stock.itemCount === 0){
             return (
              <ul className="collapsible" style={{backgroundColor: "#eeeeee"}} key={stock._id}>
                <li>
                  <div className="collapsible-header">
                    <i className="material-icons">
                      <FontAwesomeIcon className="fas fa-sm" icon="boxes"/>
                    </i>
                    <span style={{marginRight: "10px"}}>
                      {`${stock.stockName}`}
                    </span>
                    <i className="material-icons" style={{marginRight: "0px"}}>
                      warning
                    </i>
                    <span style={{marginRight: "5px"}}>
                      {`ขณะนี้ไม่มีสินค้าในคลัง /  `}
                    </span>
                    <Link to={{ pathname: `/items/add/new/${stock._id}`, state: {stockName : stock.stockName}}}>
                      {"เพิ่มสินค้า"}
                    </Link>
                  </div>
                </li>
              </ul>
             )
           }
            return(
              <ul className="collapsible" style={{backgroundColor: "#eeeeee"}} key={stock._id}>
                <li>
                  <div className="collapsible-header">
                    <i className="material-icons">
                      <FontAwesomeIcon className="fas fa-sm" icon="boxes"/>
                    </i>
                    <div style={{width: "150px"}}>
                      {stock.stockName}
                    </div>
                    <Link style={{marginLeft: "20px"}} to={{ state: {stockName : stock.stockName, stockId: stock._id}, pathname: `/transactions/detail`}}>
                      แสดงรายการประจำวัน
                    </Link>
                    <span style={{marginLeft: "20px"}}>|</span>
                    <Link style={{marginLeft: "20px"}} to={{ state: {stockName : stock.stockName, stockId: stock._id}, pathname: `/transactions/detail`}}>
                      แสดงยอดรายประจำวัน
                    </Link>
                  </div>
                  <div className="collapsible-body">
                    <span>Lorem ipsum dolor sit amet.</span>
                  </div>
                </li>
              </ul>
            )
          })
    )
  }
}

export default (TransactionDetail)
