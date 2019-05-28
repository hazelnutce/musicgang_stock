import React, { Component } from 'react'
import _ from 'lodash'
import moment from 'moment'
import M from 'materialize-css'
import {reduxForm} from 'redux-form'

export class CostTransactionTableBody extends Component {

    isSameMonth = (d1, d2) => {
        return d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();
    }

    handleMonthFilter = (monthConst) => {
        var monthFilter = monthConst % 12
        var yearFilter = monthConst / 12
        return new Date(yearFilter, monthFilter, 1)
    }

    initModal = (className) => {
        var elems = document.querySelectorAll(className);
        M.Modal.init(elems, {
            opacity: 0.6
        });
    }

    render() {
        const {transactions, costType, state, stockId, deleteCostTransaction} = this.props
        
        var filteredTransaction = transactions.filter(x => x.costType === costType && x._stock === stockId &&
                                this.isSameMonth(new Date(x.day), this.handleMonthFilter(state.currentMonth)))

        setTimeout(() => {
            this.initModal(".forDeleteAction")
            this.initModal(".forEditAction")
        }, 200);                        

        return _.map(filteredTransaction, (item) => {
            var {description, day, formatCost, _id} = item
            var itemDay = new Date(day)

            moment.locale('th')
            
            return(
                <tr key={_id}>
                    <td>{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                    <td>{description}</td>
                    <td>{formatCost}</td>
                    {
                        state.isDisplayEditingMenu && (
                        <td>
                            <div style={{display: "inline-block", cursor: "pointer"}} data-target={"edit_" + item._id} className="modal-trigger"><i className="material-icons black-text">edit</i></div>
                            <div style={{display: "inline-block", cursor: "pointer"}} data-target={item._id} className="modal-trigger"><i className="material-icons black-text">delete</i></div>
                        </td>
                        )
                    }
                    <td>
                        <div id={"edit_" + item._id} className="modal forEditAction">
                            <div className="modal-content">
                                {"edit_" + item._id}
                            </div>
                            <div className="modal-footer">
                                Test
                            </div>
                        </div> 
                    </td>
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
            )
        })
    }
}

function validate(values){
    const errors = {}
    
    if(!values.description){
        errors.description = "กรุณาระบุคำอธิบายรายการ"
    }

    else if(values.description.length > 50){
        errors.description = "คำอธิบายรายการต้องไม่เกิน 50 อักษร"
    }

    if(!values.cost){
        errors.cost = "กรุณาระบุค่าใช้จ่ายของรายการ"
    }

    else if(parseFloat(values.cost) >= 1000000){
        errors.cost = "มูลค่ารายการควรน้อยกว่า 1,000,000 บาท"
    }

    return errors
}

CostTransactionTableBody = reduxForm({
    form: 'editCostTransaction',
    validate
})(CostTransactionTableBody)

export default (CostTransactionTableBody)
