import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import M from 'materialize-css'
import _ from 'lodash'

import {LoaderSpinner} from '../commons/LoaderSpinner'
import {fetchItems ,deleteItem} from '../../actions/item'
import '../commons/linkButton.css'
import {sortItemNameASC,
    sortCategoryASC,
    sortCostASC,
    sortRevenueASC,
    sortItemRemainingASC, 
    sortItemNameDESC, 
    sortCategoryDESC, 
    sortCostDESC, 
    sortRevenueDESC, 
    sortItemRemainingDESC} from './sortItemFunctions'

export class ItemPage extends Component {
    constructor(props){
        super(props)
    
        this.state = {
          loadingItem: false,
          currentSorting: {
              direction: "ASC",
              sortColumn: "itemName",
              sortIcon: "arrow_drop_up"
          }
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

    handleSorting(allItems, sortingColumn, direction){
        if(direction === "ASC"){
            if(sortingColumn === "itemName")
                allItems.sort(sortItemNameASC)
            else if(sortingColumn === "category")
                allItems.sort(sortCategoryASC)
            else if(sortingColumn === "cost")
                allItems.sort(sortCostASC)
            else if(sortingColumn === "revenue")
                allItems.sort(sortRevenueASC)
            else if(sortingColumn === "itemRemaining")
                allItems.sort(sortItemRemainingASC)
        }
        else if(direction === "DESC"){
            if(sortingColumn === "itemName")
                allItems.sort(sortItemNameDESC)
            else if(sortingColumn === "category")
                allItems.sort(sortCategoryDESC)
            else if(sortingColumn === "cost")
                allItems.sort(sortCostDESC)
            else if(sortingColumn === "revenue")
                allItems.sort(sortRevenueDESC)
            else if(sortingColumn === "itemRemaining")
                allItems.sort(sortItemRemainingDESC)
        }
    }

    renderItem = (stockId, stockName) => {
        var allItems = this.props.item.items
        if(allItems != null){
            var sortingColumn = this.state.currentSorting.sortColumn
            var direction = this.state.currentSorting.direction
            this.handleSorting(allItems, sortingColumn, direction)
        }
        return _.map(allItems, (item, itemIndex, items) => {
            const {itemName, category, cost, revenue, itemWarning, itemRemaining} = item
            return(
                    <tr key={item._id}>
                        <td>{itemName}</td>
                        <td>{category}</td>
                        <td>{cost}</td>
                        <td>{revenue}</td>
                        <td>{itemRemaining}</td>
                        <td>
                            <Link to={{ pathname: `/items/edit/${item._id}`, 
                                state: { stockId, stockName, itemName, category, cost, revenue, itemWarning} }} 
                                className="material-icons black-text">edit
                            </Link>
                            <Link to={{ pathname: `/items/add/new/${stockId}`, 
                                state: { stockId, stockName, itemName, category, cost, revenue, itemWarning, itemRemaining, itemIndex, items} }} 
                                className="material-icons black-text">content_copy
                            </Link>
                            <a className="modal-trigger" href={"#"+item._id}><i className="material-icons black-text">delete</i></a>
                        </td>
                        <td>
                            <div id={item._id} className="modal">
                                <div className="modal-content">
                                    <h4>ยืนยันการลบ</h4>
                                    <p>คุณต้องการจะลบสินค้า <b>{item.itemName}</b> ใช่หรือไม่ ?</p>
                                </div>
                                <div className="modal-footer">
                                    <button onClick={() => this.props.deleteItem(item._id, stockId)} className="green modal-close waves-effect waves-light btn" style={{position: "relative", right: "20px"}}><i className="material-icons right">add_circle</i>ยืนยัน</button> 
                                    <button className="red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>ยกเลิก</button>
                                </div>
                            </div> 
                        </td>
                         
                    </tr>          
            )
        })
    }

    handleSortClick(sortColumn){
        if(sortColumn === this.state.currentSorting.sortColumn){
            if(this.state.currentSorting.direction === "ASC"){
                this.setState({currentSorting: {direction: "DESC", sortColumn: sortColumn, sortIcon: "arrow_drop_down"}})
            }
            else{
                this.setState({currentSorting: {direction: "ASC", sortColumn: sortColumn, sortIcon: "arrow_drop_up"}})
            }

        }
        else{
            this.setState({currentSorting: {direction: "ASC", sortColumn: sortColumn, sortIcon: "arrow_drop_up"}})
        }
    }

    renderColumnHeader = () => {
        const criteriaArray = ["itemName", "category", "cost", "revenue", "itemRemaining"]
        const columnName = ["ชื่อสินค้า", "หมวดหมู่", "ราคาต้นทุน", "ราคาขาย", "จำนวนคงเหลือ"]
        const buttonClassName = "btn-flat waves-effect"

        return _.map(criteriaArray, (criteria, index) => {
            return (
                <th key={criteria}>
                    <button onClick={() => this.handleSortClick(criteria)} className={buttonClassName}>{columnName[index]}
                    </button>
                    <i className="material-icons">{this.state.currentSorting.sortColumn === criteria && this.state.currentSorting.sortIcon}</i>
                </th>
            )
        })
    }

    renderItemTable = (stockId, stockName) => {
        
        return (   
            <table className="highlight reponsive-table centered">
                <thead>
                <tr>
                    {this.renderColumnHeader()}
                    <th></th>
                </tr>
                </thead>

                <tbody>
                    {this.renderItem(stockId, stockName)}
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

    componentDidUpdate = (prevProps) => {
        if (prevProps.item.items !== this.props.item.items) {
          if(this.props.item !== "" || this.props.item !== null){
            this.setState({loadingItem: true},() => {
              var elems = document.querySelectorAll('.modal');
              M.Modal.init(elems, {
                opacity: 0.6
              });
            }) 
          }
        }
    }

    render() {
        var currentLocation = this.props.location.pathname.toString()
        var stockId = currentLocation.replace("/items/", "")
        const {stockName} = this.props.location.state

        if(!this.state.loadingItem){
            return (
              <LoaderSpinner loading={this.state.loadingCategory} color={'#123abc'}/>
            )
        }
        return (
            <div className="container" style={{position: "relative", top: "5px"}}>
                <div className="row">
                    <h5 className="col s12"><i><FontAwesomeIcon icon="boxes"/></i><span style={{marginLeft: "20px"}}>สินค้า / คลัง : {stockName}</span> {this.renderButtonForAddItem()}</h5>
                </div>
                <div className="row">
                    {this.renderItemTable(stockId, stockName)}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return { item: state.item}
}

export default connect(mapStateToProps, {fetchItems, deleteItem})(ItemPage)
