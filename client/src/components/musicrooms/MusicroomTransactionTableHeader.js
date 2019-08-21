import React, { Component } from 'react'

export class MusicroomTransactionTableHeader extends Component {
    render() {
            return(
                <>
                    <th>วันที่</th>
                    <th>เวลา</th>
                    <th>จำนวน ชม.</th>
                    <th>ราคา</th>
                </>
            )
    }
}

export default MusicroomTransactionTableHeader