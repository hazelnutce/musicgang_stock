import React, { Component } from 'react'

export class CostTransactionTableHeader extends Component {
    render() {
        return(
            <>
                <th className="smaller_height_header smaller_gap">วันที่</th>
                <th className="smaller_height_header smaller_gap">รายละเอียด</th>
                <th className="smaller_height_header smaller_gap">จำนวนเงิน</th>
            </>
        )
    }
}

export default CostTransactionTableHeader
