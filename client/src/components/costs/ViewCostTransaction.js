import React, { Component } from 'react'
import {connect} from 'react-redux'
import {PropagateLoader} from 'react-spinners'
import {ViewHeader} from '../commons/ViewHeader'
import {ViewGeneralBody} from '../commons/ViewGeneralBody'
import {getCostTransaction, deleteCostTransaction} from '../../actions/costTransaction'
import moment from 'moment'

export class ViewCostTransaction extends Component {
    constructor(props){
        super(props)

        this.state = {
            isLoadingRecord : true
        }
    }

    componentDidMount(){
        let {_id} = this.props.location.state
        this.props.getCostTransaction(_id)
    }

    componentDidUpdate(prevProps){
        if(this.props.currentRecord !== prevProps.currentRecord){
            this.setState({isLoadingRecord: false})
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
            <div className="container" style={{top: "5px", position: "relative"}}>
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
                 
            </div>
        )
    }
}

function mapStateToProps(state){
    return {currentRecord : state.cost.currentRecord}
}

export default connect(mapStateToProps, {getCostTransaction, deleteCostTransaction})(ViewCostTransaction)
