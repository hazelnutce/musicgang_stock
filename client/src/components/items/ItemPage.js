import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import M from 'materialize-css'
import _ from 'lodash'
import DayPickerInput from 'react-day-picker/DayPickerInput'

import {LoaderSpinner} from '../commons/LoaderSpinner'
import {fetchItems ,deleteItem, fetchCategory, doQuickImport, doQuickExport} from '../../actions/item'
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
import MomentLocaleUtils, {
    formatDate,
    parseDate,
} from 'react-day-picker/moment';

export class ItemPage extends Component {
    constructor(props){
        super(props)
    
        this.state = {
          loadingItem: false,
          currentSorting: {
              direction: "ASC",
              sortColumn: "itemName",
              sortIcon: "arrow_drop_up"
          },
          currentItemSelected: null,
          currentModeForTransaction: null,
          currentSelectedDay: new Date(new Date().setHours(0,0,0,0)),
          currentItemAmount: 1,
        }
    }

    renderButtonForAddItem = () => {
        var currentLocation = this.props.location.pathname.toString()
        var stockId = currentLocation.replace("/items/", "")
        const buttonInLine = <span className="right">
            <Link to={{ pathname: `/items/add/new/${stockId}`, state: {stockName : this.props.history.location.state.stockName}}}  className="waves-effect waves-light btn-small amber darken-3"><i className="material-icons right">add</i>สร้างสินค้า</Link>
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

    initModal = () => {
        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems, 
        {
            opacity: 0.6,
            onCloseStart: () => {
                setTimeout(() => {
                    this.setState({currentItemAmount: 1})
                }, 200);
            }
        });
    }

    setValueForQuickAction = (mode, item) => {
        if(mode === "import"){
            this.setState({currentModeForTransaction: "import", currentItemSelected: item})
        }
        else if(mode === "export"){
            this.setState({currentModeForTransaction: "export", currentItemSelected: item})
        }
    }

    handleAmountItemWithButton = (value) => {
        if(this.state.currentItemAmount + value < 1){
            this.setState({currentItemAmount: 1})
        }
        else if(this.state.currentItemAmount + value > this.state.currentItemSelected.itemRemaining && this.state.currentModeForTransaction === "export"){
            this.setState({currentItemAmount: this.state.currentItemSelected.itemRemaining})
        }
        else{
            this.setState({currentItemAmount: this.state.currentItemAmount + value})
        }
        
    }

    renderButtonInQuickAction = (...numberList) => {
        return _.map(numberList, (number, index) => {
            if(number < 0){
                return(
                    <div key={index} className="col xl2 l2 m4 s4">
                        <button onClick={() => this.handleAmountItemWithButton(number)} className="waves-effect waves-light btn-small red">{number.toString()}</button>
                    </div>
                )
            }
            else{
                return(
                    <div key={index} className="col xl2 l2 m4 s4">
                        <button onClick={() => this.handleAmountItemWithButton(number)} className="waves-effect waves-light btn-small">{`+${number.toString()}`}</button>
                    </div>
                )
            }
            
        })
    }

    renderItemDetailParagraphInQuickAction = () => {
        const {currentModeForTransaction, currentItemSelected, currentItemAmount} = this.state
        const spanStyle = {top: "-7px", position: "relative"}
        if(currentModeForTransaction === "import" && currentItemSelected !== null){
            return (
                <p>
                    {`ชื่อสินค้า : ${currentItemSelected.itemName}`}<br/>
                    {`ราคาต้นทุน : ${parseFloat(currentItemSelected.cost).toFixed(2)} บาท`}<br/> 
                    {`ราคารวม : ${parseFloat(currentItemSelected.cost * currentItemAmount).toFixed(2)} บาท`}<br/> 
                    <span style={spanStyle}>{`จำนวนสินค้าคงเหลือ : ${currentItemSelected.itemRemaining}`}</span><i className="material-icons">arrow_right</i><span style={spanStyle}>{`${currentItemSelected.itemRemaining + currentItemAmount}`}</span><br/> 
                </p>
            )
        }
        else if(currentModeForTransaction === "export" && currentItemSelected !== null){
            return (
                <p>
                    {`ชื่อสินค้า : ${currentItemSelected.itemName}`}<br/>
                    {`ราคาขาย : ${parseFloat(currentItemSelected.revenue).toFixed(2)} บาท`}<br/> 
                    {`ราคารวม : ${parseFloat(currentItemSelected.revenue * currentItemAmount).toFixed(2)} บาท`}<br/> 
                    <span style={spanStyle}>{`จำนวนสินค้าคงเหลือ : ${currentItemSelected.itemRemaining}`}</span><i className="material-icons">arrow_right</i><span style={spanStyle}>{`${currentItemSelected.itemRemaining - currentItemAmount}`}</span><br/> 
                </p>
            )
        }
        else{
            return <p></p>
        }
    }

    guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    doQuickAction = () => {
        const {currentModeForTransaction, currentItemSelected, currentItemAmount, currentSelectedDay} = this.state
        console.log(currentItemSelected)
        if(currentModeForTransaction === "import"){
            let total = currentItemSelected.cost * currentItemAmount
            let currentDay = currentSelectedDay
            let newTransaction = {
                _user: currentItemSelected._user,
                _item: currentItemSelected._id,
                _stock: currentItemSelected._stock,
                 discount: 0,
                formatDiscount: '0.00',
                overcost: 0,
                formatOvercost: '0.00',
                itemName : currentItemSelected.itemName,
                itemAmount: currentItemAmount,
                isUsedInMusicGang: false,
                cost: parseFloat(parseFloat(currentItemSelected.cost).toFixed(2)),
                formatCost: parseFloat(currentItemSelected.cost).toFixed(2),
                total:  parseFloat(parseFloat(total).toFixed(2)),
                formatTotal: parseFloat(total).toFixed(2),
                type: 'import',
                _id : this.guid(),
                day: currentDay,
            }

            this.props.doQuickImport(newTransaction)
        }
        else if(currentModeForTransaction === "export"){
            let total = currentItemSelected.revenue * currentItemAmount
            let currentDay = currentSelectedDay
            let newTransaction = {
                _user: currentItemSelected._user,
                _item: currentItemSelected._id,
                _stock: currentItemSelected._stock,
                 discount: 0,
                formatDiscount: '0.00',
                overcost: 0,
                formatOvercost: '0.00',
                itemName : currentItemSelected.itemName,
                itemAmount: currentItemAmount,
                isUsedInMusicGang: false,
                revenue: parseFloat(parseFloat(currentItemSelected.revenue).toFixed(2)),
                formatRevenue: parseFloat(currentItemSelected.revenue).toFixed(2),
                total:  parseFloat(parseFloat(total).toFixed(2)),
                formatTotal: parseFloat(total).toFixed(2),
                type: 'export',
                _id : this.guid(),
                day: currentDay,
            }

            this.props.doQuickExport(newTransaction)
        }
    }

    handleDayChange = (day) => {
        if((day instanceof Date)){
            this.setState({ selectedDay: day })
        }
    }

