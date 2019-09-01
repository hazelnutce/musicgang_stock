import React, { Component } from 'react'
import {PropagateLoader} from 'react-spinners'
import {ViewHeader} from '../commons/ViewHeader'
import {ViewGeneralBody} from '../commons/ViewGeneralBody'
import {connect} from 'react-redux'
import moment from 'moment'
import {getItem, deleteItem} from '../../actions/item'

export class ViewItemPage extends Component {
    constructor(props){
        super(props)

        this.state = {
            isLoadingRecord : true
        }
    }

    componentDidMount(){
        let {_id} = this.props.location.state
        this.props.getItem(_id)
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
            let {itemName, formatCost, formatRevenue, itemRemaining, itemWarning, _category: {categoryNameTh, stockName}} = this.props.currentRecord
            let newFormatCost = `${formatCost} บาท`
            let newโormatRevenue = `${formatRevenue} บาท`
            console.log(this.props.currentRecord)
            
            return(
                <div>
                    <ViewGeneralBody 
                        arraySubTopicHeader={["ชื่อสินค้า", "หมวดหมู่", "ราคาต้นทุน", "ราคาขาย", "จำนวนคงเหลือปัจจุบัน", "จำนวนสินค้าแจ้งเตือน", "คลังสินค้า"]} 
                        arraySubTopicData={[itemName, categoryNameTh, newFormatCost, newโormatRevenue, itemRemaining, itemWarning, stockName]}
                    />
                </div>
                
            )
            
        }
    }

    render() {
        let {_id} = this.props.location.state
        moment.locale('th')
        if(this.props.currentRecord !== null){
            var {_stock: stockId, itemName, cost, revenue, itemRemaining, itemWarning, _category: {categoryNameTh, stockName}} = this.props.currentRecord
        }
        
        return (
            <div className="container" style={{top: "5px", position: "relative"}}>
                <ViewHeader 
                        headerTopic={"รายละเอียดสินค้า"} 
                        editDestination={`/items/edit/${_id}`} 
                        editState={{stockId, stockName, itemName, category: `${categoryNameTh}`, cost, revenue, itemWarning, itemRemaining}}
                        deletedId={_id}
                        historyInstance={this.props.history}
                        deleteRecordMethod={this.props.deleteItem}
                        deleteConfirmMessage={"คุณต้องการจะลบสินค้านี้ใช่หรือไม่ ?"} >
                </ViewHeader>
                {this.renderLoader(this.state.isLoadingRecord)}
            </div>
        )
    }
}

function mapStateToProps(state){
    return {currentRecord : state.item.currentRecord}
}

export default connect(mapStateToProps, {getItem, deleteItem})(ViewItemPage)
