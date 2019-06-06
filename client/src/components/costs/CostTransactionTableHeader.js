import React, { Component } from 'react'

export class CostTransactionTableHeader extends Component {
    render() {
        if(this.props.isDisplayEditingMenu){
            return(
                <>
                    <th>วันที่</th>
                    <th>รายละเอียด</th>
                    <th>จำนวนเงิน</th>
                    <th></th>
                    <th></th>
                </>
            )
        }
        else{
            return(
                <>
                    <th>วันที่</th>
                    <th>รายละเอียด</th>
                    <th>จำนวนเงิน</th>
                    <th></th>
                </>
            )
        }
    }
}

export default CostTransactionTableHeader
