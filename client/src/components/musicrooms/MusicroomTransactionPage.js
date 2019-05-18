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
import {LoaderSpinner} from '../commons/LoaderSpinner'
import './main.css'

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
            isDisplayEditingMenu : false
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
        this.setState({currentMonth: this.state.currentMonth + 1})
    }

    handleMinusMonth = () => {
        this.setState({currentMonth: this.state.currentMonth - 1})
    }

    handleSetMonth = (integerMonth) => {
        this.setState({currentMonth: integerMonth})
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
        if(newADay < newBDay)
            return -1
        if(newADay > newBDay)
            return 1
        if(newADay === newBDay){
            if(a.startTime < b.startTime)
                return 1
            if(a.startTime > b.startTime)
                return -1
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

    renderSmallroomRecord(){
        const {musicroomTransactions} = this.props.musicroom
        
        var filteredTransaction = musicroomTransactions.filter(x => x.roomSize === "Small" && 
                                                        this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth)))
        filteredTransaction = filteredTransaction.sort(this.sortDayForTransaction)

        setTimeout(() => {
            this.initModal()
        }, 500);

        return _.map(filteredTransaction, (item) => {
            var {formatDiff, formatEndTime, formatPrice, formatStartTime, _id, day, roomSize, isStudentDiscount, isOverNight, startTime, endTime} = item
            var itemDay = new Date(day)

            moment.locale('th')
            
            return(
                <tr key={_id}>
                    <td>{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                    <td>{formatStartTime + "-" + formatEndTime}</td>
                    <td>{formatDiff}</td>
                    <td>{formatPrice}</td>
                    {
                        this.state.isDisplayEditingMenu && (
                        <td>
                            <div style={{display: "inline-block", marginRight: "10px", cursor: "pointer"}}>
                                <Link to={{ pathname: `/musicrooms/edit`,
                                    state: {itemDay, roomSize, isStudentDiscount, isOverNight, startTime, endTime, _id} }} 
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
                                <button className="green modal-close waves-effect waves-light btn" onClick={() => this.props.deleteMusicroomTransaction(item._id)} style={{position: "relative", right: "20px"}}><i className="material-icons right">add_circle</i>ยืนยัน</button> 
                                <button className="red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>ยกเลิก</button>
                            </div>
                        </div> 
                    </td>
                </tr>
            )
        })
    }

    renderLargeroomRecord(){
        const {musicroomTransactions} = this.props.musicroom
        
        var filteredTransaction = musicroomTransactions.filter(x => x.roomSize === "Large" && 
                                                        this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth)))
        filteredTransaction = filteredTransaction.sort(this.sortDayForTransaction)

        setTimeout(() => {
            this.initModal()
        }, 500);

        return _.map(filteredTransaction, (item) => {
            var {formatDiff, formatEndTime, formatPrice, formatStartTime, _id, day, roomSize, isStudentDiscount, isOverNight, startTime, endTime} = item
            var itemDay = new Date(day)

            moment.locale('th')

            return(
                <tr key={_id}>
                    <td>{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                    <td>{formatStartTime + "-" + formatEndTime}</td>
                    <td>{formatDiff}</td>
                    <td>{formatPrice}</td>
                    {
                        this.state.isDisplayEditingMenu && (
                        <td>
                            <div style={{display: "inline-block", marginRight: "10px", cursor: "pointer"}}>
                                <Link to={{ pathname: `/musicrooms/edit`,
                                    state: {itemDay, roomSize, isStudentDiscount, isOverNight, startTime, endTime, _id} }} 
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

    render() {
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
                            />
                        </div>
                        <div className="col xl6 l6 m12 s12">
                                <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                                    <h6>ห้องซ้อมเล็ก</h6>
                                </div>
                                <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative", height: "auto"}}>
                                <table className="highlight centered">
                                    <thead>
                                    <tr>
                                        <th>วันที่</th>
                                        <th>เวลา</th>
                                        <th>จำนวน ชม.</th>
                                        <th>ราคา</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                    
                                    <tbody>
                                        {this.renderSmallroomRecord()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col xl6 l6 m12 s12">
                            <div className="col xl12 l12 m12 s12" style={{left: "5px", position: "relative"}}>
                                <h6>ห้องซ้อมใหญ่</h6>
                            </div>
                            <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative", height: "auto"}}>
                                <table className="highlight centered">
                                <thead>
                                <tr>
                                    <th>วันที่</th>
                                    <th>เวลา</th>
                                    <th>จำนวน ชม.</th>
                                    <th>ราคา</th>
                                    <th></th>
                                </tr>
                                </thead>
                    
                                <tbody>
                                    {this.renderLargeroomRecord()}
                                </tbody>
                                </table>
                            </div>
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
                            />
                        </div>
                        <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                            <h6>ห้องซ้อมเล็ก</h6>
                        </div>
                        <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative", height: "auto"}}>
                            <table className="highlight centered">
                                <thead>
                                    <tr>
                                        <th>วันที่</th>
                                        <th>เวลา</th>
                                        <th>จำนวน ชม.</th>
                                        <th>ราคา</th>
                                        <th></th>
                                    </tr>
                                </thead>
                
                                <tbody>
                                    {this.renderSmallroomRecord()}
                                </tbody>
                            </table>
                        </div>
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
                            />
                        </div>
                        <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative"}}>
                            <h6>ห้องซ้อมใหญ่</h6>
                        </div>
                        <div className="col card small xl12 l12 m12 s12" style={{right: "5px", position: "relative", height: "auto"}}>
                            <table className="highlight centered">
                                <thead>
                                    <tr>
                                        <th>วันที่</th>
                                        <th>เวลา</th>
                                        <th>จำนวน ชม.</th>
                                        <th>ราคา</th>
                                        <th></th>
                                    </tr>
                                </thead>
                
                                <tbody>
                                    {this.renderLargeroomRecord()}
                                </tbody>
                            </table>
                        </div>
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

export default connect(mapStateToProps, {fetchTransaction, deleteMusicroomTransaction, resetMusicroomTransactionError})(MusicroomTransactionPage)
