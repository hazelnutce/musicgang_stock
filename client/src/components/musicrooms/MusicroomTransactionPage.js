import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {MonthPicker} from '../commons/MonthPicker'
import moment from 'moment'
import _ from 'lodash'

import {fetchTransaction} from '../../actions/musicroomTransaction'
import {LoaderSpinner} from '../commons/LoaderSpinner'

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

        this.state = {
            isSelectAllRecord : true,
            isSelectSmallRoomRecord : true,
            isSelectLargeRoomRecord : true,
            isLoadingItem: false,
            currentMonth :  y * 12 + n,
            loadingMusicroomRecord : false
        }
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
    }

    componentDidMount(){
        this.props.fetchTransaction()
    }

    componentDidUpdate = (prevProps) => {
        if(prevProps.musicroom !== this.props.musicroom){
            this.setState({
                loadingMusicroomRecord: true,
            }) 
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

    renderSmallroomRecord(){
        const {musicroomTransactions} = this.props.musicroom
        
        var filteredTransaction = musicroomTransactions.filter(x => x.roomSize === "Small" && 
                                                        this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth)))
        filteredTransaction = filteredTransaction.sort(this.sortDayForTransaction)

        return _.map(filteredTransaction, (item, index) => {
            var {endTime, formatDiff, formatEndTime, formatPrice, formatRoomsize, formatStartTime, isOverNight, isStudentDiscount, roomSize, startTime, _id, day} = item
            var itemDay = new Date(day)

            moment.locale('th')
            
            return(
                <tr key={_id}>
                    <td>{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                    <td>{formatStartTime + "-" + formatEndTime}</td>
                    <td>{formatDiff}</td>
                    <td>{formatPrice}</td>
                    <td>
                        
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

        return _.map(filteredTransaction, (item, index) => {
            var {endTime, formatDiff, formatEndTime, formatPrice, formatRoomsize, formatStartTime, isOverNight, isStudentDiscount, roomSize, startTime, _id, day} = item
            var itemDay = new Date(day)

            moment.locale('th')
            
            return(
                <tr key={_id}>
                    <td>{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                    <td>{formatStartTime + "-" + formatEndTime}</td>
                    <td>{formatDiff}</td>
                    <td>{formatPrice}</td>
                    <td>
                        
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
                    </div>
                    <div className="col xl3 l3 m4 s12" >
                        <div className="col xl12 l12 m12 s12" style={{top: "40px", position: "relative"}}>
                            <Link to={{ pathname: `/musicrooms/new`}} className="waves-effect waves-light btn-small green accent-3"><i className="material-icons right">arrow_upward</i>เพิ่มรายการห้องซ้อม</Link>
                        </div>
                    </div>
                </div>
                {this.state.isSelectAllRecord === true && this.state.loadingMusicroomRecord === true && (
                    <div className="row">
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

            </div>
        )
        
  }
}

function mapStateToProps(state){
    return {musicroom : state.musicroom}
}

export default connect(mapStateToProps, {fetchTransaction})(MusicroomTransactionPage)
