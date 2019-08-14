import React, { Component } from 'react'
import {ViewHeader} from '../commons/ViewHeader'
import {ViewGeneralBody} from '../commons/ViewGeneralBody'
import moment from 'moment'

export class ViewMusicroomTransaction extends Component {
    render() {
        moment.locale('th')
        let {itemDay, formatStartAndEndTime, formatDiff, formatPrice, roomSize, isStudentDiscount, isOverNight, startTime, endTime, _id, isSelectCustomPrice} = this.props.location.state
        let newFormatPrice = formatPrice + " บาท"
        let newRoomSize = roomSize === "Small" ? "ห้องเล็ก" : "ห้องใหญ่"

        return (
            <div className="container" style={{top: "5px", position: "relative"}}>
                <ViewHeader 
                    headerTopic={"รายละเอียดห้องซ้อม"} 
                    editDestination={"/musicrooms/edit"} 
                    editState={{itemDay, roomSize, isStudentDiscount, isOverNight, startTime, endTime, _id, isSelectCustomPrice, formatPrice}}/>
                <ViewGeneralBody 
                    arraySubTopicHeader={["วันที่", "เวลาซ้อม", "เวลารวม", "ราคารวม", "ห้องซ้อม"]} 
                    arraySubTopicData={[moment(itemDay).format('ll'), formatStartAndEndTime, formatDiff, newFormatPrice, newRoomSize]}
                />
            </div>
        )
    }
}



export default ViewMusicroomTransaction
