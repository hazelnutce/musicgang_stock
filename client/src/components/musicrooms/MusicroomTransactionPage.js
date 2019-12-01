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
import {CostMonthlySummaryPanel} from '../costs/CostMonthlySummaryPanel'

import DayPickerInput from 'react-day-picker/DayPickerInput'
import MomentLocaleUtils, {
    formatDate,
    parseDate,
  } from 'react-day-picker/moment';

const shiftLeft10 = {
    left: "10px",
    position: "relative"
}

const sessionEnums = {
    currentPageTrackerMusicroom_1: 'currentPageTrackerMusicroom_1',
    currentPageTrackerMusicroom_2: 'currentPageTrackerMusicroom_2',
    currentPageTrackerMusicroom_month: 'currentPageTrackerMusicroom_month',
    currentModeTrackerMusicroom: 'currentModeTrackerMusicroom',
    currentDayFilterBoolMusicroom: 'currentDayFilterBoolMusicroom',
    currentDayFilterMusicroom: 'currentDayFilterMusicroom'
}

export class MusicroomTransactionPage extends Component {
    constructor(props){
        super(props)

        var smallPage = sessionStorage.getItem(sessionEnums.currentPageTrackerMusicroom_1)
        var largePage = sessionStorage.getItem(sessionEnums.currentPageTrackerMusicroom_2)
        var month = sessionStorage.getItem(sessionEnums.currentPageTrackerMusicroom_month)
        var mode = sessionStorage.getItem(sessionEnums.currentModeTrackerMusicroom)
        var currentDaySetting = sessionStorage.getItem(sessionEnums.currentDayFilterBoolMusicroom)
        var currentDaySettingValue = sessionStorage.getItem(sessionEnums.currentDayFilterMusicroom)
        var splitDay = currentDaySettingValue.split('/', 3)

        this.notificationDOMRef = React.createRef();

        this.state = {
            isSelectSmallRoomRecord : mode === "small",
            isSelectLargeRoomRecord : mode === "large",
            isLoadingItem: false,
            currentMonth :  parseInt(month),
            loadingMusicroomRecord : false,
            currentSmallRoomPage : parseInt(smallPage),
            currentLargeRoomPage : parseInt(largePage),
            currentMusicroomTotal : 0,
            isLoadingTotalRevenue : false,
            currentDaySetting: currentDaySetting === "true",
            currentDaySettingValue: new Date(new Date(splitDay[2],splitDay[1] - 1,splitDay[0]).setHours(0,0,0,0)),
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

    handleDaySetting = () => {
        sessionStorage.setItem(sessionEnums.currentDayFilterBoolMusicroom, (!this.state.currentDaySetting).toString())
        this.setState({currentDaySetting: !this.state.currentDaySetting})
    }

    handleSettingDayChange = (day) => {
        if((day instanceof Date)){
            sessionStorage.setItem(sessionEnums.currentDayFilterMusicroom, moment(day).format("D/MM/YYYY"))  
          this.setState({ currentDaySettingValue: day });
        }
    }

    handleAddMonth = () => {
        let newMonth = this.state.currentMonth + 1
        sessionStorage.setItem(sessionEnums.currentPageTrackerMusicroom_1, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerMusicroom_2, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerMusicroom_month, newMonth.toString())
        this.setState({isLoadingTotalRevenue: true, currentLargeRoomPage: 1, currentSmallRoomPage: 1})
        let promiseMusicroom = this.props.getTotalMusicroom(newMonth)
        Promise.all([promiseMusicroom]).then(values => {
            this.setState({currentMonth: newMonth, 
                currentMusicroomTotal: values[0].data,
                isLoadingTotalRevenue: false})
        })
        var newDate = new Date(newMonth/12, newMonth%12, 1)
        sessionStorage.setItem(sessionEnums.currentDayFilterMusicroom, moment(newDate).format("D/MM/YYYY"))
        this.setState({currentDaySettingValue : newDate})
    }

    handleMinusMonth = () => {
        let newMonth = this.state.currentMonth - 1
        sessionStorage.setItem(sessionEnums.currentPageTrackerMusicroom_1, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerMusicroom_2, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerMusicroom_month, newMonth.toString())
        this.setState({isLoadingTotalRevenue: true, currentLargeRoomPage: 1, currentSmallRoomPage: 1})
        let promiseMusicroom = this.props.getTotalMusicroom(newMonth)
        Promise.all([promiseMusicroom]).then(values => {
            this.setState({currentMonth: newMonth, 
                currentMusicroomTotal: values[0].data,
                isLoadingTotalRevenue: false})
        })
        var newDate = new Date(newMonth/12, newMonth%12, 1)
        sessionStorage.setItem(sessionEnums.currentDayFilterMusicroom, moment(newDate).format("D/MM/YYYY"))
        this.setState({currentDaySettingValue : newDate})
    }

    handleSetMonth = (integerMonth) => {
        let newMonth = integerMonth
        sessionStorage.setItem(sessionEnums.currentPageTrackerMusicroom_1, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerMusicroom_2, "1")
        sessionStorage.setItem(sessionEnums.currentPageTrackerMusicroom_month, newMonth.toString())
        this.setState({isLoadingTotalRevenue: true, currentLargeRoomPage: 1, currentSmallRoomPage: 1})
        let promiseMusicroom = this.props.getTotalMusicroom(newMonth)
        Promise.all([promiseMusicroom]).then(values => {
            this.setState({currentMonth: newMonth, 
                currentMusicroomTotal: values[0].data,
                isLoadingTotalRevenue: false})
        })
        var newDate = new Date(integerMonth/12, integerMonth%12, 1)
        sessionStorage.setItem(sessionEnums.currentDayFilterMusicroom, moment(newDate).format("D/MM/YYYY"))
        this.setState({currentDaySettingValue : newDate})
    }

    handleCheckboxes = (buttonString) => {
        if(buttonString === "1"){
            sessionStorage.setItem(sessionEnums.currentModeTrackerMusicroom, "small")
            this.setState({
                isSelectSmallRoomRecord : true,
                isSelectLargeRoomRecord : false,
            })
        }
        else if(buttonString === "2"){
            sessionStorage.setItem(sessionEnums.currentModeTrackerMusicroom, "large")
            this.setState({
                isSelectSmallRoomRecord : false,
                isSelectLargeRoomRecord : true,
            })
        }
    }

    componentDidMount(){
        this.props.fetchTransaction()
        var elems = document.querySelectorAll('#pagingModal');
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

    isSameDaySetting = (d1) => {
        let d2 = this.state.currentDaySettingValue
        if(this.state.currentDaySetting === true){
            return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
        }
        return true
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
            var {formatDiff, formatEndTime, formatPrice, formatStartTime, _id, day} = item
            var itemDay = new Date(day)

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
                    <td className="smaller_gap">{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                    <td className="smaller_gap">
                        <Link to={{pathname: `/musicrooms/view`,
                                state: {_id} }}>
                            {formatStartAndEndTime}
                        </Link>
                    </td>
                    <td className="smaller_gap">{formatDiff}</td>
                    <td className="smaller_gap">{formatPrice}</td>
                </tr>
            )
        })
    }

    renderLargeroomRecord(filteredTransaction){
        setTimeout(() => {
            this.initModal()
        }, 250);

        return _.map(filteredTransaction, (item, index) => {
            var {formatDiff, formatEndTime, formatPrice, formatStartTime, _id, day} = item
            var itemDay = new Date(day)

            if(index > 0){
                var previousItemDay = new Date(filteredTransaction[index-1].day)
                if(this.isSameDay(itemDay, previousItemDay)){
                    itemDay = null
                }
            }

            moment.locale('th')

            return(
                <tr key={_id}>
                    <td className="smaller_gap">{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                    <td className="smaller_gap">
                        <Link to={{pathname: `/musicrooms/view`,
                                state: {_id} }}>
                            {formatStartTime + "-" + formatEndTime}
                        </Link>
                    </td>
                    <td className="smaller_gap">{formatDiff}</td>
                    <td className="smaller_gap">{formatPrice}</td>
                </tr>
            )
        })
    }

    setCurrentPage(page, type, canClick){
        if(type === "Small" && canClick){
            sessionStorage.setItem(sessionEnums.currentPageTrackerMusicroom_1, page.toString())
            this.setState({currentSmallRoomPage: page})
        }
        else if(type === "Large" && canClick){
            sessionStorage.setItem(sessionEnums.currentPageTrackerMusicroom_2, page.toString())
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

    renderPaginationBodyModal(arrayOfPage, type){
        let activePage = 0
        if(type === "Small"){
            activePage = this.state.currentSmallRoomPage
        }
        else if(type === "Large"){
            activePage = this.state.currentLargeRoomPage
        }
        var returnElement = []
        _.map(arrayOfPage, (page, index) => {
            returnElement.push(<li key={index}  onClick={() => this.setCurrentPage(arrayOfPage[index], type, !(activePage === arrayOfPage[index]))} className={activePage === arrayOfPage[index] ? "active" : "waves-effect"} style={{width: "25px"}}>{arrayOfPage[index]}</li>)
            if(page % 10 === 0){
                returnElement.push(<br />)
            }
        })

        return returnElement
    }

    renderPagination(filteredTransaction, type){
        var numberOfPage = type === "Small" ? this.state.currentSmallRoomPage : this.state.currentLargeRoomPage
        var loop = 0
        var arrayOfPage = []
        
        // case 1 - space between current and maximum more than or equal 2
        // case 1.1 maximum page less than 5 -> show all
        // case 1.2 maximum page more 5 or equal and current >= 3 -> make current into be a middle page
        // case 1.3 same in 1.2 but current less than 3 -> show page from 1 to 5
        // case 2 - space between current and maximum less than 2
        // case 2.1 maximum page less than 5 -> show all
        // case 2.2 maximum page more than 5 or equal -> show with 5 page from (maximum - 4) to (maximum)

        let maximumPage = parseInt(((filteredTransaction.length - 1) / 50) + 1)
        maximumPage = maximumPage === 0 ? 1 : maximumPage 
        
        if(maximumPage < 5){
            for(loop = 1; loop <= maximumPage; loop++){
                arrayOfPage.push(loop)
            }
        }
        else{
            if(maximumPage - numberOfPage >= 2){
                if(numberOfPage > 2){
                    for(loop = numberOfPage - 2; loop <= numberOfPage + 2; loop++){
                        arrayOfPage.push(loop)
                    }
                }
                else{
                    for(loop = 1; loop <= 5; loop++){
                        arrayOfPage.push(loop)
                    }
                }
                
            }
            else{
                for(loop = maximumPage - 4; loop <= maximumPage; loop++){
                    arrayOfPage.push(loop)
                }
            }
        }

        var arrayOfPageModal = []
        for(loop = 1; loop <= maximumPage; loop++){
            arrayOfPageModal.push(loop)
        }

        return(
            <div>
                <div style={{display : 'inline-block'}}>
                    <ul className="col xl12 l12 m12 s12 pagination center">
                        <span style={{fontSize: "17px"}}>หน้า : </span>
                        {this.renderPaginationBody(arrayOfPage, type)}
                    </ul>
                </div>

                <div data-target="pagingModal" className="modal-trigger" style={{display : 'inline-block', bottom: "15px", position: "relative", cursor: "pointer"}}>
                    <i className="material-icons">menu</i>
                </div>

                <div id="pagingModal" className="modal">
                    <div className="modal-content">
                        <h6>เลือกหน้าแสดงผล</h6>
                        <ul className="col xl12 l12 m12 s12 pagination center">
                            {this.renderPaginationBodyModal(arrayOfPageModal, type)}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <div className="modal-close waves-effect waves-light btn-small red white-text" style={{marginRight: "20px"}}>ปิด</div>
                    </div>
                </div>
            </div>
        )
    }

    renderRemainingItem(filteredTransaction){
        var additionalRow = 50 - filteredTransaction.length
                                        
        var loop = 0
        var returnElement = []
        for(loop = 0; loop < additionalRow; loop++){
            returnElement.push(
                <tr key={loop}>
                    <td className="smaller_gap">&nbsp;</td>
                    <td className="smaller_gap">&nbsp;</td>
                    <td className="smaller_gap">&nbsp;</td>
                    <td className="smaller_gap">&nbsp;</td>
                </tr>
            )
            
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
            var smallRoomFilteredTransaction = musicroomTransactions.filter(x => x.roomSize === "Small" && this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth)) &&
            this.isSameDaySetting(new Date(x.day)))
            this.prepareOvernightItem(smallRoomFilteredTransaction)
            smallRoomFilteredTransaction = smallRoomFilteredTransaction.sort(this.sortDayForTransaction)
            var slicedSmallRoomFilteredTransaction = smallRoomFilteredTransaction.slice((this.state.currentSmallRoomPage - 1) * 50, this.state.currentSmallRoomPage * 50)

            var largeRoomFilteredTransaction = musicroomTransactions.filter(x => x.roomSize === "Large" && this.isSameMonth(new Date(x.day), this.handleMonthFilter(this.state.currentMonth))&&
            this.isSameDaySetting(new Date(x.day)))
            this.prepareOvernightItem(largeRoomFilteredTransaction)
            largeRoomFilteredTransaction = largeRoomFilteredTransaction.sort(this.sortDayForTransaction)
            var slicedLargeRoomFilteredTransaction = largeRoomFilteredTransaction.slice((this.state.currentLargeRoomPage - 1) * 50, this.state.currentLargeRoomPage * 50)
        }

        return (
            <div className="container undernav">
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
                                    <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("1")} checked={this.state.isSelectSmallRoomRecord} />
                                    <span>รายการห้องซ้อมเล็ก</span>
                                </label>
                                <label className="col xl4 l4 m5 s6">
                                    <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("2")} checked={this.state.isSelectLargeRoomRecord} />
                                    <span>รายการห้องซ้อมใหญ่</span>
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
                {this.state.isSelectSmallRoomRecord === true && this.state.loadingMusicroomRecord === true && (
                    <div className="row">
                        <div className="col xl12 l12 m12 s12 center">
                        <MonthPicker 
                            handleAddMonth={this.handleAddMonth} 
                            handleMinusMonth={this.handleMinusMonth} 
                            handleSetMonth={this.handleSetMonth}
                            currentMonth={this.state.currentMonth}
                            disabled={this.state.isLoadingTotalRevenue}
                        >
                            <span onClick={() => this.handleDaySetting()} style={{top: "10px", left: "10px", position: "relative", cursor: "pointer"}}>
                                 <i className="material-icons">settings</i>
                            </span>
                        </MonthPicker>
                        </div>

                        {
                            this.state.currentDaySetting === true && (
                                <div className="col xl12 l12 m12 s12">
                                    <DayPickerInput 
                                        classNames={{
                                        container: "input-field col xl6 l8 m8 s12",
                                        overlayWrapper: "DayPickerInput-OverlayWrapper",
                                        overlay: "DayPickerInput-Overlay"
                                        }}
                                        value={this.state.currentDaySettingValue}
                                        onDayChange={this.handleSettingDayChange} 
                                        formatDate={formatDate}
                                        parseDate={parseDate}
                                        format={"LL"}
                                        placeholder={`${formatDate(new Date(), 'LL', 'th')}`}
                                        dayPickerProps={{
                                            locale: 'th',
                                            localeUtils: MomentLocaleUtils,
                                            canChangeMonth: false
                                        }}
                                    />
                                </div>
                            )
                        }
                        <div className="row">
                            <CostMonthlySummaryPanel color={"green lighten-1"} message={"รายรับจากห้องซ้อมดนตรี"} currentMonth={this.state.currentMonth} cost={this.state.currentMusicroomTotal}/>
                        </div>
                        <div className="col xl6 l6 m6 s6" style={{right: "5px", top: "10px", position: "relative"}}>
                            <h6>ห้องซ้อมเล็ก</h6>
                        </div>
                        <div className="col xl6 l6 m6 s6">
                            <div className="right">
                                {this.renderPagination(smallRoomFilteredTransaction, "Small")} 
                            </div>
                        </div>
                        <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative", height: "auto"}}>
                            <table className="highlight import-table">
                                <thead>
                                <tr>
                                    <th className="smaller_height_header smaller_gap">วันที่</th>
                                    <th className="smaller_height_header smaller_gap">เวลา</th>
                                    <th className="smaller_height_header smaller_gap">จำนวน ชม.</th>
                                    <th className="smaller_height_header smaller_gap">ราคา</th>
                                </tr>
                                </thead>
                
                                <tbody>
                                    {this.renderSmallroomRecord(slicedSmallRoomFilteredTransaction)}
                                    {this.renderRemainingItem(slicedSmallRoomFilteredTransaction)}
                                </tbody>
                            </table>
                        </div>
                        {this.renderPagination(smallRoomFilteredTransaction, "Small")}
                    </div>
                )}
                {this.state.isSelectLargeRoomRecord === true && this.state.loadingMusicroomRecord === true && (
                    <div className="row">
                            <div className="col xl12 l12 m12 s12 center">
                            <MonthPicker 
                                handleAddMonth={this.handleAddMonth} 
                                handleMinusMonth={this.handleMinusMonth} 
                                handleSetMonth={this.handleSetMonth}
                                currentMonth={this.state.currentMonth}
                                disabled={this.state.isLoadingTotalRevenue}
                            >
                                <span onClick={() => this.handleDaySetting()} style={{top: "10px", left: "10px", position: "relative", cursor: "pointer"}}>
                                    <i className="material-icons">settings</i>
                                </span>
                            </MonthPicker>
                            {
                                this.state.currentDaySetting === true && (
                                    <div className="col xl12 l12 m12 s12">
                                        <DayPickerInput 
                                            classNames={{
                                            container: "input-field col xl6 l8 m8 s12",
                                            overlayWrapper: "DayPickerInput-OverlayWrapper",
                                            overlay: "DayPickerInput-Overlay"
                                            }}
                                            value={this.state.currentDaySettingValue}
                                            onDayChange={this.handleSettingDayChange} 
                                            formatDate={formatDate}
                                            parseDate={parseDate}
                                            format={"LL"}
                                            placeholder={`${formatDate(new Date(), 'LL', 'th')}`}
                                            dayPickerProps={{
                                                locale: 'th',
                                                localeUtils: MomentLocaleUtils,
                                                canChangeMonth: false
                                            }}
                                        />
                                    </div>
                                )
                            }
                        </div>
                        <div className="row">
                            <CostMonthlySummaryPanel color={"green lighten-1"} message={"รายรับจากห้องซ้อมดนตรี"} currentMonth={this.state.currentMonth} cost={this.state.currentMusicroomTotal}/>
                        </div>
                        <div className="col xl6 l6 m6 s6" style={{right: "5px", top: "10px", position: "relative"}}>
                            <h6>ห้องซ้อมใหญ่</h6>
                        </div>
                        <div className="col xl6 l6 m6 s6">
                            <div className="right">
                                {this.renderPagination(largeRoomFilteredTransaction, "Large")} 
                            </div>
                        </div>
                        <div className="col xl12 l12 m12 s12" style={{right: "5px", position: "relative", height: "auto"}}>
                            <table className="highlight import-table">
                            <thead>
                            <tr>
                                <th className="smaller_height_header smaller_gap">วันที่</th>
                                <th className="smaller_height_header smaller_gap">เวลา</th>
                                <th className="smaller_height_header smaller_gap">จำนวน ชม.</th>
                                <th className="smaller_height_header smaller_gap">ราคา</th>
                            </tr>
                            </thead>
                
                            <tbody>
                                {this.renderLargeroomRecord(slicedLargeRoomFilteredTransaction)}
                                {this.renderRemainingItem(slicedLargeRoomFilteredTransaction)}
                            </tbody>
                            </table>
                        </div>
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
