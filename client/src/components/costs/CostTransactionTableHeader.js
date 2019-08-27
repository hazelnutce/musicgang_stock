import React, { Component } from 'react'

export class CostTransactionTableHeader extends Component {
    render() {
        return(
            <>
                <th>วันที่</th>
                <th>รายละเอียด</th>
                <th>จำนวนเงิน</th>
            </>
        )
    }
}

export default CostTransactionTableHeader
