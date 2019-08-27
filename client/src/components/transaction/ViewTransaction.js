import React, { Component } from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import {PropagateLoader} from 'react-spinners'

import {getTransaction, refundTransaction, resetEditTransactionError} from '../../actions/transaction'
import {fetchItems} from '../../actions/item'
import {ViewHeader} from '../commons/ViewHeader'
import {ViewGeneralBody} from '../commons/ViewGeneralBody'
import ReactNotification from "react-notifications-component";

export class ViewTransaction extends Component {

    constructor(props){
        super(props)

        this.notificationDOMRef = React.createRef();
        this.state = {
            isLoadingRecord : true,
            isLoadingItem : true
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
        let {_id, stockId} = this.props.location.state
        this.props.getTransaction(_id)
        this.props.fetchItems(stockId)
    }

    componentDidUpdate(prevProps){
        if(this.props.currentRecord !== prevProps.currentRecord){
            this.setState({isLoadingRecord: false})
        }
        if(this.props.items !== prevProps.items){
            this.setState({isLoadingItem: false})
        }
        if(this.props.transaction.transactionEditError !== prevProps.transaction.transactionEditError)
        {
            if(this.props.transaction.transactionEditError != null){
            this.addNotification(this.props.transaction.transactionEditError)
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
             let {day, itemName, formatCost, formatRevenue, itemAmount, formatTotal, formatDiscount, formatOvercost, discount, overcost, type} = this.props.currentRecord
             let formatCostPerUnit = ""
             let discountAndOvercostMessage = ""
             let discountMessage = `ส่วนลด ${formatDiscount} บาท`
             let overcostMessage = `ส่วนเกิน ${formatOvercost} บาท`

            if(type === "import"){
                formatCostPerUnit = `${formatCost} บาท`
            }
            else if(type === "export"){
                formatCostPerUnit = `${formatRevenue} บาท`
            }

            if(discount !== 0 && overcost !== 0){
                discountAndOvercostMessage = discountMessage + " / " + overcostMessage
            }
            else if(discount !== 0){
                discountAndOvercostMessage = discountMessage
            }
            else if(overcost !== 0){
                discountAndOvercostMessage = overcostMessage
            }
            else{
                discountAndOvercostMessage = "-"
            }

            return(
                <div>
                    <ViewGeneralBody 
                        arraySubTopicHeader={["วันที่", "สินค้า", "ราคาต่อหน่วย", "จำนวน", "ราคาอื่นๆ", "ราคารวม"]} 
                        arraySubTopicData={[moment(day).format('ll'), itemName, formatCostPerUnit, itemAmount, discountAndOvercostMessage, `${formatTotal} บาท`]}
                    />
                </div>
                
            )
            
        }
    }

    render() {
        moment.locale('th')
        if(this.props.currentRecord !== null && this.props.items != null){
            var {_id, itemName, itemAmount, formatTotal, formatDiscount, formatOvercost, day, _item} = this.props.currentRecord
            var isItemValid = true
            var items = this.props.items

            var filterItem = items.filter(x => x._id === _item)
            if(filterItem.length === 1){
                itemName = filterItem[0].itemName
            }
            else{
                isItemValid = false
            }

            var isExportMode = this.props.currentRecord.type === "export"
        }

        return (
            <div className="container" style={{top: "5px", position: "relative"}}>
                <ViewHeader 
                        headerTopic={"รายละเอียดสินค้า"} 
                        editDestination={"/transactions/edit"} 
                        editState={{ _id, itemDay: new Date(day), itemName, itemAmount, formatDiscount, formatOvercost, formatTotal, items, isExportMode, isValid: isItemValid}}
                        deletedId={_id}
                        historyInstance={this.props.history}
                        deleteRecordMethod={this.props.refundTransaction}
                        deleteConfirmMessage={"คุณต้องการจะลบรายการสินค้านี้ใช่หรือไม่ ?"} >
                </ViewHeader>
                {this.renderLoader(this.state.isLoadingRecord)}
                <div>
                  <ReactNotification ref={this.notificationDOMRef} onNotificationRemoval={() => {
                    this.props.resetEditTransactionError()
                  }} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {currentRecord : state.transaction.currentRecord, items: state.item.items, transaction : state.transaction}
}

export default connect(mapStateToProps, {getTransaction, fetchItems, refundTransaction, resetEditTransactionError})(ViewTransaction)
