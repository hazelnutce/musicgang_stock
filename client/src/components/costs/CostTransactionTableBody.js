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

    numberWithCommas(x) {
        if(x != null){
          var parts = x.toString().split(".");
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return parts.join(".");
        }
        return null
      }

    initmodal(){
        var elems = document.querySelectorAll('.forDeleteAction');
        M.Modal.init(elems, {
            opacity: 0.6,
            endingTop: '20%',
        });
    }

    sortDayForTransaction = (a,b) => {
        var newADay = new Date(a.day)
        var newBDay = new Date(b.day)
        if(newADay < newBDay)
            return -1
        if(newADay > newBDay)
            return 1
        return 0
    }

    componentWillReceiveProps(prevProps){
        if(prevProps.state.currentMonth !== this.props.state.currentMonth){
            this.setState({importStopLoading: false, exportStopLoading: false})
        }
    }

    guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      }

    render() {
        let returnTableRow = []
        let backGroundColor = "";
        let fontSize = ""
        
        const {transactions, costType, state, stockId, deleteCostTransaction} = this.props
        
        var filteredTransaction = transactions.filter(x => x.costType === costType && x._stock === stockId &&
                                this.isSameMonth(new Date(x.day), this.handleMonthFilter(state.currentMonth)))

        filteredTransaction = filteredTransaction.sort(this.sortDayForTransaction)
        
        if(costType === "Cost"){
            filteredTransaction.unshift({
                day: new Date(state.currentMonth / 12,state.currentMonth % 12, 1),
                _id: this.guid(),
                description: "รายจ่ายคลังสินค้าประจำเดือน",
                formatCost: this.numberWithCommas(parseFloat(state.currentImportTotal).toFixed(2)),
            })
            backGroundColor = "#ef5350";
            filteredTransaction = filteredTransaction.slice((state.currentCostPage - 1) * 20, state.currentCostPage * 20)
        }
        else if(costType === "Revenue"){
            filteredTransaction.unshift({
                day: new Date(state.currentMonth / 12,state.currentMonth % 12, 1),
                _id: this.guid(),
                description: "รายรับคลังสินค้าประจำเดือน",
                formatCost: this.numberWithCommas(parseFloat(state.currentExportTotal).toFixed(2)),
            })
            backGroundColor = "#00e676";
            filteredTransaction = filteredTransaction.slice((state.currentRevenuePage - 1) * 20, state.currentRevenuePage * 20)
        }

        setTimeout(() => {
            this.initmodal()
        }, 200);

        _.map(filteredTransaction, (item, index) => {
            let {description, day, formatCost, _id, cost, costType} = item
            var itemDay = new Date(day)
            var preparedDescription = description

            var copiedItemDay = itemDay
            if(index > 0){
                var previousItemDay = new Date(filteredTransaction[index-1].day)
                if(this.isSameDay(itemDay, previousItemDay)){
                    itemDay = null
                }
            }

            moment.locale('th')
            backGroundColor = index === 0 ? backGroundColor : ""

            if(preparedDescription.length > 25){
                preparedDescription = preparedDescription.substring(0,22)
                preparedDescription = preparedDescription + "..."
            }
            else{
                fontSize = "15px"
            }
            
            returnTableRow.push(
                <React.Fragment key={_id}>
                <tr style={{backgroundColor : backGroundColor}}>
                    <td>{itemDay !== null ? moment(itemDay).format('ll') : null}</td>
                    <td style={{fontSize}}>{preparedDescription}</td>
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

        var additionalRow = 20 - filteredTransaction.length
                                       
        var loop = 0
        for(loop = 0; loop < additionalRow; loop++){
            if(state.isDisplayEditingMenu === false){
                returnTableRow.push(
                    <tr key={loop}>
                        <td style={{lineHeight: "22px"}}>&nbsp;</td>
                        <td style={{lineHeight: "22px"}}>&nbsp;</td>
                        <td style={{lineHeight: "22px"}}>&nbsp;</td>
                        <td style={{lineHeight: "22px"}}>&nbsp;</td>
                    </tr>
                )
            }
            else{
                returnTableRow.push(
                    <tr key={loop}>
                        <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                        <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                        <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                        <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                        <td style={{lineHeight: "29.5px"}}>&nbsp;</td>
                    </tr>
                )
            }
            

        }

        return returnTableRow
    }
}

export default (CostTransactionTableBody)