    renderModal = () => {
        let currentMenuOnModal = ""
        if(this.state.currentModeForTransaction === "import") currentMenuOnModal = "นำเข้าสินค้า (เร่งด่วน)"
        else if(this.state.currentModeForTransaction === "export") currentMenuOnModal = "นำออกสินค้า (เร่งด่วน)"
        return (
            <div id={"quickAction"} className="modal modal-fixed-footer">
                <div className="modal-content">
                    <h5>{currentMenuOnModal}</h5>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col xl6 l6 m6 s12">
                                <label style={{left: "10px", top:"15px", position: "relative"}}>วันที่บันทึก</label>
                                <DayPickerInput 
                                    classNames={{
                                    container: "input-field col xl12 12 m12 s12",
                                    overlayWrapper: "DayPickerInput-OverlayWrapper",
                                    overlay: "DayPickerInput-Overlay"
                                    }}
                                    onDayChange={this.handleDayChange} 
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    format={"LL"}
                                    placeholder={`${formatDate(new Date(), 'LL', 'th')}`}
                                    dayPickerProps={{
                                    locale: 'th',
                                    localeUtils: MomentLocaleUtils,
                                    }}
                                    value={this.state.currentSelectedDay}
                                />
                                {this.renderItemDetailParagraphInQuickAction()}
                            </div>
                            
                            <div className="col xl6 l6 m6 s12" style={{top: "16px", position: "relative"}}>
                                <div className="row">
                                    <label style={{left: "10px", position: "relative"}}>จำนวนสินค้า</label>
                                    <input readOnly value={this.state.currentItemAmount} className="input-field col xl12 l12 m12 s12"></input>
                                </div>
                                <div className="row">
                                    {this.renderButtonInQuickAction(-10,-5,-1,+1,+5,+10)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={() => this.doQuickAction()} className="green modal-close waves-effect waves-light btn" style={{position: "relative", right: "20px"}}><i className="material-icons right">add_circle</i>ยืนยัน</button> 
                    <button className="red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>ยกเลิก</button>
                </div>
            </div>
        )
    }



    renderItem = () => {
        var allItems = this.props.item.items
        if(allItems != null){
            var sortingColumn = this.state.currentSorting.sortColumn
            var direction = this.state.currentSorting.direction
            this.handleSorting(allItems, sortingColumn, direction)
        }
        
        return _.map(allItems, (item) => {
            if(this.props.allCategory.categories != null){
                item._category = this.props.allCategory.categories.filter(x => (x.categoryNameTh === item.category))[0]
            }
            const {itemName, formatCost, formatRevenue, itemRemaining, _id} = item

            var categoryNameTh = "ทั่วไป"
            var labelColor = "#000000"
            var textColor = "#ffffff"

            if(item._category !== null && item._category !== undefined){
                categoryNameTh = item._category.categoryNameTh
                labelColor = item._category.labelColor
                textColor = item._category.textColor
            }
            
            return(
                    <tr key={item._id}>
                        <td>
                            <Link to={{pathname: `/items/view`,
                                    state: {_id} }}>
                                {itemName}
                            </Link>
                        </td>
                        <td>
                            <span style={{backgroundColor : labelColor, color: textColor, fontWeight: "bold"}} className="new badge " data-badge-caption={categoryNameTh}></span>
                        </td>
                        <td>{formatCost}</td>
                        <td>{formatRevenue}</td>
                        <td>{itemRemaining}</td>
                        <td>
                            <div className="modal-trigger" data-target={"quickAction"} 
                            onClick={() => this.setValueForQuickAction("import", item)} 
                            style={{cursor: "pointer"}}><FontAwesomeIcon className="fas fa-sm" icon="arrow-up"/></div>
                        </td>
                        {itemRemaining !== 0 && (
                            <td>
                                <div className="modal-trigger" data-target={"quickAction"} 
                                onClick={() => this.setValueForQuickAction("export", item)} 
                                style={{cursor: "pointer"}}><FontAwesomeIcon className="fas fa-sm" icon="arrow-down"/></div>
                            </td>
                        )}
                        {itemRemaining === 0 && (
                            <td>
                            </td>
                        )}
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

    renderItemTable = () => {
        return (   
            <table className="highlight reponsive-table centered">
                <thead>
                <tr>
                    {this.renderColumnHeader()}
                    <th></th>
                    <th></th>
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
        this.props.fetchCategory()
        this.setState({loadingItem: true})
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.item.items !== this.props.item.items) {
          if(this.props.item !== "" || this.props.item !== null){
            this.setState({loadingItem: true, currentItemSelected: this.props.item.items[0]}, () => {
                setTimeout(() => {
                    this.initModal()
                }, 500);
            }) 
          }
        }
    }

    render() {
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
                    {this.renderItemTable()}
                </div>
                {this.renderModal()}
            </div>
        )
    }
}

function mapStateToProps(state){
    return { item: state.item, allCategory: state.category}
}

export default connect(mapStateToProps, {fetchItems, deleteItem, fetchCategory, doQuickImport, doQuickExport})(ItemPage)
