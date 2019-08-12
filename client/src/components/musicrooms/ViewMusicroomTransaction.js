import React, { Component } from 'react'
import {ViewHeader} from '../commons/ViewHeader'
import {ViewGeneralBody} from '../commons/ViewGeneralBody'
import moment from 'moment'

export class ViewMusicroomTransaction extends Component {
    renderMusicroomDetail = () => {
        let {itemDay, formatStartAndEndTime, formatDiff, formatPrice, roomSize} = this.props.location.state
        formatPrice = formatPrice + " บาท"
        roomSize = roomSize === "Small" ? "ห้องเล็ก" : "ห้องใหญ่"
        return (
            <div>
                <p style={{top: "20px", left: "20px", position: "relative"}}>
                    วันที่ :  {moment(itemDay).format('ll')} <br />
                    เวลาซ้อม : {formatStartAndEndTime} <br />
                    เวลารวม : {formatDiff} <br />
                    ราคารวม : {formatPrice}<br />
                    ห้องซ้อม : {roomSize} <br />
                </p>
                <div className="divider" style={{top: "20px", left: "20px", position: "relative"}}></div>
            </div>
            
        )
    }

    render() {
        moment.locale('th')
        let {itemDay, formatStartAndEndTime, formatDiff, formatPrice, roomSize} = this.props.location.state
        formatPrice = formatPrice + " บาท"
        roomSize = roomSize === "Small" ? "ห้องเล็ก" : "ห้องใหญ่"

        return (
            <div className="container" style={{top: "5px", position: "relative"}}>
                <ViewHeader headerTopic={"รายละเอียดห้องซ้อม"}/>
                <ViewGeneralBody 
                    arraySubTopicHeader={["วันที่", "เวลาซ้อม", "เวลารวม", "ราคารวม", "ห้องซ้อม"]} 
                    arraySubTopicData={[moment(itemDay).format('ll'), formatStartAndEndTime, formatDiff, formatPrice, roomSize]}
                />
            </div>
        )
    }
}



export default ViewMusicroomTransaction
