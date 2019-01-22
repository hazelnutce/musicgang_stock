import React, { Component } from 'react'
import {ErrorProcessNotice} from '../commons/ErrorProcessNotice'

export class AddNewTransactionIn extends Component {
  render() {
    const {stockName} = this.props.location.state
    if(stockName == null){
        return(
            <ErrorProcessNotice />
        )
    }
    return (
      <div className="container" style={{position: "relative", top: "5px"}}>
        <div className="row">
          <h6>นำเข้าสินค้า / คลัง : {stockName}</h6>
        </div>
        
      </div>
    )
  }
}

export default AddNewTransactionIn
