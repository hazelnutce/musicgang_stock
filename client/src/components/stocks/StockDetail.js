import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import _ from 'lodash'

import {deleteStock} from '../../actions/stock'
import '../commons/linkButton.css'

export class StockDetail extends Component {

    renderItemListRed(items){
        items = items.filter(x => x.itemRemaining === 0)

        return _.map(items, item => {
            return (
                <li key={item._id}>{item.itemName}</li>
            )
        })
    }

    renderItemListYellow(items){
        items = items.filter(x => x.itemRemaining <= x.itemWarning && x.itemRemaining !== 0)

        return _.map(items, item => {
            return (
                <li key={item._id}>{item.itemName}</li>
            )
        })
    }

    renderItemListGreen(items){
        return _.map(items, item => {
            return (
                <li key={item._id}>{item.itemName}</li>
            )
        })
    }

    render() { 
        const stock = this.props
        let redClassName = "new badge red black-text modal-trigger"
        let yellowClassName = "new badge yellow black-text modal-trigger"
        let greenClassName = "new badge green black-text modal-trigger"

        if(stock.itemDanger === 0){
            redClassName = "new badge red black-text"
        }
        if(stock.itemWarning === 0){
            yellowClassName = "new badge yellow black-text"
        }
        if(stock.itemCount === 0){
            greenClassName = "new badge green black-text"
        }

        return (
            <div> 
                <div className="card-panel grey lighten-3" style={{marginLeft: "10px",top:"-20px",position:"relative"}}>
                    <span>
                        <span className="right modal-trigger" href={"#"+stock._id}><button className="link-button material-icons black-text">delete_forever</button></span>
                        <div style={{left:"-20px", position:"relative"}}>
                            <span className={redClassName} data-target={`red_${stock._id}`} data-badge-caption="สินค้าหมด">{stock.itemDanger}</span>
                            <span className={yellowClassName} data-target={`yellow_${stock._id}`} data-badge-caption="สินค้าใกล้หมด">{stock.itemWarning}</span>
                            <span className={greenClassName} data-target={`green_${stock._id}`} data-badge-caption="สินค้า">{stock.itemCount}</span>
                        </div>
                        <div>
                            <span style={{marginLeft: "10px"}} ><Link to={{ state: {stockName : stock.stockName}, pathname: `/items/${stock._id}`}} className="black-text">{stock.stockName}</Link></span>
                        </div>
                    </span>
                </div>
                
                <div id={`red_${stock._id}`} className="modal modal-fixed-footer">
                    <div className="modal-content">
                        <h6 style={{textDecoration: "underline"}}>รายชื่อสินค้าที่หมดแล้ว / คลัง : {stock.stockName}</h6>
                        <ul>
                            {this.renderItemListRed(stock.items)}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button className="red modal-close waves-effect waves-light btn right"><i className="material-icons right">cancel</i>ปิด</button>
                    </div>
                </div>

                <div id={`yellow_${stock._id}`} className="modal modal-fixed-footer">
                    <div className="modal-content">
                        <h6 style={{textDecoration: "underline"}}>รายชื่อสินค้าที่ใกล้หมด / คลัง : {stock.stockName}</h6>
                        <ul>
                            {this.renderItemListYellow(stock.items)}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button className="red modal-close waves-effect waves-light btn right"><i className="material-icons right">cancel</i>ปิด</button>
                    </div>
                </div>

                <div id={`green_${stock._id}`} className="modal modal-fixed-footer">
                    <div className="modal-content">
                        <h6 style={{textDecoration: "underline"}}>รายชื่อสินค้าทั้งหมด / คลัง : {stock.stockName}</h6>
                        <ul>
                            {this.renderItemListGreen(stock.items)}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button className="red modal-close waves-effect waves-light btn right"><i className="material-icons right">cancel</i>ปิด</button>
                    </div>
                </div>
                
                <div id={stock._id} className="modal">
                    <div className="modal-content">
                        <h4>ยืนยันการลบ</h4>
                        <p>คุณต้องการจะลบคลังสินค้า <b>{stock.stockName}</b> ใช่หรือไม่ ?</p>
                    </div>
                    <div className="modal-footer">
                        <button className="red modal-close waves-effect waves-light btn right"><i className="material-icons right">cancel</i>ยกเลิก</button>
                        <button onClick={() => this.props.deleteStock(stock._id)} className="green modal-close waves-effect waves-light btn right" style={{position: "relative", right: "20px"}}><i className="material-icons right">add_circle</i>ยืนยัน</button> 
                    </div>
                    
                </div>
            </div>
        )
  }
}

export default withRouter(connect(null,{deleteStock})(StockDetail))
