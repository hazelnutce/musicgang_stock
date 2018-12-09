import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'

import {deleteStock} from '../../actions/stock'
import '../commons/linkButton.css'

export class StockDetail extends Component {
    render() { 
        
        const stock = this.props
        return (
            <div> 
                <div className="card-panel amber lighten-1" style={{marginLeft: "10px",top:"-20px",position:"relative"}}>
                    <span>
                        <span className="right modal-trigger" href={"#"+stock._id}><button className="link-button material-icons black-text">delete_forever</button></span>
                        <div style={{left:"-20px",position:"relative"}}>
                            <span className="new badge red black-text" data-badge-caption="สินค้าหมด">{stock.itemDanger}</span>
                            <span className="new badge yellow black-text" data-badge-caption="สินค้าใกล้หมด">{stock.itemWarning}</span>
                            <span className="new badge green black-text" data-badge-caption="สินค้า">{stock.itemCount}</span>
                        </div>
                        <div>
                            <span style={{marginLeft: "10px"}} ><Link to={{ state: {stockName : stock.stockName}, pathname: `/items/${stock._id}`}} className="black-text">{stock.stockName}</Link></span>
                        </div>
                    </span>
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
