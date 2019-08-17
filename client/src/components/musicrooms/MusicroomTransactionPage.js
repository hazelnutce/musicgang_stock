import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {MonthPicker} from '../commons/MonthPicker'
import moment from 'moment'
import _ from 'lodash'
import M from 'materialize-css'
import ReactNotification from "react-notifications-component";

import {fetchTransaction, deleteMusicroomTransaction, resetMusicroomTransactionError} from '../../actions/musicroomTransaction'
import {getTotalMusicroom} from '../../actions/costTransaction'
import {LoaderSpinner} from '../commons/LoaderSpinner'
import './main.css'
import MusicroomTransactionTableHeader from './MusicroomTransactionTableHeader';
import EmptyTransactionNotice from '../commons/EmptyTransactionNotice';
import {CostMonthlySummaryPanel} from '../costs/CostMonthlySummaryPanel'

const shiftLeft10 = {
    left: "10px",
    position: "relative"
}

export class MusicroomTransactionPage extends Component {
    constructor(props){
        super(props)

        var d = new Date()
        var n = d.getMonth()
        var y = d.getFullYear()

        this.notificationDOMRef = React.createRef();

        this.state = {
            isSelectAllRecord : true,
            isSelectSmallRoomRecord : true,
            isSelectLargeRoomRecord : true,
            isLoadingItem: false,
            currentMonth :  y * 12 + n,
            loadingMusicroomRecord : false,
            isDisplayEditingMenu : false,
            currentSmallRoomPage : 1,
            currentLargeRoomPage : 1,
            currentMusicroomTotal : 0,
            isLoadingTotalRevenue : false,
        }
    }

