import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import TransactionListSummaryPage from './TransactionListSummaryPage';
import {fetchItems} from '../../actions/item'
import {LoaderSpinner} from '../commons/LoaderSpinner'
import {ErrorProcessNotice} from '../commons/ErrorProcessNotice'

const shiftLeftMinus45 = {
    left: "-45px",
    position: "relative"
}

export class TransactionSummaryPage extends Component {
    constructor(props){
        super(props)

        this.state = {
            isSelectAllTransaction : true,
            isSelectTransactionIn : true,
            isSelectTransactionOut : true,
            isLoadingItem: false
        }
    }

    handleCheckboxes = (buttonString) => {
        if(buttonString === "1"){
            if(this.state.isSelectAllTransaction === false){
                this.setState({
                    isSelectAllTransaction : true,
                    isSelectTransactionIn : true,
                    isSelectTransactionOut : true,
                })
            }
        }
        else if(buttonString === "2"){
            this.setState({
                isSelectAllTransaction : false,
                isSelectTransactionIn : true,
                isSelectTransactionOut : false,
            })
        }
        else if(buttonString === "3"){
            this.setState({
                isSelectAllTransaction : false,
                isSelectTransactionIn : false,
                isSelectTransactionOut : true,
            })
        }
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.allItemProperties.items !== this.props.allItemProperties.items) {
            this.setState({isLoadingItem: true}) 
        }
    }

    componentDidMount = () => {
        const {stockId} = this.props.location.state
        this.props.fetchItems(stockId)
    }

    render() {
        const {stockName, stockId} = this.props.location.state
        if(stockName == null || stockId == null){
            return(
                <ErrorProcessNotice />
            )
        }

        if(!this.state.isLoadingItem){
            return (
              <LoaderSpinner loading={this.state.loadingCategory} color={'#123abc'}/>
            )
        }

        return (
        <div className="container" style={{position: "relative", top: "5px"}}>
            <div className="row">
                <div className="col xl9 l9 m8 s12">
                    <h5 className="col s12 m12 l12 xl12">
                        <i>
                            <FontAwesomeIcon className="fas fa-sm" icon="arrow-up"/>
                        </i>
                        <i style={shiftLeftMinus45}><FontAwesomeIcon className="fas fa-sm" icon="arrow-down"/>
                        </i> 
                        รายการเปลี่ยนแปลง / คลัง : {stockName}
                    </h5>
                    <div className="col s12 m12 l12 xl12">
                        <label className="col xl4 l4 m5 s6">
                            <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("1")} checked={this.state.isSelectAllTransaction} />
                            <span>แสดงรายการทั้งหมด</span>
                        </label>
                        <label className="col xl4 l4 m5 s6">
                            <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("2")} checked={this.state.isSelectTransactionIn} />
                            <span>แสดงรายการนำเข้า</span>
                        </label>
                        <label className="col xl4 l4 m5 s6">
                            <input type="checkbox" className="filled-in" onChange={() => this.handleCheckboxes("3")} checked={this.state.isSelectTransactionOut} />
                            <span>แสดงรายการนำออก</span>
                        </label>
                    </div>
                </div>
                <div className="col xl3 l3 m4 s12">
                    <div className="col xl12 l12 m12 s12" style={{top: "15px", position: "relative"}}>
                        <Link to={{ pathname: `/transactions/new/import`, state: {stockName : stockName, stockId: stockId, items: this.props.allItemProperties.items}}}  className="waves-effect waves-light btn-small green accent-3"><i className="material-icons right">arrow_upward</i>นำเข้า</Link>
                    </div>
                    <div className="col xl12 l12 m12 s12" style={{top: "25px", position: "relative"}}>
                        <Link to={{ pathname: `/transactions/new/export`, state: {stockName : stockName, stockId: stockId, items: this.props.allItemProperties.items}}}  className="waves-effect waves-light btn-small red accent-2"><i className="material-icons right">arrow_downward</i>นำออก</Link>
                    </div>
                </div>
            </div>
            <TransactionListSummaryPage 
                isSelectAllTransaction={this.state.isSelectAllTransaction} 
                isSelectTransactionIn={this.state.isSelectTransactionIn} 
                isSelectTransactionOut={this.state.isSelectTransactionOut}
                items={this.props.allItemProperties.items}
                stockId={stockId}
            />
        </div>
        )
    }
}

function mapStateToProps(state){
    return {allItemProperties: state.item}
}

export default connect(mapStateToProps, {fetchItems})(TransactionSummaryPage)
