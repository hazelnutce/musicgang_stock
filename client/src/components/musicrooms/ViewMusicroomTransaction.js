import React, { Component } from 'react'
import {PropagateLoader} from 'react-spinners'
import {ViewHeader} from '../commons/ViewHeader'
import {ViewGeneralBody} from '../commons/ViewGeneralBody'
import {getMusicroomTransaction, deleteMusicroomTransaction, resetMusicroomTransactionError} from '../../actions/musicroomTransaction'
import {connect} from 'react-redux'
import moment from 'moment'
import ReactNotification from "react-notifications-component";

export class ViewMusicroomTransaction extends Component {

    constructor(props){
        super(props)

        this.notificationDOMRef = React.createRef();
        this.state = {
            isLoadingRecord : true
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

    componentDidMount(){
        let {_id} = this.props.location.state
        this.props.getMusicroomTransaction(_id)
    }

    componentDidUpdate(prevProps){
        if(this.props.currentRecord !== prevProps.currentRecord){
            this.setState({isLoadingRecord: false})
        }
        if(this.props.musicroom.musicroomTransactionError !== prevProps.musicroom.musicroomTransactionError)
        {
          if(this.props.musicroom.musicroomTransactionError != null){
            this.addNotification(this.props.musicroom.musicroomTransactionError)
          }
        }
    }

    renderLoader(loading){
        moment.locale('th')

        if(loading){
            return(
                <div className="row">
                    <div className="col xl9 offset-xl3 m9 offset-m3 l9 offset-l3 s9 offset-s3">
                        <PropagateLoader
                            size={15}
                            color={"#34ebb7"}
                        />
                    </div>
                    
                </div>
            )
            
        }
        else{
            let {day, formatStartTime, formatEndTime, formatDiff, formatPrice, roomSize} = this.props.currentRecord
            let formatStartAndEndTime = formatStartTime + "-" + formatEndTime
            let newFormatPrice = formatPrice + " บาท"
            let newRoomSize = roomSize === "Small" ? "ห้องเล็ก" : "ห้องใหญ่"
            return(
                <div>
                    <ViewGeneralBody 
                        arraySubTopicHeader={["วันที่", "เวลาซ้อม", "เวลารวม", "ราคารวม", "ห้องซ้อม"]} 
                        arraySubTopicData={[moment(day).format('ll'), formatStartAndEndTime, formatDiff, newFormatPrice, newRoomSize]}
                    />
                </div>
                
            )
            
        }
    }

    render() {
        moment.locale('th')
        if(this.props.currentRecord !== null){
            var {day, formatPrice, roomSize, isStudentDiscount, isOverNight, startTime, endTime, _id, isSelectCustomPrice} = this.props.currentRecord
        }
        
        return (
            <div className="container undernav">
                <ViewHeader 
                        headerTopic={"รายละเอียดห้องซ้อม"} 
                        editDestination={"/musicrooms/edit"} 
                        editState={{itemDay: new Date(day), roomSize, isStudentDiscount, isOverNight, startTime, endTime, _id, isSelectCustomPrice, formatPrice}}
                        deletedId={_id}
                        historyInstance={this.props.history}
                        deleteRecordMethod={this.props.deleteMusicroomTransaction}
                        deleteConfirmMessage={"คุณต้องการจะลบรายการห้องซ้อมนี้ใช่หรือไม่ ?"} >
                </ViewHeader>
                {this.renderLoader(this.state.isLoadingRecord)}
                <div>
                  <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
                    this.props.resetMusicroomTransactionError()
                  }} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {currentRecord : state.musicroom.currentMusicroomTransaction, musicroom: state.musicroom}
}

export default connect(mapStateToProps, {getMusicroomTransaction, deleteMusicroomTransaction, resetMusicroomTransactionError})(ViewMusicroomTransaction)