    addNotification = (message) => {
        this.notificationDOMRef.current.addNotification({
          title: "ข้อผิดพลาด",
          message: message,
          type: "danger",
          insert: "buttom",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 },
          dismissable: { click: true }
        });
      }

    handleAddMonth = () => {
        this.setState({isLoadingTotalRevenue: true})
        let promiseMusicroom = this.props.getTotalMusicroom(this.state.currentMonth + 1)
        Promise.all([promiseMusicroom]).then(values => {
            this.setState({currentMonth: this.state.currentMonth + 1, 
                currentMusicroomTotal: values[0].data,
                isLoadingTotalRevenue: false})
        })
    }

    handleMinusMonth = () => {
        this.setState({isLoadingTotalRevenue: true})
        let promiseMusicroom = this.props.getTotalMusicroom(this.state.currentMonth - 1)
        Promise.all([promiseMusicroom]).then(values => {
            this.setState({currentMonth: this.state.currentMonth - 1, 
                currentMusicroomTotal: values[0].data,
                isLoadingTotalRevenue: false})
        })
    }

    handleSetMonth = (integerMonth) => {
        this.setState({isLoadingTotalRevenue: true})
        let promiseMusicroom = this.props.getTotalMusicroom(integerMonth)
        Promise.all([promiseMusicroom]).then(values => {
            this.setState({currentMonth: integerMonth, 
                currentMusicroomTotal: values[0].data,
                isLoadingTotalRevenue: false})
        })
    }

    handleCheckboxes = (buttonString) => {
        if(buttonString === "1"){
            if(this.state.isSelectAllRecord === false){
                this.setState({
                    isSelectAllRecord : true,
                    isSelectSmallRoomRecord : true,
                    isSelectLargeRoomRecord : true,
                })
            }
        }
        else if(buttonString === "2"){
            this.setState({
                isSelectAllRecord : false,
                isSelectSmallRoomRecord : true,
                isSelectLargeRoomRecord : false,
            })
        }
        else if(buttonString === "3"){
            this.setState({
                isSelectAllRecord : false,
                isSelectSmallRoomRecord : false,
                isSelectLargeRoomRecord : true,
            })
        }
        else if(buttonString === "4"){
            this.setState({isDisplayEditingMenu: !this.state.isDisplayEditingMenu})
        }
    }

    componentDidMount(){
        this.props.fetchTransaction()
        var elems = document.querySelectorAll('#deleteModal');
        M.Modal.init(elems, {
            opacity: 0.6
        }); 
        this.setState({isLoadingTotalRevenue: true})
        let promiseMusicroom = this.props.getTotalMusicroom(this.state.currentMonth)
        Promise.all([promiseMusicroom]).then(values => {
            this.setState({currentMonth: this.state.currentMonth, 
                currentMusicroomTotal: values[0].data,
                isLoadingTotalRevenue: false})
        })
    }

    componentDidUpdate = (prevProps) => {
        if(prevProps.musicroom !== this.props.musicroom){
            this.setState({
                loadingMusicroomRecord: true,
            }) 
        }
        if(this.props.musicroom.musicroomTransactionError !== prevProps.musicroom.musicroomTransactionError)
        {
            if(this.props.musicroom.musicroomTransactionError != null){
            this.addNotification(this.props.musicroom.musicroomTransactionError)
            }
        }
    }

    isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
    }

    isSameMonth = (d1, d2) => {
        return d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();
    }

    handleMonthFilter = (monthConst) => {
        var monthFilter = monthConst % 12
        var yearFilter = monthConst / 12
        return new Date(yearFilter, monthFilter, 1)
    }

    sortDayForTransaction = (a,b) => {
        var newADay = new Date(a.day)
        var newBDay = new Date(b.day)
        var newATime = newADay.getTime()
        var newBTime = newBDay.getTime()
        if(newATime < newBTime)
            return -1
        if(newATime > newBTime)
            return 1
        if(newATime === newBTime){
            if(a.startTime < b.startTime)
                return -1
            if(a.startTime > b.startTime)
                return 1
            return 0
        }
        return 0
    }

    initModal = () => {
        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems, {
            opacity: 0.6
        });
    }

    isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
    }

    refreshTotalMusicroomTransaction = () => {
        this.setState({isLoadingTotalRevenue: true})
        let promiseMusicroom = this.props.getTotalMusicroom(this.state.currentMonth)
        Promise.all([promiseMusicroom]).then(values => {
            this.setState({currentMonth: this.state.currentMonth, 
                currentMusicroomTotal: values[0].data,
                isLoadingTotalRevenue: false})
        })
    }

    deleteMusicroomTransaction = async (itemId) => {
        this.props.deleteMusicroomTransaction(itemId)
        setTimeout(() => {
            this.refreshTotalMusicroomTransaction()
        }, 500);
    }

    renderSmallroomRecord(filteredTransaction){
        setTimeout(() => {
            this.initModal()
        }, 250);

        return _.map(filteredTransaction, (item ,index) => {
            var {formatDiff, formatEndTime, formatPrice, formatStartTime, _id, day, roomSize, isStudentDiscount, isOverNight, startTime, endTime, isSelectCustomPrice} = item
            var itemDay = new Date(day)

            var copiedItemDay = itemDay
            if(index > 0){
                var previousItemDay = new Date(filteredTransaction[index-1].day)
                if(this.isSameDay(itemDay, previousItemDay)){
                    itemDay = null
                }
            }

            moment.locale('th')
            let formatStartAndEndTime = formatStartTime + "-" + formatEndTime

            return(
                <tr key={_id}>
                    <td>{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                    <td>
                        <Link to={{pathname: `/musicrooms/view`,
                                state: {_id} }}>
                            {formatStartAndEndTime}
                        </Link>
                    </td>
                    <td>{formatDiff}</td>
                    <td>{formatPrice}</td>
                    {
                        this.state.isDisplayEditingMenu && (
                        <td>
                            <div style={{display: "inline-block", marginRight: "10px", cursor: "pointer"}}>
                                <Link to={{ pathname: `/musicrooms/edit`,
                                    state: {itemDay: copiedItemDay, roomSize, isStudentDiscount, isOverNight, startTime, endTime, _id, isSelectCustomPrice, formatPrice} }} 
                                    className="material-icons black-text">edit
                                </Link>
                            </div>
                            <div style={{display: "inline-block", cursor: "pointer"}} data-target={item._id} className="modal-trigger"><i className="material-icons black-text">delete</i></div>
                        </td>
                        )
                    }
                    <td>
                        <div id={item._id} className="modal">
                            <div className="modal-content">
                                <h4>ยืนยันการลบ</h4>
                                <p>คุณต้องการจะลบรายการห้องซ้อมนี้ใช่หรือไม่ ?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="green modal-close waves-effect waves-light btn" onClick={() => this.deleteMusicroomTransaction(item._id)} style={{position: "relative", right: "20px"}}><i className="material-icons right">add_circle</i>ยืนยัน</button> 
                                <button className="red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>ยกเลิก</button>
                            </div>
                        </div> 
                    </td>
                </tr>
            )
        })
    }

    renderLargeroomRecord(filteredTransaction){
        setTimeout(() => {
            this.initModal()
        }, 250);

        return _.map(filteredTransaction, (item, index) => {
            var {formatDiff, formatEndTime, formatPrice, formatStartTime, _id, day, roomSize, isStudentDiscount, isOverNight, startTime, endTime, isSelectCustomPrice} = item
            var itemDay = new Date(day)

            var copiedItemDay = itemDay
            if(index > 0){
                var previousItemDay = new Date(filteredTransaction[index-1].day)
                if(this.isSameDay(itemDay, previousItemDay)){
                    itemDay = null
                }
            }

            moment.locale('th')

            return(
                <tr key={_id}>
                    <td>{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                    <td>
                        <Link to={{pathname: `/musicrooms/view`,
                                state: {_id} }}>
                            {formatStartTime + "-" + formatEndTime}
                        </Link>
                    </td>
                    <td>{formatDiff}</td>
                    <td>{formatPrice}</td>
                    {
                        this.state.isDisplayEditingMenu && (
                        <td>
                            <div style={{display: "inline-block", marginRight: "10px", cursor: "pointer"}}>
                                <Link to={{ pathname: `/musicrooms/edit`,
                                    state: {itemDay: copiedItemDay, roomSize, isStudentDiscount, isOverNight, startTime, endTime, _id, isSelectCustomPrice, formatPrice} }} 
                                    className="material-icons black-text">edit
                                </Link>
                            </div>
                            <div style={{display: "inline-block", cursor: "pointer"}} data-target={item._id} className="modal-trigger"><i className="material-icons black-text">delete</i></div>
                        </td>
                        )
                    }
                    <td>
                        <div id={item._id} className="modal">
                            <div className="modal-content">
                                <h4>ยืนยันการลบ</h4>
                                <p>คุณต้องการจะลบรายการห้องซ้อมนี้ใช่หรือไม่ ?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="green modal-close waves-effect waves-light btn" style={{position: "relative", right: "20px"}}  onClick={() => this.props.deleteMusicroomTransaction(item._id)}><i className="material-icons right">add_circle</i>ยืนยัน</button> 
                                <button className="red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>ยกเลิก</button>
                            </div>
                        </div> 
                    </td>
                    
                </tr>
            )
        })
    }

    setCurrentPage(page, type, canClick){
        if(type === "Small" && canClick){
            this.setState({currentSmallRoomPage: page})
        }
        else if(type === "Large" && canClick){
            this.setState({currentLargeRoomPage: page})
        }
    }

    renderPaginationBody(arrayOfPage, type){
        arrayOfPage.unshift(-1)
        arrayOfPage.push(-2)
        let isFirstPage = true
        let isLastPage = true
        let activePage = 0
        if(type === "Small"){
            isFirstPage = this.state.currentSmallRoomPage === arrayOfPage[1]
            isLastPage = this.state.currentSmallRoomPage === arrayOfPage[arrayOfPage.length - 2]
            activePage = this.state.currentSmallRoomPage
        }
        else if(type === "Large"){
            isFirstPage = this.state.currentLargeRoomPage === arrayOfPage[1]
            isLastPage = this.state.currentLargeRoomPage === arrayOfPage[arrayOfPage.length - 2]
            activePage = this.state.currentLargeRoomPage
        }

        return _.map(arrayOfPage, (page, index) => {
            if(page === -1){
                return <li key={index} onClick={() => this.setCurrentPage(activePage - 1, type, !isFirstPage)} className={isFirstPage ? "disabled" : "waves-effect"} style={{width: "25px"}}><i className="material-icons">chevron_left</i></li>
            }
            else if(page === -2){
                return <li key={index} onClick={() => this.setCurrentPage(activePage + 1, type, !isLastPage)} className={isLastPage ? "disabled" : "waves-effect"} style={{width: "25px", left: "-5px", position: "relative"}}><i className="material-icons">chevron_right</i></li>
            }
            else{
                return <li key={index}  onClick={() => this.setCurrentPage(arrayOfPage[index], type, !(activePage === arrayOfPage[index]))} className={activePage === arrayOfPage[index] ? "active" : "waves-effect"} style={{width: "25px"}}>{arrayOfPage[index]}</li>
            }
        })
    }

    renderPagination(filteredTransaction, type){
        var numberOfPage = 0
        var loop = 0
        var arrayOfPage = []
        if(filteredTransaction.length === 0){
            numberOfPage = 1
        }
        else{
            numberOfPage = ((filteredTransaction.length - 1) / 20) + 1
        }
        

        if(numberOfPage < 5){
            for(loop = 1; loop <= numberOfPage; loop++){
                arrayOfPage.push(loop)
            }
        }
        else{
            for(loop = numberOfPage - 4; loop <= numberOfPage; loop++){
                arrayOfPage.push(loop)
            }
        }
        
        return(
            <ul className="col xl12 l12 m12 s12 pagination center">
                {this.renderPaginationBody(arrayOfPage, type)}
            </ul>
        )
    }

    renderRemainingItem(filteredTransaction){
        var additionalRow = 20 - filteredTransaction.length
                                        
        var loop = 0
        var returnElement = []
        for(loop = 0; loop < additionalRow; loop++){
            if(this.state.isDisplayEditingMenu === false){
                returnElement.push(
                    <tr key={loop}>
                        <td style={{lineHeight: "22px"}}>&nbsp;</td>
                        <td style={{lineHeight: "22px"}}>&nbsp;</td>
                        <td style={{lineHeight: "22px"}}>&nbsp;</td>
                        <td style={{lineHeight: "22px"}}>&nbsp;</td>
                        <td style={{lineHeight: "22px"}}>&nbsp;</td>
                    </tr>
                )
            }
            else{
                returnElement.push(
                    <tr key={loop}>
                        <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                        <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                        <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                        <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                        <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                        <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                    </tr>
                )
            }
            

        }
        return returnElement
    }

    prepareOvernightItem(transactions){
        _.map(transactions, transaction => {
            if(transaction.isOverNight === true){
                if(transaction.startTime <= 360){
                    transaction.startTime = transaction.startTime + 1440
                }
                if(transaction.endTime <= 360){
                    transaction.endTime = transaction.endTime + 1440
                }
            }
        })
    }

    render() {
        const {musicroomTransactions} = this.props.musicroom

        if(musicroomTransactions != null){
            var smallRoomFilteredTransaction = musicroomTransactions.filter(x => x.roomSize === "Small" && this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth)))
            this.prepareOvernightItem(smallRoomFilteredTransaction)
            console.log(smallRoomFilteredTransaction)
            smallRoomFilteredTransaction = smallRoomFilteredTransaction.sort(this.sortDayForTransaction)
            var slicedSmallRoomFilteredTransaction = smallRoomFilteredTransaction.slice((this.state.currentSmallRoomPage - 1) * 20, this.state.currentSmallRoomPage * 20)

            var largeRoomFilteredTransaction = musicroomTransactions.filter(x => x.roomSize === "Large" && this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth)))
            this.prepareOvernightItem(largeRoomFilteredTransaction)
            largeRoomFilteredTransaction = largeRoomFilteredTransaction.sort(this.sortDayForTransaction)
            var slicedLargeRoomFilteredTransaction = largeRoomFilteredTransaction.slice((this.state.currentLargeRoomPage - 1) * 20, this.state.currentLargeRoomPage * 20)
        }

        return (
            <div className="container" style={{position: "relative", top: "5px"}}>
                <div className="row">
                    <div className="col xl9 l9 m8 s12">
                        <h5 className="col s12 m12 l12 xl12">
                            <i >
                                <FontAwesomeIcon className="fas fa-sm" icon="music"/>
                            </i>
                            <span style={shiftLeft10}>บันทึกห้องซ้อม</span>
                        </h5>
                        <div className="col s12 m12 l12 xl12">
                            <div className="row">
                                <label className="col xl4 l4 m5 s6">
                                    <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("1")} checked={this.state.isSelectAllRecord} />
                                    <span>แสดงรายการทั้งหมด</span>
                                </label>
                                <label className="col xl4 l4 m5 s6">
                                    <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("2")} checked={this.state.isSelectSmallRoomRecord} />
                                    <span>รายการห้องซ้อมเล็ก</span>
                                </label>
                                <label className="col xl4 l4 m5 s6">
                                    <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("3")} checked={this.state.isSelectLargeRoomRecord} />
                                    <span>รายการห้องซ้อมใหญ่</span>
                                </label>
                            </div>
                            <div className="row" style={{marginTop:"-10px"}}>
                                <label className="col xl4 l4 m5 s6">
                                    <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("4")} checked={this.state.isDisplayEditingMenu} />
                                    <span>แสดงเมนูแก้ไขรายการ</span>
                                </label>
                            </div>
                            
                            
                        </div>
                    </div>
                    <div className="col xl3 l3 m4 s12" >
                        <div className="col xl12 l12 m12 s12" id="addNewRecordButton">
                            <Link to={{ pathname: `/musicrooms/new`}} className="waves-effect waves-light btn-small green accent-3"><i className="material-icons right">arrow_upward</i>เพิ่มรายการห้องซ้อม</Link>
                        </div>
                    </div>
                </div>
                {this.state.isSelectAllRecord === true && this.state.loadingMusicroomRecord === true && (
                    <div className="row" style={{marginTop: "-20px"}}>
                        <div className="col x12 l12 m12 s12 center">
                            <MonthPicker 
                                handleAddMonth={this.handleAddMonth} 
                                handleMinusMonth={this.handleMinusMonth} 
                                handleSetMonth={this.handleSetMonth}
                                currentMonth={this.state.currentMonth}
                                disabled={this.state.isLoadingTotalRevenue} 
                            />
                        </div>
                        <div className="row">
                            <CostMonthlySummaryPanel color={"green lighten-1"} message={"รายรับจากห้องซ้อมดนตรี"} currentMonth={this.state.currentMonth} cost={this.state.currentMusicroomTotal}/>
                        </div>
                        <div className="col xl6 l6 m12 s12">
                                <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                                    <h6>ห้องซ้อมเล็ก</h6>
                                </div>
                                {slicedSmallRoomFilteredTransaction.length === 0 &&
                                    <EmptyTransactionNotice message="ไม่มีรายการในขณะนี้"/>}
                                {slicedSmallRoomFilteredTransaction.length !== 0 && (
                                    <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative", height: "auto"}}>
                                        <table className="highlight centered">
                                            <thead>
                                            <tr>
                                                <MusicroomTransactionTableHeader isDisplayEditingMenu={this.state.isDisplayEditingMenu}/>
                                            </tr>
                                            </thead>
                            
                                            <tbody>
                                                {this.renderSmallroomRecord(slicedSmallRoomFilteredTransaction)}
                                                {this.renderRemainingItem(slicedSmallRoomFilteredTransaction)}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                
                            {this.renderPagination(smallRoomFilteredTransaction, "Small")}
                        </div>
                        <div className="col xl6 l6 m12 s12">
                            <div className="col xl12 l12 m12 s12" style={{left: "5px", position: "relative"}}>
                                <h6>ห้องซ้อมใหญ่</h6>
                            </div>
                            {slicedLargeRoomFilteredTransaction.length === 0 &&
                                <EmptyTransactionNotice message="ไม่มีรายการในขณะนี้"/>}
                            {slicedLargeRoomFilteredTransaction.length !== 0 && (
                                <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative", height: "auto"}}>
                                    <table className="highlight centered">
                                    <thead>
                                    <tr>
                                        <MusicroomTransactionTableHeader isDisplayEditingMenu={this.state.isDisplayEditingMenu}/>
                                    </tr>
                                    </thead>
                        
                                    <tbody>
                                        {this.renderLargeroomRecord(slicedLargeRoomFilteredTransaction)}
                                        {this.renderRemainingItem(slicedLargeRoomFilteredTransaction)}
                                    </tbody>
                                    </table>
                                </div>
                            )}
                            
                            {this.renderPagination(largeRoomFilteredTransaction, "Large")}
                        </div>
                    </div>
                )}
                {this.state.isSelectSmallRoomRecord === true && this.state.isSelectAllRecord === false && this.state.loadingMusicroomRecord === true && (
                    <div className="row">
                            <div className="col x12 l12 m12 s12 center">
                            <MonthPicker 
                                handleAddMonth={this.handleAddMonth} 
                                handleMinusMonth={this.handleMinusMonth} 
                                handleSetMonth={this.handleSetMonth}
                                currentMonth={this.state.currentMonth} 
                                disabled={this.state.isLoadingTotalRevenue} 
                            />
                        </div>
                        <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                            <h6>ห้องซ้อมเล็ก</h6>
                        </div>
                        {slicedSmallRoomFilteredTransaction.length === 0 &&
                            <EmptyTransactionNotice message="ไม่มีรายการในขณะนี้"/>}
                        {slicedSmallRoomFilteredTransaction.length !== 0 && (
                            <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative", height: "auto"}}>
                                <table className="highlight centered">
                                    <thead>
                                    <tr>
                                        <MusicroomTransactionTableHeader isDisplayEditingMenu={this.state.isDisplayEditingMenu}/>
                                    </tr>
                                    </thead>
                    
                                    <tbody>
                                        {this.renderSmallroomRecord(slicedSmallRoomFilteredTransaction)}
                                        {this.renderRemainingItem(slicedSmallRoomFilteredTransaction)}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {this.renderPagination(smallRoomFilteredTransaction, "Small")}
                    </div>
                )}
                {this.state.isSelectLargeRoomRecord === true && this.state.isSelectAllRecord === false && this.state.loadingMusicroomRecord === true && (
                    <div className="row">
                            <div className="col x12 l12 m12 s12 center">
                            <MonthPicker 
                                handleAddMonth={this.handleAddMonth} 
                                handleMinusMonth={this.handleMinusMonth} 
                                handleSetMonth={this.handleSetMonth}
                                currentMonth={this.state.currentMonth}
                                disabled={this.state.isLoadingTotalRevenue} 
                            />
                        </div>
                        <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                            <h6>ห้องซ้อมใหญ่</h6>
                        </div>
                        {slicedLargeRoomFilteredTransaction.length === 0 &&
                                <EmptyTransactionNotice message="ไม่มีรายการในขณะนี้"/>}
                        {slicedLargeRoomFilteredTransaction.length !== 0 && (
                            <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative", height: "auto"}}>
                                <table className="highlight centered">
                                <thead>
                                <tr>
                                    <MusicroomTransactionTableHeader isDisplayEditingMenu={this.state.isDisplayEditingMenu}/>
                                </tr>
                                </thead>
                    
                                <tbody>
                                    {this.renderLargeroomRecord(slicedLargeRoomFilteredTransaction)}
                                    {this.renderRemainingItem(slicedLargeRoomFilteredTransaction)}
                                </tbody>
                                </table>
                            </div>
                        )}
                        {this.renderPagination(largeRoomFilteredTransaction, "Large")}
                    </div>
                )}
                {this.state.loadingMusicroomRecord === false && (
                    <LoaderSpinner loading={this.state.loadingMusicroomRecord} color={'#123abc'}/>
                )}
                <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
                    this.props.resetMusicroomTransactionError()
                }} /> 

            </div>
        )
        
  }
}

function mapStateToProps(state){
    return {musicroom : state.musicroom}
}

export default connect(mapStateToProps, {fetchTransaction, deleteMusicroomTransaction, resetMusicroomTransactionError, getTotalMusicroom})(MusicroomTransactionPage)
