import React, { Component } from 'react'
import _ from 'lodash'
import moment from 'moment'
import {Link} from 'react-router-dom'
import M from 'materialize-css'

export class CostTransactionTableBody extends Component {

    constructor(props){
        super(props)

        this.state = {
            initializedModal: false
        }
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

    handleDayChange = (day) => {
        if((day instanceof Date)){
            this.setState({ selectedDay: day })
        }
    }

    isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
    }

    initmodal(){
        var elems = document.querySelectorAll('.forDeleteAction');
        M.Modal.init(elems, {
            opacity: 0.6,
            endingTop: '20%',
        });
    }

    render() {
        console.log(this.state.initializedModal)
        const {transactions, costType, state, stockId, deleteCostTransaction} = this.props
        
        var filteredTransaction = transactions.filter(x => x.costType === costType && x._stock === stockId &&
                                this.isSameMonth(new Date(x.day), this.handleMonthFilter(state.currentMonth)))

        setTimeout(() => {
            this.initmodal()
        }, 200);

        return _.map(filteredTransaction, (item, index) => {
            let {description, day, formatCost, _id, cost, costType} = item
            var itemDay = new Date(day)

            var copiedItemDay = itemDay
            if(index > 0){
                var previousItemDay = new Date(filteredTransaction[index-1].day)
                if(this.isSameDay(itemDay, previousItemDay)){
                    itemDay = null
                }
            }

            moment.locale('th')
            
            return(
                <React.Fragment key={_id}>
                <tr >
                    <td>{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                    <td>{description}</td>
                    <td>{formatCost}</td>
                    {
                        state.isDisplayEditingMenu && (
                        <td>
                            <div style={{display: "inline-block", marginRight: "10px", cursor: "pointer"}}>
                                <Link to={{ pathname: `/costs/edit`,
                                    state: {itemDay: copiedItemDay, description, cost, _id, costType, stockId} }} 
                                    className="material-icons black-text">edit
                                </Link>
                            </div>
                            <div style={{display: "inline-block", cursor: "pointer"}} data-target={item._id} className="modal-trigger"><i className="material-icons black-text">delete</i></div>
                        </td>
                        )
                    }
                    <td>
                        <div id={item._id} className="modal forDeleteAction">
                            <div className="modal-content">
                                <h4>ยืนยันการลบ</h4>
                                <p>คุณต้องการจะลบรายการค่าใช้จ่ายนี้ใช่หรือไม่ ?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="green modal-close waves-effect waves-light btn" onClick={() => deleteCostTransaction(item._id)} style={{position: "relative", right: "20px"}}><i className="material-icons right">add_circle</i>ยืนยัน</button> 
                                <button className="red modal-close waves-effect waves-light btn"><i className="material-icons right">cancel</i>ยกเลิก</button>
                            </div>
                        </div> 
                    </td>
                </tr>
                </React.Fragment>
            )
        })
    }
}
