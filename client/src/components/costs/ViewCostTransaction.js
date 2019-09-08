import React, { Component } from 'react'
import {connect} from 'react-redux'
import {PropagateLoader} from 'react-spinners'
import {ViewHeader} from '../commons/ViewHeader'
import {ViewGeneralBody} from '../commons/ViewGeneralBody'
import {getCostTransaction, deleteCostTransaction, resetCostTransactionError} from '../../actions/costTransaction'
import moment from 'moment'
import ReactNotification from "react-notifications-component";

export class ViewCostTransaction extends Component {
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
        this.props.getCostTransaction(_id)
    }

    componentDidUpdate(prevProps){
        if(this.props.currentRecord !== prevProps.currentRecord){
            this.setState({isLoadingRecord: false})
        }
        if(this.props.cost.costTransactionError !== prevProps.cost.costTransactionError)
        {
            if(this.props.cost.costTransactionError != null){
                this.addNotification(this.props.cost.costTransactionError)
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
            var {day, costType, description, formatCost} = this.props.currentRecord
            let newFormatCost = formatCost + " บาท"
            let newCostType = costType === "Cost" ? "ค่าใช้จ่าย" : "รายรับ"
            return(
                <div>
                    <ViewGeneralBody 
                        arraySubTopicHeader={["วันที่", "รายละเอียด", "ราคา", "ประเภท"]} 
                        arraySubTopicData={[moment(day).format('ll'), description, newFormatCost, newCostType]}
                    />
                </div>
                
            )
            
        }
    }

    render() {
        moment.locale('th')
        let {stockId} = this.props.location.state
        if(this.props.currentRecord !== null){
            var {day, costType, description, _id, cost} = this.props.currentRecord
        }
        
        return (
            <div className="container undernav">
                <ViewHeader 
                        headerTopic={"รายละเอียดค่าใช้จ่าย"} 
                        editDestination={"/costs/edit"} 
                        editState={{itemDay: new Date(day), description, cost, _id, costType, stockId}}
                        deletedId={_id}
                        historyInstance={this.props.history}
                        deleteRecordMethod={this.props.deleteCostTransaction}
                        deleteConfirmMessage={"คุณต้องการจะลบรายการค่าใช้จ่ายนี้ใช่หรือไม่ ?"} >
                </ViewHeader>
                {this.renderLoader(this.state.isLoadingRecord)}
                 <div>
                    <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
                        this.props.resetCostTransactionError()
                    }} />
                 </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {currentRecord : state.cost.currentRecord, cost : state.cost}
}

export default connect(mapStateToProps, {getCostTransaction, deleteCostTransaction, resetCostTransactionError})(ViewCostTransaction)
