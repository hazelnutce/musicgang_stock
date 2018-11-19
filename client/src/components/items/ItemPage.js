import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash'

import {LoaderSpinner} from '../commons/LoaderSpinner'
import {fetchItems} from '../../actions/item'

export class ItemPage extends Component {
    constructor(props){
        super(props)
    
        this.state = {
          loadingItem: false
        }
    }

    renderButtonForAddItem = () => {
        var currentLocation = this.props.location.pathname.toString()
        var stockId = currentLocation.replace("/items/", "")
        const buttonInLine = <span className="right">
            <Link to={{ pathname: `/items/add/new/${stockId}`, state: {stockName : this.props.history.location.state.stockName}}}  className="waves-effect waves-light btn-small amber darken-3"><i className="material-icons right">add</i>เพิ่มสินค้า</Link>
        </span>

        return buttonInLine
    }

    renderItem = () => {
        return _.map(this.props.item.items, item => {
            return(
                <tr key={item._id}>
                    <td>{item.itemName}</td>
                    <td>{item.category}</td>
                    <td>{item.cost}</td>
                    <td>{item.revenue}</td>
                    <td>{item.itemRemaining}</td>
                </tr>
            )
        })
    }

    renderItemTable = () => {
        return (   
            <table className="highlight reponsive-table">
                <thead>
                <tr>
                    <th>ชื่อสินค้า</th>
                    <th>หมวดหมู่</th>
                    <th>ราคาต้นทุน</th>
                    <th>ราคาขาย</th>
                    <th>จำนวนคงเหลือ</th>
                </tr>
                </thead>

                <tbody>
                    {this.renderItem()}
                </tbody>
            </table>  
    
        )
    }

    componentDidMount = () => {
        var currentLocation = this.props.location.pathname.toString()
        var stockId = currentLocation.replace("/items/", "")
        this.props.fetchItems(stockId)
        this.setState({loadingItem: true})
        
    }

    render() {
        console.log(this.props.item.items)
        if(!this.state.loadingItem){
            return (
              <LoaderSpinner loading={this.state.loadingCategory} color={'#123abc'}/>
            )
        }
        return (
            <div className="container" style={{position: "relative", top: "5px"}}>
                <div className="row">
                    <h5 className="col s12"><i><FontAwesomeIcon icon="boxes"/></i><span style={{marginLeft: "20px"}}>สินค้า / คลัง : {this.props.history.location.state.stockName}</span> {this.renderButtonForAddItem()}</h5>
                </div>
                <div className="row">
                    {this.renderItemTable()}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return { item: state.item}
}

export default connect(mapStateToProps, {fetchItems})(ItemPage)
