import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import {deleteStock} from '../../actions/stock'

export class StockDetail extends Component {
    
    render() { 
        const stock = this.props
        return (
            <div> 
                <div className="card-panel amber lighten-1" style={{marginLeft: "10px",top:"-20px",position:"relative"}}>
                    <span>
                        <span className="right modal-trigger" href={"#"+stock._id}><a className="material-icons black-text">delete_forever</a></span>
                        <div style={{left:"-20px",position:"relative"}}>
                            <span className="new badge red black-text" data-badge-caption="out of stock">{stock.itemDanger}</span>
                            <span className="new badge yellow black-text" data-badge-caption="nearly out of stock">{stock.itemWarning}</span>
                            <span className="new badge green black-text" data-badge-caption="items">{stock.itemCount}</span>
                        </div>
                        <div>
                            <span style={{marginLeft: "10px"}} ><Link to={`/items/${stock._id}`} className="black-text">{stock.stockName}</Link></span>
                        </div>
                    </span>
                </div>
                
                
                <div id={stock._id} className="modal">
                    <div className="modal-content">
                        <h4>Confirm delete</h4>
                        <p>Are you sure for delete <b>{stock.stockName}</b> stock ?</p>
                    </div>
                    <div className="modal-footer">
                        <a  className="red modal-close waves-effect waves-light btn right"><i className="material-icons right">cancel</i>Cancel</a>
                        <a  onClick={() => this.props.deleteStock(stock._id)} className="green modal-close waves-effect waves-light btn right" style={{position: "relative", right: "20px"}}><i className="material-icons right">add_circle</i>Confirm</a> 
                    </div>
                    
                </div>
            </div>
        )
  }
}

export default connect(null,{deleteStock})(StockDetail)
